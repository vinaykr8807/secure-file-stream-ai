import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Activity,
  Target,
  BarChart3,
  PieChart,
  Globe,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIInsight {
  id: string;
  type: 'security' | 'performance' | 'usage' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon: React.ReactNode;
  timestamp: Date;
}

interface AIAnalytics {
  securityScore: number;
  threatsPrevented: number;
  uploadOptimization: number;
  userBehaviorScore: number;
  predictions: {
    nextHourUploads: number;
    storageUsage: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export const AIInsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate AI insights generation
    const generateInsights = () => {
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'security',
          title: 'Suspicious Upload Pattern Detected',
          description: 'AI detected unusual file upload frequency from IP range 192.168.1.x. Automatic rate limiting applied.',
          confidence: 94,
          severity: 'medium',
          icon: <Shield className="h-4 w-4" />,
          timestamp: new Date(Date.now() - 10 * 60 * 1000)
        },
        {
          id: '2',
          type: 'performance',
          title: 'Upload Speed Optimization',
          description: 'Smart compression algorithm improved upload speeds by 34% for image files.',
          confidence: 88,
          severity: 'low',
          icon: <Zap className="h-4 w-4" />,
          timestamp: new Date(Date.now() - 25 * 60 * 1000)
        },
        {
          id: '3',
          type: 'prediction',
          title: 'Peak Usage Forecast',
          description: 'AI predicts 3x higher upload volume in next 2 hours. Scaling resources automatically.',
          confidence: 76,
          severity: 'medium',
          icon: <TrendingUp className="h-4 w-4" />,
          timestamp: new Date(Date.now() - 45 * 60 * 1000)
        },
        {
          id: '4',
          type: 'security',
          title: 'Malware Variant Identified',
          description: 'New malware signature detected and blocked. Updated virus database for all users.',
          confidence: 99,
          severity: 'high',
          icon: <AlertTriangle className="h-4 w-4" />,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ];

      const mockAnalytics: AIAnalytics = {
        securityScore: 96,
        threatsPrevented: 247,
        uploadOptimization: 89,
        userBehaviorScore: 92,
        predictions: {
          nextHourUploads: 156,
          storageUsage: 78,
          riskLevel: 'low'
        }
      };

      setInsights(mockInsights);
      setAnalytics(mockAnalytics);
    };

    generateInsights();
    const interval = setInterval(generateInsights, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'usage': return <Activity className="h-4 w-4" />;
      case 'prediction': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000 / 60);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (!analytics) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading AI insights...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 rounded-full p-3">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Security Dashboard</h1>
          <p className="text-muted-foreground">Real-time intelligence and threat analysis</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                    <p className="text-2xl font-bold text-success">{analytics.securityScore}%</p>
                  </div>
                  <div className="bg-success/10 rounded-full p-3">
                    <Shield className="h-6 w-6 text-success" />
                  </div>
                </div>
                <Progress value={analytics.securityScore} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Threats Blocked</p>
                    <p className="text-2xl font-bold">{analytics.threatsPrevented}</p>
                  </div>
                  <div className="bg-error/10 rounded-full p-3">
                    <AlertTriangle className="h-6 w-6 text-error" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">↑ 12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Optimization</p>
                    <p className="text-2xl font-bold text-primary">{analytics.uploadOptimization}%</p>
                  </div>
                  <div className="bg-primary/10 rounded-full p-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <Progress value={analytics.uploadOptimization} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User Behavior</p>
                    <p className="text-2xl font-bold">{analytics.userBehaviorScore}%</p>
                  </div>
                  <div className="bg-secondary/10 rounded-full p-3">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <p className="text-xs text-success mt-2">Normal patterns detected</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slice(0, 4).map((insight) => (
                  <div key={insight.id} className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getTypeIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{insight.title}</h4>
                          <p className="text-sm opacity-90 mb-2">{insight.description}</p>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {insight.confidence}% confidence
                            </Badge>
                            <span className="text-xs opacity-70">
                              {formatTimestamp(insight.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Threat Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Malware Detection</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-success font-medium">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Behavioral Analysis</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-success font-medium">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Real-time Scanning</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-success font-medium">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>DLP Protection</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-success font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Events (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Files Scanned</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Threats Blocked</span>
                    <span className="font-bold text-error">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Suspicious Activity</span>
                    <span className="font-bold text-warning">7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Clean Files</span>
                    <span className="font-bold text-success">1,217</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Compression Efficiency</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <Progress value={94} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Speed Optimization</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <Progress value={87} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Bandwidth Utilization</span>
                      <span className="text-sm font-medium">76%</span>
                    </div>
                    <Progress value={76} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Upload Time</span>
                    <span className="font-bold">2.3s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-bold text-success">99.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-bold text-error">0.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Response</span>
                    <span className="font-bold">156ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Next Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-2">
                    {analytics.predictions.nextHourUploads}
                  </p>
                  <p className="text-sm text-muted-foreground">Expected uploads</p>
                  <Badge className="mt-2" variant="outline">
                    ↑ 15% increase predicted
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary mb-2">
                    {analytics.predictions.storageUsage}%
                  </p>
                  <p className="text-sm text-muted-foreground">Predicted usage</p>
                  <Progress value={analytics.predictions.storageUsage} className="mt-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Risk Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-success mb-2 capitalize">
                    {analytics.predictions.riskLevel}
                  </p>
                  <p className="text-sm text-muted-foreground">Current risk assessment</p>
                  <Badge className="mt-2" variant="outline">
                    All systems secure
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};