import axios, { AxiosInstance } from 'axios';
import { UsageData, APIProvider } from '../types';

export interface APIUsageResponse {
  usage: UsageData[];
  totalCost: number;
  totalTokens: number;
  period: {
    start: string;
    end: string;
  };
}

export interface APIKeyValidation {
  valid: boolean;
  provider: string;
  error?: string;
  userInfo?: {
    email?: string;
    name?: string;
    quota?: {
      limit: number;
      used: number;
      remaining: number;
    };
  };
}

export class APIService {
  private httpClient: AxiosInstance;
  
  constructor() {
    this.httpClient = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'api-cost-guard/0.2.0'
      }
    });
    
    // Add request/response interceptors for better error handling
    this.httpClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please check your internet connection.');
        }
        if (error.response?.status === 401) {
          throw new Error('Invalid API key or authentication failed.');
        }
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (error.response?.status >= 500) {
          throw new Error('API server error. Please try again later.');
        }
        throw error;
      }
    );
  }

  async validateAPIKey(provider: string, apiKey: string): Promise<APIKeyValidation> {
    try {
      switch (provider) {
        case 'google':
          return await this.validateGoogleAPIKey(apiKey);
        case 'openai':
          return await this.validateOpenAIKey(apiKey);
        case 'claude':
          return await this.validateClaudeKey(apiKey);
        default:
          return { valid: false, provider, error: 'Unsupported provider' };
      }
    } catch (error) {
      return {
        valid: false,
        provider,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async validateGoogleAPIKey(apiKey: string): Promise<APIKeyValidation> {
    try {
      // Test API key with a simple models list request
      const response = await this.httpClient.post(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        {}
      );

      return {
        valid: true,
        provider: 'google'
      };
    } catch (error) {
      return {
        valid: false,
        provider: 'google',
        error: error instanceof Error ? error.message : 'Failed to validate Google API key'
      };
    }
  }

  private async validateOpenAIKey(apiKey: string): Promise<APIKeyValidation> {
    try {
      const response = await this.httpClient.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      return {
        valid: true,
        provider: 'openai'
      };
    } catch (error) {
      return {
        valid: false,
        provider: 'openai',
        error: error instanceof Error ? error.message : 'Failed to validate OpenAI API key'
      };
    }
  }

  private async validateClaudeKey(apiKey: string): Promise<APIKeyValidation> {
    try {
      const response = await this.httpClient.post('https://api.anthropic.com/v1/messages', {
        model: "claude-3-haiku-20240307",
        max_tokens: 10,
        messages: [{ role: "user", content: "test" }]
      }, {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      });

      return {
        valid: true,
        provider: 'claude'
      };
    } catch (error) {
      return {
        valid: false,
        provider: 'claude',
        error: error instanceof Error ? error.message : 'Failed to validate Claude API key'
      };
    }
  }

  async getUsageData(provider: string, apiKey: string, startDate: Date, endDate: Date): Promise<APIUsageResponse> {
    try {
      switch (provider) {
        case 'google':
          return await this.getGoogleAIUsage(apiKey, startDate, endDate);
        case 'openai':
          return await this.getOpenAIUsage(apiKey, startDate, endDate);
        case 'claude':
          return await this.getClaudeUsage(apiKey, startDate, endDate);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      throw new Error(`Failed to fetch usage data for ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getGoogleAIUsage(apiKey: string, startDate: Date, endDate: Date): Promise<APIUsageResponse> {
    // Note: Google AI Studio doesn't currently provide detailed usage API
    // We'll implement a basic approach and note the limitation
    
    // For now, return empty data with explanation
    return {
      usage: [],
      totalCost: 0,
      totalTokens: 0,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    };
  }

  private async getOpenAIUsage(apiKey: string, startDate: Date, endDate: Date): Promise<APIUsageResponse> {
    const response = await this.httpClient.get('https://api.openai.com/v1/usage', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      params: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    });

    const data = response.data;
    
    // Transform OpenAI usage data to our format
    const usage: UsageData[] = [];
    let totalCost = 0;
    let totalTokens = 0;

    if (data.data && Array.isArray(data.data)) {
      for (const item of data.data) {
        const usageItem: UsageData = {
          date: new Date(item.date),
          provider: 'openai',
          model: item.model_id || 'unknown',
          inputTokens: item.n_context_tokens_total || 0,
          outputTokens: item.n_generated_tokens_total || 0,
          requests: item.n_requests || 0,
          cost: this.calculateOpenAICost(item)
        };
        
        usage.push(usageItem);
        totalCost += usageItem.cost;
        totalTokens += usageItem.inputTokens + usageItem.outputTokens;
      }
    }

    return {
      usage,
      totalCost,
      totalTokens,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    };
  }

  private async getClaudeUsage(apiKey: string, startDate: Date, endDate: Date): Promise<APIUsageResponse> {
    // Note: Anthropic doesn't currently provide a public usage API
    // We'll implement a basic approach for now
    
    return {
      usage: [],
      totalCost: 0,
      totalTokens: 0,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    };
  }

  private calculateOpenAICost(usageItem: any): number {
    // Implement OpenAI pricing calculation
    // This is a simplified version - in production, use official pricing data
    
    const model = usageItem.model_id || 'unknown';
    const inputTokens = usageItem.n_context_tokens_total || 0;
    const outputTokens = usageItem.n_generated_tokens_total || 0;

    // Simplified pricing (USD per 1K tokens)
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-4-32k': { input: 0.06, output: 0.12 },
      'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
      'text-embedding-ada-002': { input: 0.0001, output: 0 }
    };

    const modelPricing = pricing[model] || { input: 0.001, output: 0.002 };
    
    const inputCost = (inputTokens / 1000) * modelPricing.input;
    const outputCost = (outputTokens / 1000) * modelPricing.output;
    
    return inputCost + outputCost;
  }
}