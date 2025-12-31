export enum GenerationMode {
  COMPOSITE = 'COMPOSITE',
  INPAINTING = 'INPAINTING',
  OUTPAINTING = 'OUTPAINTING'
}

export interface PromptResponse {
  prompt: string;
  analysis?: string;
}

export interface UploadedFile {
  file: File;
  previewUrl: string;
}
