export type { ProcessTemplate } from "./types";
export { purchaseApprovalTemplate } from "./purchaseApproval";
export { employeeOnboardingTemplate } from "./employeeOnboarding";
export { customerSupportEscalationTemplate } from "./customerSupportEscalation";

import { purchaseApprovalTemplate } from "./purchaseApproval";
import { employeeOnboardingTemplate } from "./employeeOnboarding";
import { customerSupportEscalationTemplate } from "./customerSupportEscalation";
import type { ProcessTemplate } from "./types";

export const processTemplates: ProcessTemplate[] = [
  purchaseApprovalTemplate,
  employeeOnboardingTemplate,
  customerSupportEscalationTemplate,
];
