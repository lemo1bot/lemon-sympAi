
export enum ActiveTab {
  ScanSymptom = 'ScanSymptom',
  DescribeSymptom = 'DescribeSymptom',
}

export interface OTCRecommendation {
  medicineName: string;
  dosage: string;
}

export interface PotentialCondition {
  conditionName: string;
  otcRecommendations: OTCRecommendation[];
  reasoning: string;
}

export interface GeminiResponseData {
  analysisTitle: string;
  summary?: string;
  potentialConditions: PotentialCondition[];
  importantDisclaimer: string;
}

// For chat messages if we were to implement a chat history
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
    