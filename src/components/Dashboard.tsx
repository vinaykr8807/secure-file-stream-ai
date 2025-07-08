import React, { useState } from 'react';
import { 
  Files, 
  Upload, 
  Download, 
  Shield, 
  Clock, 
  Trash2, 
  Eye,
  Copy,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface FileData {
  id: string;
  filename: string;
  size: number;
  otp: string;
  uploadedAt: Date;
  expiryTime: Date;
  downloadCount: number;
  isVirusScanned: boolean;
  tags?: string[];
}

interface DashboardProps {
  files?: FileData[];
  onUploadNew?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ files = [], onUploadNew }) => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockFiles: FileData[] = files.length > 0 ? files : [
    {
      id: '1',
      filename: 'project-proposal.pdf',
      size: 2.5 * 1024 * 1024,
      otp: '7429',
      uploadedAt: new Date(Date.now() - 30 * 60 * 1000),
      expiryTime: new Date(Date.now() + 3.5 * 60 * 60 * 1000),
      downloadCount: 2,
      isVirusScanned: true,
      tags: ['Document', 'Business']
    },
    {
      id: '2',
      filename: 'vacation-photos.zip',
      size: 45 * 1024 * 1024,
      otp: '1853',
      uploadedAt: new Date(Date.now() - 90 * 60 * 1000),
      expiryTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
      downloadCount: 0,
      isVirusScanned: true,
      tags: ['Images', 'Personal']
    }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeRemaining = (expiryTime: Date) => {
    const now = new Date();
    const diff = expiryTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleCopyOTP = (otp: string, filename: string) => {
    navigator.clipboard.writeText(otp);
    toast({
      title: "OTP Copied",
      description: `Download code for ${filename} copied to clipboard`,
    });
  };

  const handleCopyShareLink = (fileId: string, filename: string) => {
    const shareLink = `${window.location.origin}/download/${fileId}`;
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Share Link Copied",
      description: `Download link for ${filename} copied to clipboard`,
    });
  };

  const getStatusBadge = (file: FileData) => {
    const now = new Date();
    const isExpired = file.expiryTime.getTime() <= now.getTime();
    
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (!file.isVirusScanned) {
      return <Badge variant="secondary">Scanning...</Badge>;
    }
    
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">File Dashboard</h1>
          <p className="text-muted-foreground">Manage your secure file transfers</p>
        </div>
        <Button onClick={onUploadNew} className="w-full sm:w-auto">
          <Upload className="h-4 w-4 mr-2" />
          Upload New File
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{mockFiles.length}</p>
              </div>
              <Files className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                <p className="text-2xl font-bold">
                  {mockFiles.reduce((sum, file) => sum + file.downloadCount, 0)}
                </p>
              </div>
              <Download className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Files</p>
                <p className="text-2xl font-bold">
                  {mockFiles.filter(file => file.expiryTime.getTime() > Date.now()).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Files</CardTitle>
        </CardHeader>
        <CardContent>
          {mockFiles.length === 0 ? (
            <div className="text-center py-12">
              <Files className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first file to get started with secure transfers
              </p>
              <Button onClick={onUploadNew}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {mockFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2 sm:space-y-0">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium truncate">{file.filename}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeRemaining(file.expiryTime)} remaining
                          </span>
                          <span>{file.downloadCount} downloads</span>
                        </div>
                      </div>
                      {getStatusBadge(file)}
                    </div>
                    
                    {file.tags && file.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {file.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyOTP(file.otp, file.filename)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy OTP
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyShareLink(file.id, file.filename)}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(file)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-warning/20 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Security Reminder</p>
              <p className="text-muted-foreground">
                All files are automatically deleted after 4 hours. Download codes are required for access. 
                Never share your OTP with untrusted recipients.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};