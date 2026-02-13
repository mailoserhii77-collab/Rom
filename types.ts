export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}

export interface VideoData {
  file: File;
  previewUrl: string;
  base64Data: string; // Raw base64 data without prefix
  mimeType: string;
}

export const MAX_FILE_SIZE_MB = 20; // Conservative limit for browser-based inline processing
