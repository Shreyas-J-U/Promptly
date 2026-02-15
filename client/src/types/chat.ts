export interface IChatSource {
  title: string;
  url: string;
}

export interface IChatMetadata {
  sources: IChatSource[];
  domains: string[];
  processingTime: string;
  highlights: string[];
}
