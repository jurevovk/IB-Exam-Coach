import { inflateRawSync, inflateSync } from "node:zlib";

type ZipEntry = {
  name: string;
  method: number;
  compressedSize: number;
  localHeaderOffset: number;
};

const decodeXmlEntities = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const cleanExtractedText = (value: string) =>
  value
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const findEndOfCentralDirectory = (buffer: Buffer) => {
  for (let index = buffer.length - 22; index >= 0; index -= 1) {
    if (buffer.readUInt32LE(index) === 0x06054b50) {
      return index;
    }
  }

  return -1;
};

const readZipEntries = (buffer: Buffer): ZipEntry[] => {
  const eocdOffset = findEndOfCentralDirectory(buffer);

  if (eocdOffset < 0) {
    throw new Error("Invalid DOCX archive.");
  }

  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  let offset = buffer.readUInt32LE(eocdOffset + 16);
  const entries: ZipEntry[] = [];

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      break;
    }

    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const nameStart = offset + 46;
    const name = buffer.toString("utf8", nameStart, nameStart + nameLength);

    entries.push({ name, method, compressedSize, localHeaderOffset });
    offset = nameStart + nameLength + extraLength + commentLength;
  }

  return entries;
};

const readZipEntry = (buffer: Buffer, entry: ZipEntry) => {
  const offset = entry.localHeaderOffset;

  if (buffer.readUInt32LE(offset) !== 0x04034b50) {
    throw new Error("Invalid DOCX entry.");
  }

  const nameLength = buffer.readUInt16LE(offset + 26);
  const extraLength = buffer.readUInt16LE(offset + 28);
  const dataStart = offset + 30 + nameLength + extraLength;
  const compressed = buffer.subarray(dataStart, dataStart + entry.compressedSize);

  if (entry.method === 0) {
    return compressed;
  }

  if (entry.method === 8) {
    return inflateRawSync(compressed);
  }

  throw new Error("Unsupported DOCX compression.");
};

export const extractDocxText = (buffer: Buffer) => {
  const entries = readZipEntries(buffer);
  const documentEntry = entries.find((entry) => entry.name === "word/document.xml");

  if (!documentEntry) {
    throw new Error("DOCX document text was not found.");
  }

  const xml = readZipEntry(buffer, documentEntry).toString("utf8");
  const text = xml
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<\/w:tr>/g, "\n")
    .replace(/<[^>]+>/g, "");

  return cleanExtractedText(decodeXmlEntities(text));
};

const decodePdfString = (value: string) =>
  value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");

const decodePdfHex = (value: string) => {
  const clean = value.replace(/\s+/g, "");
  const bytes: number[] = [];

  for (let index = 0; index < clean.length - 1; index += 2) {
    bytes.push(Number.parseInt(clean.slice(index, index + 2), 16));
  }

  return Buffer.from(bytes).toString("utf16le").replace(/\u0000/g, "");
};

const extractTextOperators = (value: string) => {
  const literalMatches = Array.from(value.matchAll(/\(([^()]*)\)\s*T[jJ]/g)).map(
    (match) => decodePdfString(match[1] ?? "")
  );
  const arrayMatches = Array.from(value.matchAll(/\[([\s\S]*?)\]\s*TJ/g)).flatMap(
    (match) =>
      Array.from((match[1] ?? "").matchAll(/\(([^()]*)\)/g)).map((item) =>
        decodePdfString(item[1] ?? "")
      )
  );
  const hexMatches = Array.from(value.matchAll(/<([0-9A-Fa-f\s]+)>\s*T[jJ]/g)).map(
    (match) => decodePdfHex(match[1] ?? "")
  );

  return [...literalMatches, ...arrayMatches, ...hexMatches].join(" ");
};

const inflatePdfStream = (stream: Buffer) => {
  try {
    return inflateSync(stream).toString("latin1");
  } catch {
    try {
      return inflateRawSync(stream).toString("latin1");
    } catch {
      return "";
    }
  }
};

export const extractPdfText = (buffer: Buffer) => {
  const raw = buffer.toString("latin1");
  const streamTexts = Array.from(raw.matchAll(/<<(?:.|\n|\r)*?\/FlateDecode(?:.|\n|\r)*?>>\s*stream\r?\n([\s\S]*?)\r?\nendstream/g)).map(
    (match) => inflatePdfStream(Buffer.from(match[1] ?? "", "latin1"))
  );
  const operatorText = [raw, ...streamTexts]
    .map(extractTextOperators)
    .filter(Boolean)
    .join("\n");
  const fallbackText = raw
    .replace(/[^A-Za-z0-9.,;:?!'"()\-\s]/g, " ")
    .replace(/\s+/g, " ");

  return cleanExtractedText(operatorText || fallbackText);
};

export const extractPlainText = (buffer: Buffer) =>
  cleanExtractedText(buffer.toString("utf8"));
