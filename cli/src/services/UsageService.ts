import { CostSummary, UsageData, ModelUsage, DailyUsage } from '../types';
import { ConfigService } from './ConfigService';
import { PRICING_DATA } from '../types';

export class UsageService {
  private configService: ConfigService;
  private useRealData: boolean = true; // Toggle for real vs mock data

  constructor(useRealData: boolean = true) {
    this.configService = new ConfigService();
    this.useRealData = useRealData;
  }

  async getCurrentUsage(provider?: string, days: number = 7): Promise<CostSummary> {
    if (this.useRealData) {
      try {
        const { RealUsageService } = await import('./RealUsageService');
        const realService = new RealUsageService();
        return await realService.getCurrentUsage(provider, days);
      } catch (error) {
        console.warn('Failed to use real API data, falling back to demo mode:', error);
        return this.getMockUsageData(provider, days);
      }
    } else {
      return this.getMockUsageData(provider, days);
    }
  }

  private getMockUsageData(provider?: string, days: number = 7): CostSummary {
    const config = this.configService.getConfig();
    const now = new Date();
    
    // Get provider-specific models
    const providerInfo = provider ? config.apis[provider] : null;
    
    // If no provider is configured or selected, return zero usage
    if (!providerInfo) {
      return {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        totalCost: 0,
        projected: 0,
        budget: config.budget.monthly,
        budgetUsed: 0,
        topModels: [],
        dailyTrend: []
      };
    }
    
    // Generate mock daily data based on provider
    const dailyTrend: DailyUsage[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      dailyTrend.push({
        date: date.toISOString().split('T')[0],
        cost: Math.random() * 10 + 2, // $2-12 per day (lower for demo)
        tokens: Math.floor(Math.random() * 30000) + 5000,
        requests: Math.floor(Math.random() * 50) + 10
      });
    }

    // Calculate totals
    const today = dailyTrend[dailyTrend.length - 1];
    const thisWeek = dailyTrend.slice(-7).reduce((sum, day) => sum + day.cost, 0);
    const thisMonth = dailyTrend.reduce((sum, day) => sum + day.cost, 0);

    // Generate provider-specific model usage
    let topModels: ModelUsage[] = [];
    
    switch (provider) {
      case 'google':
        topModels = [
          {
            model: 'gemini-pro',
            usage: 30,
            cost: thisMonth * 0.7,
            percentage: 70
          },
          {
            model: 'gemini-pro-vision',
            usage: 15,
            cost: thisMonth * 0.3,
            percentage: 30
          }
        ];
        break;
      case 'openai':
        topModels = [
          {
            model: 'gpt-4',
            usage: 45,
            cost: thisMonth * 0.6,
            percentage: 60
          },
          {
            model: 'gpt-3.5-turbo',
            usage: 120,
            cost: thisMonth * 0.3,
            percentage: 30
          },
          {
            model: 'text-embedding-ada-002',
            usage: 200,
            cost: thisMonth * 0.1,
            percentage: 10
          }
        ];
        break;
      case 'claude':
        topModels = [
          {
            model: 'claude-3-sonnet',
            usage: 25,
            cost: thisMonth * 0.8,
            percentage: 80
          },
          {
            model: 'claude-3-haiku',
            usage: 80,
            cost: thisMonth * 0.2,
            percentage: 20
          }
        ];
        break;
      default:
        topModels = [];
    }

    return {
      today: today.cost,
      thisWeek,
      thisMonth,
      totalCost: thisMonth,
      projected: (thisMonth / now.getDate()) * new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
      budget: config.budget.monthly,
      budgetUsed: (thisMonth / config.budget.monthly) * 100,
      topModels,
      dailyTrend
    };
  }

  async getHistoricalUsage(days: number = 30): Promise<UsageData[]> {
    // Mock historical data
    const usageData: UsageData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      usageData.push({
        date,
        provider: 'openai',
        model: 'gpt-4',
        inputTokens: Math.floor(Math.random() * 10000),
        outputTokens: Math.floor(Math.random() * 5000),
        requests: Math.floor(Math.random() * 50) + 10,
        cost: Math.random() * 10 + 2
      });
    }
    
    return usageData;
  }

  async getUsageByProvider(): Promise<Record<string, CostSummary>> {
    const providers = this.configService.getAllAPIProviders();
    const providerSummaries: Record<string, CostSummary> = {};
    
    for (const provider of providers) {
      providerSummaries[provider.name] = await this.getCurrentUsage(provider.name);
    }
    
    return providerSummaries;
  }

  calculateCost(provider: string, model: string, inputTokens: number, outputTokens: number): number {
    const pricing = PRICING_DATA[provider]?.[model];
    if (!pricing) {
      throw new Error(`Pricing not found for ${provider}/${model}`);
    }
    
    const inputCost = (inputTokens / 1000) * pricing.input;
    const outputCost = (outputTokens / 1000) * pricing.output;
    
    return inputCost + outputCost;
  }

  async recordUsage(usage: Omit<UsageData, 'cost'>): Promise<void> {
    // In a real implementation, this would store usage data
    // For now, just calculate and log the cost
    const cost = this.calculateCost(usage.provider, usage.model, usage.inputTokens, usage.outputTokens);
    console.log(`Usage recorded: ${usage.model} - ${cost.toFixed(4)} USD`);
  }
}