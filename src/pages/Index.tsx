import React, { useState, useEffect } from 'react';
import { Shield, Zap, Globe, Lock, CheckCircle, ArrowRight, Brain, Users, LogIn, Sparkles, Wind, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedFileUpload } from '@/components/AdvancedFileUpload';
import { OTPInput } from '@/components/OTPInput';
import { Dashboard } from '@/components/Dashboard';
import { ModernAuthComponent } from '@/components/ModernAuthComponent';
import { AIInsightsDashboard } from '@/components/AIInsightsDashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

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
  const [showAuth, setShowAuth] = useState(false);
  
  const { user, loading, signOut } = useAuth();
  const { actualTheme } = useTheme();

  const handleFileUploaded = (fileData: any) => {
    setUploadedFile(fileData);
    setActiveTab('share');
  };

  const handleVerifyOTP = (otp: string) => {
    // Handle successful OTP verification
    console.log('OTP verified:', otp);
  };

  useEffect(() => {
    // Close auth modal when user is authenticated
    if (user && showAuth) {
      setShowAuth(false);
    }
  }, [user, showAuth]);

  // If not authenticated, show auth component
  if (showAuth && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="w-full max-w-md">
          <ModernAuthComponent />
          <div className="text-center mt-6">
            <Button 
              variant="ghost"
              className="btn-ghost-whisper"
              onClick={() => setShowAuth(false)}
            >
              ← Continue as Guest
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Wind className="h-6 w-6" />,
      title: "Ephemeral by Design",
      description: "Files vanish automatically - no digital footprint left behind"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Location-Aware Sharing",
      description: "Smart proximity detection for secure local file transfers"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Whisper-Level Security",
      description: "Military-grade encryption with zero-knowledge architecture"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Privacy First",
      description: "No tracking, no logs, no permanent storage - just pure privacy"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading WhispShare...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" />
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-secondary animate-pulse" />
              </div>
              <span className="text-2xl font-bold font-display whisper-text">WhispShare</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('ai-dashboard')}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    AI Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowAuth(true)}
                  className="btn-whisper"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section py-24 relative">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <div className="glass-card rounded-full p-6 whisper-glow">
                <div className="relative">
                  <Shield className="h-16 w-16" />
                  <Wind className="absolute -top-2 -right-2 h-6 w-6 text-secondary animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
              <span className="block">WhispShare</span>
              <span className="block text-3xl md:text-4xl font-normal text-white/80 mt-2">
                Ephemeral • Location-Based • Secure
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/85 max-w-4xl mx-auto leading-relaxed">
              Share files that disappear like whispers in the wind. 
              <span className="block mt-2">Location-aware, privacy-first, and beautifully ephemeral.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onClick={() => {
                  setActiveTab('upload');
                  document.querySelector('#main-app')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Whispering
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg backdrop-blur-sm"
                onClick={() => {
                  setShowOTPInput(true);
                  document.querySelector('#main-app')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Receive Whisper
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 whisper-text">
              Why WhispShare?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Designed for those who value privacy, security, and the beauty of impermanence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 whisper-glow hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-display">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Application */}
      <section id="main-app" className="py-24">
        <div className="container mx-auto px-4">
          {showOTPInput ? (
            <div className="max-w-md mx-auto">
              <OTPInput onVerifyOTP={handleVerifyOTP} />
              <div className="text-center mt-6">
                <Button 
                  variant="ghost" 
                  className="btn-ghost-whisper"
                  onClick={() => setShowOTPInput(false)}
                >
                  ← Back to Upload
                </Button>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full ${user ? 'grid-cols-4' : 'grid-cols-3'} max-w-lg mx-auto`}>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="share">Share</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                {user && <TabsTrigger value="ai-dashboard">AI Insights</TabsTrigger>}
              </TabsList>
              
              <div className="mt-8">
                <TabsContent value="upload">
                  <AdvancedFileUpload onFileUploaded={handleFileUploaded} />
                </TabsContent>
                
                <TabsContent value="share">
                  {uploadedFile ? (
                    <div className="max-w-2xl mx-auto">
                      <Card>
                        <CardContent className="p-8 text-center">
                          <div className="bg-success/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-8 w-8 text-success" />
                          </div>
                          <h3 className="text-2xl font-bold font-display mb-4">Whisper Ready!</h3>
                          <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl p-6 mb-6 whisper-glow">
                            <div className="text-4xl font-mono font-bold text-primary mb-2">
                              {uploadedFile.otp}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Share this whisper code with your recipient
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
                            className="w-full btn-whisper"
                          >
                            Copy Whisper Code
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Create a whisper first to share it</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="dashboard">
                  <Dashboard onUploadNew={() => setActiveTab('upload')} />
                </TabsContent>
                
                {user && (
                  <TabsContent value="ai-dashboard">
                    <AIInsightsDashboard />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-foreground to-foreground/95 text-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative mr-3">
                <Shield className="h-8 w-8" />
                <Wind className="absolute -top-1 -right-1 h-3 w-3 text-secondary animate-pulse" />
              </div>
              <span className="text-2xl font-bold font-display">WhispShare</span>
            </div>
            <p className="text-background/80 mb-6 text-lg">
              Ephemeral, Location-Based File Sharing
            </p>
            <p className="text-sm text-background/60">
              Built with love for privacy • Files vanish like whispers in the wind
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
