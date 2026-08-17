export type Profession =
  | "Student"
  | "Working Professional"
  | "Business Owner"
  | "Freelancer"
  | "Trainer/Coach"
  | "Digital Marketer"
  | "Other";

export type LearningGoal =
  | "Business Automation"
  | "Career Growth"
  | "Freelancing"
  | "Content Creation"
  | "Online Income"
  | "Personal Productivity";

export interface RegistrationPayload {
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  whatsappSameAsMobile: boolean;
  email: string;
  city: string;
  profession: Profession | "";
  learningGoal: LearningGoal | "";
  consent: boolean;
  webinarName: string;
  webinarMode: "FREE" | "PAID";
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referredBy: string;
  consentTimestamp: string;
}

export interface RegistrationResult {
  registrationId: string;
  registeredAt: string;
  payload: RegistrationPayload;
  /** The CRM lead's own id, returned by POST /leads. */
  leadId: string;
}
