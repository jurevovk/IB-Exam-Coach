import { getComputerScienceEeGuidance } from "@/lib/rubrics/ee/computerScience";
import { getEconomicsEeGuidance } from "@/lib/rubrics/ee/economics";
import { getMathematicsEeGuidance } from "@/lib/rubrics/ee/mathematics";
import type { EeRubricVersion, EeSubject } from "@/lib/rubrics/types";

export const getEeSubjectGuidance = (
  subject: EeSubject,
  rubricVersion: EeRubricVersion
) => {
  if (subject === "mathematics") {
    return getMathematicsEeGuidance(rubricVersion);
  }

  if (subject === "economics") {
    return getEconomicsEeGuidance(rubricVersion);
  }

  return getComputerScienceEeGuidance(rubricVersion);
};
