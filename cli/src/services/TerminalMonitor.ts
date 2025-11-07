import chalk from 'chalk';
import { ConfigService } from './ConfigService';
import { RealUsageService } from './RealUsageService';

export interface CostAlert {
  type: 'info' | 'warning' | 'danger';
  message: string;
  cost: number;
  budget: number;
  percentage: number;
}

export class TerminalMonitor {
  private configService: ConfigService;
  private realService: RealUsageService;
  private monitoring: boolean = false;
  private alertThreshold: number = 0.8;
  private lastAlert: number = 0;
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.configService = new ConfigService();
    this.realService = new RealUsageService();
  }

  startMonitoring(intervalMinutes: number = 5): void {
    if (this.monitoring) {
      console.log(chalk.yellow('⚠️  Monitoring already started'));
      return;
    }

    this.monitoring = true;
    const intervalMs = intervalMinutes * 60 * 1000;
    
    console.log(chalk.green(`🔍 Started real-time cost monitoring (every ${intervalMinutes} minutes)`));
    console.log(chalk.gray('Press Ctrl+C to stop monitoring\n'));

    // Initial check
    this.checkCosts();

    // Set up interval
    this.interval = setInterval(() => {
      this.checkCosts();
    }, intervalMs);

    // Handle Ctrl+C
    process.on('SIGINT', () => {
      this.stopMonitoring();
    });
  }

  stopMonitoring(): void {
    if (!this.monitoring) return;

    this.monitoring = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    console.log(chalk.yellow('\n🔍 Stopped cost monitoring'));
  }

  private async checkCosts(): Promise<void> {
    try {
      const config = this.configService.getConfig();
      const usage = await this.realService.getCurrentUsage();

      const budgetUsed = usage.budgetUsed / 100;
      const currentCost = usage.thisMonth;
      const projectedCost = usage.projected;
      const budget = config.budget.monthly;

      // Generate appropriate alert
      const alert = this.generateAlert(currentCost, projectedCost, budget, budgetUsed);
      
      if (alert) {
        this.displayAlert(alert);
      } else {
        // Show gentle status update
        this.displayStatus(usage);
      }

    } catch (error) {
      console.log(chalk.red(`❌ Monitoring error: ${error}`));
    }
  }

  private generateAlert(currentCost: number, projectedCost: number, budget: number, budgetUsed: number): CostAlert | null {
    const now = Date.now();
    
    // Avoid alert spam (minimum 5 minutes between alerts)
    if (now - this.lastAlert < 5 * 60 * 1000) {
      return null;
    }

    if (budgetUsed >= 100) {
      this.lastAlert = now;
      return {
        type: 'danger',
        message: `🚨 OVER BUDGET! You've exceeded your $${budget} budget!`,
        cost: currentCost,
        budget,
        percentage: budgetUsed
      };
    }

    if (budgetUsed >= this.alertThreshold) {
      this.lastAlert = now;
      return {
        type: 'warning',
        message: `⚠️ Budget Alert: ${budgetUsed.toFixed(1)}% of budget used`,
        cost: currentCost,
        budget,
        percentage: budgetUsed
      };
    }

    if (projectedCost > budget * 1.1) {
      this.lastAlert = now;
      return {
        type: 'warning',
        message: `📈 Projected to exceed budget by $${(projectedCost - budget).toFixed(2)}`,
        cost: currentCost,
        budget,
        percentage: budgetUsed
      };
    }

    // Info alerts for milestones
    if (budgetUsed >= 50 && budgetUsed < 55) {
      this.lastAlert = now;
      return {
        type: 'info',
        message: `📊 Halfway through budget (${budgetUsed.toFixed(1)}% used)`,
        cost: currentCost,
        budget,
        percentage: budgetUsed
      };
    }

    return null;
  }

  private displayAlert(alert: CostAlert): void {
    const timestamp = new Date().toLocaleTimeString();
    
    let icon: string;
    let color: (text: string) => string;

    switch (alert.type) {
      case 'danger':
        icon = '🚨';
        color = chalk.red.bold;
        break;
      case 'warning':
        icon = '⚠️';
        color = chalk.yellow.bold;
        break;
      case 'info':
        icon = '📊';
        color = chalk.blue.bold;
        break;
    }

    const progress = this.getProgressBar(alert.percentage);
    const costDisplay = this.formatCost(alert.cost);

    console.log(`${color(`[${timestamp}] ${icon} ${alert.message}`)}`);
    console.log(`${color(`  💰 Current: ${costDisplay} | Budget: $${alert.budget} | ${progress}`)}`);
    console.log('');
  }

  private displayStatus(usage: any): void {
    const timestamp = new Date().toLocaleTimeString();
    const costDisplay = this.formatCost(usage.thisMonth);
    const budgetUsed = usage.budgetUsed;
    const progress = this.getProgressBar(budgetUsed);

    console.log(chalk.gray(`[${timestamp}] 💡 Status: ${costDisplay} | ${progress}`));
  }

  private getProgressBar(percentage: number, width: number = 20): string {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    let color: (text: string) => string = chalk.green;
    if (percentage >= 90) color = chalk.red.bold;
    else if (percentage >= 70) color = chalk.yellow;
    
    return color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  }

  private formatCost(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  // Method to get current status without starting monitoring
  async getQuickStatus(): Promise<string> {
    try {
      const usage = await this.realService.getCurrentUsage();
      const budgetUsed = usage.budgetUsed;
      const costDisplay = this.formatCost(usage.thisMonth);
      const projectedDisplay = this.formatCost(usage.projected);
      const budget = this.configService.getConfig().budget.monthly;
      const progress = this.getProgressBar(budgetUsed);

      return `${chalk.cyan('💰')} ${costDisplay} / $${budget} (${budgetUsed.toFixed(1)}%) | ${progress}\n` +
             `${chalk.blue('📈')} Projected: ${projectedDisplay}`;
    } catch (error) {
      return chalk.red('❌ Error fetching status');
    }
  }
}