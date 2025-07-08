import React, { useState, useCallback } from 'react';
import { Upload, File, Check, AlertCircle, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUploaded?: (fileData: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 100MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      setUploadedFile(file);
      
      // Generate mock OTP and file data
      const mockFileData = {
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        size: file.size,
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
      };

      onFileUploaded?.(mockFileData);

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded securely`,
      });

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Secure File Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`drop-zone p-8 text-center ${isDragOver ? 'drop-zone-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          
          {!isUploading && !uploadedFile && (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Drop your file here or click to browse
              </h3>
              <p className="text-muted-foreground mb-4">
                Maximum file size: 100MB
              </p>
              <Button
                onClick={() => document.getElementById('file-input')?.click()}
                className="w-full sm:w-auto"
              >
                Choose File
              </Button>
            </>
          )}

          {isUploading && (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-primary mx-auto animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Uploading...</h3>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {Math.round(uploadProgress)}% complete
                </p>
              </div>
            </div>
          )}

          {uploadedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-success/10 rounded-full p-3">
                  <Check className="h-8 w-8 text-success" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-success mb-2">
                  Upload Complete!
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span className="font-medium">{uploadedFile.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatFileSize(uploadedFile.size)}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>Expires in 4 hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Security Features:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Files are automatically deleted after 4 hours</li>
                <li>• All transfers are encrypted end-to-end</li>
                <li>• OTP authentication required for downloads</li>
                <li>• Virus scanning before upload completion</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};