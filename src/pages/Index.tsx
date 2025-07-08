import React, { useState } from 'react';
import { Shield, Zap, Globe, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/FileUpload';
import { OTPInput } from '@/components/OTPInput';
import { Dashboard } from '@/components/Dashboard';

interface FileData {
  id: string;
  filename: string;
  size: number;
  otp: string;
  expiryTime: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
  const [showOTPInput, setShowOTPInput] = useState(false);

  const handleFileUploaded = (fileData: any) => {
    setUploadedFile(fileData);
    setActiveTab('share');
  };

  const handleVerifyOTP = (otp: string) => {
    // Handle successful OTP verification
    console.log('OTP verified:', otp);
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "End-to-End Encryption",
      description: "Your files are encrypted before upload and remain secure throughout transfer"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Optimized upload speeds with smart compression and AI-powered optimization"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "OTP Authentication",
      description: "4-digit codes ensure only intended recipients can download your files"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Access",
      description: "Share files worldwide with automatic CDN delivery and proximity detection"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-secondary py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Shield className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Secure File Transfer
              <span className="block text-primary-glow">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Upload, share, and transfer files with military-grade security. 
              AI-powered virus scanning and automatic expiry keep your data safe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => setActiveTab('upload')}
              >
                Start Transfer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setShowOTPInput(true)}
              >
                Enter Download Code
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SecureShare?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for security professionals and privacy-conscious users who demand the best
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {showOTPInput ? (
            <div className="max-w-md mx-auto">
              <OTPInput onVerifyOTP={handleVerifyOTP} />
              <div className="text-center mt-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowOTPInput(false)}
                >
                  ← Back to Upload
                </Button>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="share">Share</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </TabsList>
              
              <div className="mt-8">
                <TabsContent value="upload">
                  <FileUpload onFileUploaded={handleFileUploaded} />
                </TabsContent>
                
                <TabsContent value="share">
                  {uploadedFile ? (
                    <div className="max-w-2xl mx-auto">
                      <Card>
                        <CardContent className="p-8 text-center">
                          <div className="bg-success/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-8 w-8 text-success" />
                          </div>
                          <h3 className="text-2xl font-bold mb-4">File Ready to Share!</h3>
                          <div className="bg-muted/50 rounded-lg p-6 mb-6">
                            <div className="text-4xl font-mono font-bold text-primary mb-2">
                              {uploadedFile.otp}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Share this 4-digit code with your recipient
                            </p>
                          </div>
                          <p className="text-muted-foreground mb-6">
                            File: <strong>{uploadedFile.filename}</strong><br />
                            Expires: {uploadedFile.expiryTime.toLocaleString()}
                          </p>
                          <Button 
                            onClick={() => {
                              navigator.clipboard.writeText(uploadedFile.otp);
                            }}
                            className="w-full"
                          >
                            Copy Download Code
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Upload a file first to share it</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="dashboard">
                  <Dashboard onUploadNew={() => setActiveTab('upload')} />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">SecureShare</span>
            </div>
            <p className="text-background/70 mb-4">
              Military-grade file transfer with AI-powered security
            </p>
            <p className="text-sm text-background/50">
              Built with React, TypeScript, and Supabase • Files auto-delete after 4 hours
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
