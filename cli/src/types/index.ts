export interface APIProvider {
  name: 'openai' | 'claude' | 'google';
  displayName: string;
  apiKey: string;
  models: ModelInfo[];
  baseUrl?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  inputPrice: number; // per 1K tokens
  outputPrice: number; // per 1K tokens
  category: 'text' | 'image' | 'embedding' | 'audio';
}

export interface UsageData {
  date: Date;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  requests: number;
  cost: number;
}

export interface CostSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalCost: number; // alias for thisMonth
  projected: number;
  budget: number;
  budgetUsed: number; // percentage
  topModels: ModelUsage[];
  dailyTrend: DailyUsage[];
}

export interface ModelUsage {
  model: string;
  usage: number;
  cost: number;
  percentage: number;
}

export interface DailyUsage {
  date: string;
  cost: number;
  tokens: number;
  requests: number;
}

export interface Budget {
  monthly: number;
  alertThreshold: number; // percentage (0-1)
  alerts: boolean;
}

export interface Config {
  apis: Record<string, APIProvider>;
  budget: Budget;
  currency: string;
  dateFormat: string;
}

export interface OptimizationSuggestion {
  type: 'model-switch' | 'prompt-caching' | 'batch-processing' | 'usage-reduction';
  title: string;
  description: string;
  potentialSavings: number;
  effort: 'low' | 'medium' | 'high';
  implementation: string;
}

export interface CostPrediction {
  projected: number;
  confidence: number; // 0-1
  factors: string[];
  recommendation: string;
}

export interface AlertConfig {
  enabled: boolean;
  daily: boolean;
  weekly: boolean;
  budgetThreshold: number; // percentage
  unexpectedSpike: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CLIConfig {
  outputFormat: 'table' | 'json' | 'csv';
  verbose: boolean;
  quiet: boolean;
}

// Pricing data (can be updated)
export const PRICING_DATA: Record<string, Record<string, { input: number; output: number }>> = {
  openai: {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-32k': { input: 0.06, output: 0.12 },
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
    'gpt-3.5-turbo-16k': { input: 0.003, output: 0.004 },
    'text-embedding-ada-002': { input: 0.0001, output: 0 },
    'dall-e-3': { input: 0.04, output: 0 }, // per image
  },
  claude: {
    'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
    'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
    'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
    'claude-2.1': { input: 0.008, output: 0.024 },
    'claude-2.0': { input: 0.008, output: 0.024 },
  },
  google: {
    'gemini-pro': { input: 0.0005, output: 0.0015 },
    'gemini-pro-vision': { input: 0.0025, output: 0.0075 },
  }
};

export interface CommandOptions {
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
  format?: string;
  provider?: string;
  model?: string;
  days?: number;
  confidence?: boolean;
  period?: string;
  output?: string;
}

export interface InitAnswers {
  providers: string[];
  openaiKey?: string;
  claudeKey?: string;
  googleKey?: string;
  budget: number;
  currency: string;
  alerts: boolean;
}