import chalk from 'chalk';
import { TerminalMonitor } from '../services/TerminalMonitor';

export async function monitorCommand(options: { interval?: number; duration?: number }) {
  const monitor = new TerminalMonitor();
  
  console.log(chalk.cyan('🔍 Starting API Cost Monitor\n'));
  
  // Show current status first
  try {
    const status = await monitor.getQuickStatus();
    console.log('Current Status:', status);
  } catch (error) {
    console.log(chalk.yellow('Could not fetch current status. Starting monitoring anyway...'));
  }

  const interval = options.interval || 5; // Default 5 minutes
  
  if (options.duration) {
    console.log(chalk.blue(`📅 Will monitor for ${options.duration} minutes`));
    
    // Auto-stop after specified duration
    setTimeout(() => {
      console.log(chalk.yellow(`\n📅 Monitoring completed after ${options.duration} minutes`));
      monitor.stopMonitoring();
      process.exit(0);
    }, options.duration * 60 * 1000);
  }

  console.log(chalk.gray(`\n💡 Tips while monitoring:`));
  console.log(chalk.gray(`• Keep this terminal open while coding`));
  console.log(chalk.gray(`• Alerts will appear when budget thresholds are reached`));
  console.log(chalk.gray(`• Press Ctrl+C to stop monitoring anytime`));
  console.log(chalk.gray(`• Run 'api-cost status' for detailed breakdown`));
  console.log('');

  monitor.startMonitoring(interval);
}