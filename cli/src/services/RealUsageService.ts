import { CostSummary, UsageData, ModelUsage, DailyUsage } from '../types';
import { ConfigService } from './ConfigService';
import { APIService } from './APIService';
import { PRICING_DATA } from '../types';

export class RealUsageService {
  private configService: ConfigService;
  private apiService: APIService;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor() {
    this.configService = new ConfigService();
    this.apiService = new APIService();
  }

  async getCurrentUsage(provider?: string, days: number = 7): Promise<CostSummary> {
    const config = this.configService.getConfig();
    
    // If no provider specified, use all configured providers
    const providers = provider 
      ? [provider] 
      : Object.keys(config.apis);

    if (providers.length === 0) {
      return this.getEmptyCostSummary(config);
    }

    let allUsage: UsageData[] = [];
    let totalCost = 0;
    let todayCost = 0;
    let thisWeekCost = 0;
    let thisMonthCost = 0;

    // Get usage data from each provider
    for (const providerName of providers) {
      const apiProvider = config.apis[providerName];
      if (!apiProvider) continue;

      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const usageData = await this.getUsageDataWithCache(
          providerName,
          apiProvider.apiKey,
          startDate,
          endDate
        );

        allUsage = allUsage.concat(usageData.usage);
        totalCost += usageData.totalCost;

        // Calculate time-based costs
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        todayCost += usageData.usage
          .filter(u => new Date(u.date) >= todayStart)
          .reduce((sum, u) => sum + u.cost, 0);

        thisWeekCost += usageData.usage
          .filter(u => new Date(u.date) >= weekStart)
          .reduce((sum, u) => sum + u.cost, 0);

        thisMonthCost += usageData.usage
          .filter(u => new Date(u.date) >= monthStart)
          .reduce((sum, u) => sum + u.cost, 0);

      } catch (error) {
        console.warn(`Failed to fetch usage data for ${providerName}:`, error);
        // Continue with other providers even if one fails
      }
    }

    // Generate daily trend
    const dailyTrend = this.generateDailyTrend(allUsage, days);
    
    // Generate top models
    const topModels = this.generateTopModels(allUsage);
    
    // Calculate projected monthly cost
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const projected = (thisMonthCost / daysPassed) * daysInMonth;

    return {
      today: todayCost,
      thisWeek: thisWeekCost,
      thisMonth: thisMonthCost,
      totalCost: thisMonthCost,
      projected,
      budget: config.budget.monthly,
      budgetUsed: (thisMonthCost / config.budget.monthly) * 100,
      topModels,
      dailyTrend
    };
  }

  private getEmptyCostSummary(config: any): CostSummary {
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

  private async getUsageDataWithCache(
    provider: string,
    apiKey: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const cacheKey = `${provider}-${startDate.toISOString().split('T')[0]}-${endDate.toISOString().split('T')[0]}`;
    const now = Date.now();
    const cached = this.cache.get(cacheKey);

    // Check cache (5 minutes TTL)
    if (cached && (now - cached.timestamp) < cached.ttl) {
      return cached.data;
    }

    // Fetch fresh data
    const data = await this.apiService.getUsageData(provider, apiKey, startDate, endDate);
    
    // Cache the result
    this.cache.set(cacheKey, {
      data,
      timestamp: now,
      ttl: 5 * 60 * 1000 // 5 minutes
    });

    return data;
  }

  private generateDailyTrend(usageData: UsageData[], days: number): DailyUsage[] {
    const dailyMap = new Map<string, DailyUsage>();

    // Initialize all days in the range
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      dailyMap.set(dateStr, {
        date: dateStr,
        cost: 0,
        tokens: 0,
        requests: 0
      });
    }

    // Aggregate usage data by date
    for (const usage of usageData) {
      const dateStr = usage.date.toISOString().split('T')[0];
      const existing = dailyMap.get(dateStr);
      
      if (existing) {
        existing.cost += usage.cost;
        existing.tokens += usage.inputTokens + usage.outputTokens;
        existing.requests += usage.requests;
      }
    }

    return Array.from(dailyMap.values());
  }

  private generateTopModels(usageData: UsageData[]): ModelUsage[] {
    const modelMap = new Map<string, { usage: number; cost: number; }>();

    // Aggregate usage by model
    for (const usage of usageData) {
      const existing = modelMap.get(usage.model);
      
      if (existing) {
        existing.usage += usage.requests;
        existing.cost += usage.cost;
      } else {
        modelMap.set(usage.model, {
          usage: usage.requests,
          cost: usage.cost
        });
      }
    }

    // Convert to array and sort by cost
    const models = Array.from(modelMap.entries())
      .map(([model, data]) => ({
        model,
        usage: data.usage,
        cost: data.cost,
        percentage: 0 // Will be calculated below
      }))
      .sort((a, b) => b.cost - a.cost);

    // Calculate percentages
    const totalCost = models.reduce((sum, model) => sum + model.cost, 0);
    models.forEach(model => {
      model.percentage = totalCost > 0 ? (model.cost / totalCost) * 100 : 0;
    });

    return models.slice(0, 5); // Top 5 models
  }

  async validateAPIKeys(): Promise<Record<string, boolean>> {
    const config = this.configService.getConfig();
    const results: Record<string, boolean> = {};

    for (const [providerName, provider] of Object.entries(config.apis)) {
      try {
        const validation = await this.apiService.validateAPIKey(providerName, provider.apiKey);
        results[providerName] = validation.valid;
        
        if (!validation.valid) {
          console.warn(`API key validation failed for ${providerName}: ${validation.error}`);
        }
      } catch (error) {
        results[providerName] = false;
        console.warn(`Failed to validate ${providerName} API key:`, error);
      }
    }

    return results;
  }

  async refreshCache(): Promise<void> {
    this.cache.clear();
    console.log('Cache cleared. Next API calls will fetch fresh data.');
  }

  // Method to test API connectivity
  async testConnectivity(): Promise<Record<string, { connected: boolean; error?: string }>> {
    const config = this.configService.getConfig();
    const results: Record<string, { connected: boolean; error?: string }> = {};

    for (const [providerName, provider] of Object.entries(config.apis)) {
      try {
        const validation = await this.apiService.validateAPIKey(providerName, provider.apiKey);
        results[providerName] = {
          connected: validation.valid,
          error: validation.valid ? undefined : validation.error
        };
      } catch (error) {
        results[providerName] = {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return results;
  }
}