import React, { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import type { UploadedFile, PageData } from './UploadWorkflow';

interface FileUploadProps {
  uploadedFiles: UploadedFile[];
  onFilesUpload: (files: UploadedFile[]) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DropZone = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? '#126678' : props.theme.colors.border};
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  background-color: ${props => props.isDragOver ? 'rgba(18, 102, 120, 0.05)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #126678;
    background-color: rgba(18, 102, 120, 0.02);
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #126678;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const UploadText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const UploadSubtext = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  gap: 16px;
`;

const FileIcon = styled.div`
  width: 32px;
  height: 32px;
  color: #126678;
  flex-shrink: 0;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const FileDetails = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.text.secondary};
`;

const ProcessingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #126678;
  font-size: 12px;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top: 2px solid #126678;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RemoveButton = styled.button`
  padding: 4px 8px;
  background-color: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #dc2626;
    color: white;
  }
`;

const PagePreview = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const PageThumbnail = styled.div`
  width: 40px;
  height: 56px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: ${props => props.theme.colors.text.secondary};
`;

export const FileUpload: React.FC<FileUploadProps> = ({
  uploadedFiles,
  onFilesUpload
}) => {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);

  const generateMockPages = (pageCount: number): PageData[] => {
    return Array.from({ length: pageCount }, (_, index) => ({
      id: `page_${Date.now()}_${index}`,
      pageNumber: index + 1,
      thumbnail: '', // W prawdziwej aplikacji byłby to URL do miniatury
      ocrText: `Mock OCR text for page ${index + 1}`
    }));
  };

  const processFile = async (file: File): Promise<UploadedFile> => {
    // Symulacja procesowania pliku
    const fileId = `file_${Date.now()}_${Math.random()}`;
    
    return new Promise((resolve) => {
      // Symulacja OCR i generowania miniatur (2-5 sekund)
      setTimeout(() => {
        const mockPageCount = Math.floor(Math.random() * 10) + 5; // 5-15 stron
        const pages = generateMockPages(mockPageCount);
        
        resolve({
          id: fileId,
          file,
          pages,
          processing: false
        });
      }, 2000 + Math.random() * 3000);
    });
  };

  const handleFiles = async (files: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        const uploadedFile: UploadedFile = {
          id: `file_${Date.now()}_${i}`,
          file,
          pages: [],
          processing: true
        };
        newFiles.push(uploadedFile);
      }
    }
    
    const updatedFiles = [...uploadedFiles, ...newFiles];
    onFilesUpload(updatedFiles);
    
    // Procesuj pliki asynchronicznie
    for (const newFile of newFiles) {
      try {
        const processedFile = await processFile(newFile.file);
        const fileIndex = updatedFiles.findIndex(f => f.id === newFile.id);
        if (fileIndex !== -1) {
          updatedFiles[fileIndex] = processedFile;
          onFilesUpload([...updatedFiles]);
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [uploadedFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    const filteredFiles = uploadedFiles.filter(file => file.id !== fileId);
    onFilesUpload(filteredFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container>
      <DropZone
        isDragOver={isDragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <UploadIcon>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <path d="M12,11L16,15H13V19H11V15H8L12,11Z"/>
          </svg>
        </UploadIcon>
        <UploadText>
          {t('eTeczka.upload.dropFiles', 'Przeciągnij pliki tutaj lub kliknij aby wybrać')}
        </UploadText>
        <UploadSubtext>
          {t('eTeczka.upload.supportedFormats', 'Obsługiwane formaty: PDF, JPG, PNG (maks. 50MB)')}
        </UploadSubtext>
      </DropZone>
      
      <HiddenInput
        id="file-input"
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
      />

      {uploadedFiles.length > 0 && (
        <FileList>
          <h3>{t('eTeczka.upload.uploadedFiles', 'Wgrane pliki:')}</h3>
          {uploadedFiles.map(file => (
            <FileItem key={file.id}>
              <FileIcon>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </FileIcon>
              
              <FileInfo>
                <FileName>{file.file.name}</FileName>
                <FileDetails>
                  {formatFileSize(file.file.size)} • {file.file.type}
                  {!file.processing && file.pages.length > 0 && (
                    <span> • {file.pages.length} {t('eTeczka.upload.pages', 'stron')}</span>
                  )}
                </FileDetails>
                
                {!file.processing && file.pages.length > 0 && (
                  <PagePreview>
                    {file.pages.slice(0, 8).map(page => (
                      <PageThumbnail key={page.id}>
                        {page.pageNumber}
                      </PageThumbnail>
                    ))}
                    {file.pages.length > 8 && (
                      <PageThumbnail>+{file.pages.length - 8}</PageThumbnail>
                    )}
                  </PagePreview>
                )}
              </FileInfo>
              
              {file.processing ? (
                <ProcessingIndicator>
                  <Spinner />
                  {t('eTeczka.upload.processing', 'Przetwarzanie...')}
                </ProcessingIndicator>
              ) : (
                <RemoveButton onClick={() => removeFile(file.id)}>
                  {t('eTeczka.upload.remove', 'Usuń')}
                </RemoveButton>
              )}
            </FileItem>
          ))}
        </FileList>
      )}
    </Container>
  );
};
