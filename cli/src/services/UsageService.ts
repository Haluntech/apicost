import { CostSummary, UsageData, ModelUsage, DailyUsage } from '@/types';
import { ConfigService } from './ConfigService';
import { PRICING_DATA } from '@/types';

export class UsageService {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  async getCurrentUsage(provider?: string, days: number = 7): Promise<CostSummary> {
    // For now, return mock data
    // In a real implementation, this would fetch data from API providers
    return this.getMockUsageData(provider, days);
  }

  private getMockUsageData(provider?: string, days: number = 7): CostSummary {
    const config = this.configService.getConfig();
    const now = new Date();
    
    // Generate mock daily data
    const dailyTrend: DailyUsage[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      dailyTrend.push({
        date: date.toISOString().split('T')[0],
        cost: Math.random() * 15 + 5, // $5-20 per day
        tokens: Math.floor(Math.random() * 50000) + 10000,
        requests: Math.floor(Math.random() * 100) + 20
      });
    }

    // Calculate totals
    const today = dailyTrend[dailyTrend.length - 1];
    const thisWeek = dailyTrend.slice(-7).reduce((sum, day) => sum + day.cost, 0);
    const thisMonth = dailyTrend.reduce((sum, day) => sum + day.cost, 0);

    // Generate mock model usage
    const topModels: ModelUsage[] = [
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

    return {
      today: today.cost,
      thisWeek,
      thisMonth,
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