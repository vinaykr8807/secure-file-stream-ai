import React, { useState } from 'react'
import { 
  Shield, 
  Chrome,
  Loader2,
  Sparkles,
  Lock,
  Globe,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export const ModernAuthComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle } = useAuth()
  const { toast } = useToast()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      toast({
        title: "Redirecting to Google",
        description: "Please complete the authentication process",
      })
    } catch (error) {
      console.error('Sign in error:', error)
      toast({
        title: "Authentication failed",
        description: "Please try again or contact support",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: <Lock className="h-4 w-4" />,
      text: "End-to-end encryption"
    },
    {
      icon: <Globe className="h-4 w-4" />,
      text: "Location-based sharing"
    },
    {
      icon: <Zap className="h-4 w-4" />,
      text: "Ephemeral by design"
    }
  ]

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-full p-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to WhispShare
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Ephemeral, Location-Based File Sharing
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="text-primary">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Google Sign In */}
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Chrome className="h-5 w-5 mr-3" />
              )}
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Secure & Private
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => window.location.href = '/'}
            >
              Continue as Guest
            </Button>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1 text-foreground">Enterprise Security</p>
                <p>Your data is protected with military-grade encryption. Files automatically expire and are permanently deleted.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}