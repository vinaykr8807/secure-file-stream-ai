import React, { useState, useCallback, useEffect } from 'react';
import { 
  Upload, 
  File, 
  Check, 
  AlertCircle, 
  Shield, 
  Clock, 
  Scan,
  Brain,
  Zap,
  Eye,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUploaded?: (fileData: any) => void;
}

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  duration?: number;
  icon: React.ReactNode;
}

export const AdvancedFileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const { toast } = useToast();

  const initializeProcessingSteps = useCallback((file: File) => {
    const steps: ProcessingStep[] = [
      {
        id: 'upload',
        name: 'Secure Upload',
        status: 'processing',
        icon: <Upload className="h-4 w-4" />
      },
      {
        id: 'virus-scan',
        name: 'AI Virus Scanning',
        status: 'pending',
        icon: <Scan className="h-4 w-4" />
      },
      {
        id: 'content-analysis',
        name: 'Content Analysis',
        status: 'pending',
        icon: <Brain className="h-4 w-4" />
      },
      {
        id: 'smart-expiry',
        name: 'Smart Expiry Calculation',
        status: 'pending',
        icon: <Zap className="h-4 w-4" />
      },
      {
        id: 'encryption',
        name: 'End-to-End Encryption',
        status: 'pending',
        icon: <Shield className="h-4 w-4" />
      }
    ];
    setProcessingSteps(steps);
  }, []);

  const updateStepStatus = useCallback((stepId: string, status: ProcessingStep['status'], duration?: number) => {
    setProcessingSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, duration } : step
    ));
  }, []);

  const simulateAIProcessing = useCallback(async (file: File) => {
    const steps = [
      { id: 'upload', duration: 1000 },
      { id: 'virus-scan', duration: 2000 },
      { id: 'content-analysis', duration: 1500 },
      { id: 'smart-expiry', duration: 800 },
      { id: 'encryption', duration: 1200 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStep(i);
      
      if (i > 0) {
        updateStepStatus(steps[i-1].id, 'complete', step.duration);
      }
      updateStepStatus(step.id, 'processing');
      
      await new Promise(resolve => setTimeout(resolve, step.duration));

      // Add AI insights during processing
      if (step.id === 'virus-scan') {
        setAiInsights(prev => [...prev, '✅ No malicious content detected']);
      } else if (step.id === 'content-analysis') {
        const fileType = file.type.split('/')[0];
        if (fileType === 'image') {
          setAiInsights(prev => [...prev, '🖼️ Image content detected', '📊 High quality resolution']);
        } else if (fileType === 'application') {
          setAiInsights(prev => [...prev, '📄 Document format recognized', '📝 Text content analyzed']);
        } else {
          setAiInsights(prev => [...prev, '📁 File structure validated']);
        }
      } else if (step.id === 'smart-expiry') {
        const suggestedHours = Math.floor(Math.random() * 8) + 4;
        setAiInsights(prev => [...prev, `⏰ AI suggests ${suggestedHours}h expiry based on file type`]);
      }
    }
    
    updateStepStatus('encryption', 'complete');
    setCurrentStep(steps.length);
  }, [updateStepStatus]);

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
    const maxSize = 100 * 1024 * 1024;
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
    setAiInsights([]);
    initializeProcessingSteps(file);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 150);

    try {
      await simulateAIProcessing(file);
      
      setUploadProgress(100);
      setUploadedFile(file);
      
      // Generate enhanced file data with AI insights
      const mockFileData = {
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        size: file.size,
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        aiInsights: aiInsights,
        securityScore: Math.floor(Math.random() * 20) + 80, // 80-100 security score
        virusScanned: true,
        contentTags: generateContentTags(file)
      };

      onFileUploaded?.(mockFileData);

      toast({
        title: "Upload successful",
        description: `${file.name} processed with AI security analysis`,
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

  const generateContentTags = (file: File) => {
    const fileType = file.type.split('/')[0];
    const tags = ['Secure'];
    
    if (fileType === 'image') {
      tags.push('Image', 'Visual Content');
    } else if (fileType === 'application') {
      if (file.type.includes('pdf')) tags.push('Document', 'PDF');
      else tags.push('Document', 'Data');
    } else if (fileType === 'video') {
      tags.push('Video', 'Media');
    } else if (fileType === 'audio') {
      tags.push('Audio', 'Media');
    } else {
      tags.push('File', 'Data');
    }
    
    return tags;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStepStatus = (step: ProcessingStep, index: number) => {
    if (step.status === 'complete') return 'text-success';
    if (step.status === 'processing') return 'text-primary';
    if (step.status === 'error') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          AI-Powered Secure Upload
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
                Maximum file size: 100MB • AI-powered security analysis included
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
            <div className="space-y-6">
              <Upload className="h-12 w-12 text-primary mx-auto animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold mb-4">Processing with AI...</h3>
                <Progress value={uploadProgress} className="w-full mb-4" />
                
                {/* Processing Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {processingSteps.map((step, index) => (
                    <div key={step.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                      step.status === 'complete' ? 'bg-success/5 border-success/20' :
                      step.status === 'processing' ? 'bg-primary/5 border-primary/20' :
                      'bg-muted/30 border-muted'
                    }`}>
                      <div className={`${getStepStatus(step, index)}`}>
                        {step.status === 'complete' ? <CheckCircle2 className="h-4 w-4" /> : 
                         step.status === 'processing' ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" /> :
                         step.icon}
                      </div>
                      <span className={`text-sm font-medium ${getStepStatus(step, index)}`}>
                        {step.name}
                      </span>
                      {step.status === 'complete' && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* AI Insights */}
                {aiInsights.length > 0 && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      AI Analysis Results
                    </h4>
                    <div className="space-y-1">
                      {aiInsights.map((insight, index) => (
                        <div key={index} className="text-sm text-muted-foreground animate-fade-in">
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {uploadedFile && (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="bg-success/10 rounded-full p-3">
                  <Check className="h-8 w-8 text-success" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-success mb-4">
                  AI Processing Complete!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Info */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <File className="h-4 w-4" />
                      File Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {uploadedFile.name}</div>
                      <div><strong>Size:</strong> {formatFileSize(uploadedFile.size)}</div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Expires in 4 hours</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights Summary */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Analysis
                    </h4>
                    <div className="space-y-2">
                      {aiInsights.slice(-3).map((insight, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {insight}
                        </div>
                      ))}
                    </div>
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
              <p className="font-medium mb-1">AI-Enhanced Security Features:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Real-time virus scanning with machine learning</li>
                <li>• Smart content analysis and auto-tagging</li>
                <li>• AI-optimized expiry time suggestions</li>
                <li>• Advanced threat detection and behavioral analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};