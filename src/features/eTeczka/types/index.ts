// Upload workflow types
export type UploadStep = 'employee' | 'upload' | 'split' | 'category' | 'preview' | 'signing';

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
  documentIndex?: string; // np. A1, A2, B1, B2, itd.
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
