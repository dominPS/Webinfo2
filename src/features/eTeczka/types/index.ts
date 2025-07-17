// Upload workflow types
export type UploadStep = 'employee' | 'upload' | 'split' | 'category' | 'preview';

export interface UploadedFile {
  id: string;
  file: File;
  pages: PageData[];
  processing: boolean;
}

export interface PageData {
  id: string;
  pageNumber: number;
  thumbnail: string;
  ocrText?: string;
}

export interface DocumentRange {
  id: string;
  startPage: number;
  endPage: number;
  title: string;
  suggestedCategory?: string;
  confirmedCategory?: string;
  documentType?: string;
  section?: 'A' | 'B' | 'C' | 'D' | 'E';
  date?: string;
  retentionPeriod?: string;
  notes?: string;
}

export interface SelectedEmployee {
  id: string;
  name: string;
  position: string;
  department: string;
}
