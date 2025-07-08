import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shield, Download, AlertCircle, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OTPInputProps {
  onVerifyOTP?: (otp: string) => void;
  fileData?: {
    filename: string;
    size: number;
    expiryTime: Date;
  };
}

export const OTPInput: React.FC<OTPInputProps> = ({ onVerifyOTP, fileData }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (fileData?.expiryTime) {
      const updateTimer = () => {
        const now = new Date();
        const expiry = new Date(fileData.expiryTime);
        const diff = expiry.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeRemaining('Expired');
          return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    }
  }, [fileData?.expiryTime]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-move to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').slice(0, 4);
    const newOtp = pastedText.split('').concat(['', '', '', '']).slice(0, 4);
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 3;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 4 digits",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 4-digit OTP
      onVerifyOTP?.(otpString);
      
      toast({
        title: "OTP Verified",
        description: "Download will begin shortly",
      });
      
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Enter Download Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {fileData && (
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="font-medium truncate">{fileData.filename}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatFileSize(fileData.size)}</span>
              <span>•</span>
              <Timer className="h-3 w-3" />
              <span className={timeRemaining === 'Expired' ? 'text-error' : ''}>
                {timeRemaining || 'Calculating...'}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">
              4-Digit Download Code
            </label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="otp-input"
                  disabled={isVerifying || timeRemaining === 'Expired'}
                />
              ))}
            </div>
          </div>

          <Button
            onClick={handleVerify}
            disabled={otp.join('').length !== 4 || isVerifying || timeRemaining === 'Expired'}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download File
              </>
            )}
          </Button>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Security Notice:</p>
              <p>The download code was sent to the file uploader. 
                 Files expire automatically and cannot be recovered after deletion.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};