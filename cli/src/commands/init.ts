import inquirer from 'inquirer';
import chalk from 'chalk';
import { ConfigService } from '@/services/ConfigService';
import { InitAnswers } from '@/types';

export async function initCommand(options: { force?: boolean }) {
  const configService = new ConfigService();

  if (!options.force && !configService.isFirstRun()) {
    console.log(chalk.yellow('⚠️  Configuration already exists.'));
    
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Do you want to overwrite the existing configuration?',
        default: false
      }
    ]);

    if (!overwrite) {
      console.log(chalk.gray('Configuration unchanged.'));
      return;
    }
  }

  console.log(chalk.cyan('🚀 Welcome to API Cost Guard!'));
  console.log(chalk.gray('Let\'s set up your configuration to start monitoring AI API costs.\n'));

  const answers: InitAnswers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'providers',
      message: 'Which AI API providers do you use?',
      choices: [
        {
          name: 'OpenAI (GPT-4, GPT-3.5, DALL-E)',
          value: 'openai',
          checked: true
        },
        {
          name: 'Anthropic Claude (Claude-3, Claude-2)',
          value: 'claude',
          checked: false
        },
        {
          name: 'Google AI (Gemini)',
          value: 'google',
          checked: false
        }
      ]
    }
  ]);

  // Collect API keys for selected providers
  if (answers.providers.includes('openai')) {
    const { openaiKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'openaiKey',
        message: 'Enter your OpenAI API key:',
        validate: (input) => {
          if (!input) {
            return 'API key is required';
          }
          if (!configService.validateAPIKey('openai', input)) {
            return 'Invalid OpenAI API key format. Should start with "sk-"';
          }
          return true;
        },
        mask: '*'
      }
    ]);
    answers.openaiKey = openaiKey;
  }

  if (answers.providers.includes('claude')) {
    const { claudeKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'claudeKey',
        message: 'Enter your Anthropic Claude API key:',
        validate: (input) => {
          if (!input) {
            return 'API key is required';
          }
          if (!configService.validateAPIKey('claude', input)) {
            return 'Invalid Claude API key format. Should start with "sk-ant-"';
          }
          return true;
        },
        mask: '*'
      }
    ]);
    answers.claudeKey = claudeKey;
  }

  if (answers.providers.includes('google')) {
    const { googleKey } = await inquirer.prompt([
      {
        type: 'password',
        name: 'googleKey',
        message: 'Enter your Google AI API key:',
        validate: (input) => {
          if (!input) {
            return 'API key is required';
          }
          if (!configService.validateAPIKey('google', input)) {
            return 'Invalid Google AI API key format';
          }
          return true;
        },
        mask: '*'
      }
    ]);
    answers.googleKey = googleKey;
  }

  // Budget configuration
  const budgetAnswers = await inquirer.prompt([
    {
      type: 'number',
      name: 'budget',
      message: 'What is your monthly API budget?',
      default: 200,
      validate: (input) => {
        if (input <= 0) {
          return 'Budget must be greater than 0';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'currency',
      message: 'Select your currency:',
      choices: [
        { name: 'USD ($)', value: 'USD' },
        { name: 'EUR (€)', value: 'EUR' },
        { name: 'GBP (£)', value: 'GBP' },
        { name: 'JPY (¥)', value: 'JPY' }
      ],
      default: 'USD'
    },
    {
      type: 'confirm',
      name: 'alerts',
      message: 'Enable cost alerts?',
      default: true
    }
  ]);

  Object.assign(answers, budgetAnswers);

  // Save configuration
  try {
    if (options.force) {
      configService.reset();
    }

    // Add API providers
    if (answers.providers.includes('openai') && answers.openaiKey) {
      configService.addAPIProvider({
        name: 'openai',
        displayName: 'OpenAI',
        apiKey: answers.openaiKey,
        models: [],
        baseUrl: 'https://api.openai.com/v1'
      });
    }

    if (answers.providers.includes('claude') && answers.claudeKey) {
      configService.addAPIProvider({
        name: 'claude',
        displayName: 'Anthropic Claude',
        apiKey: answers.claudeKey,
        models: [],
        baseUrl: 'https://api.anthropic.com'
      });
    }

    if (answers.providers.includes('google') && answers.googleKey) {
      configService.addAPIProvider({
        name: 'google',
        displayName: 'Google AI',
        apiKey: answers.googleKey,
        models: [],
        baseUrl: 'https://generativelanguage.googleapis.com/v1'
      });
    }

    // Set budget
    configService.updateBudget({
      monthly: answers.budget,
      alertThreshold: 0.8,
      alerts: answers.alerts
    });

    // Update other config
    configService.updateConfig({
      currency: answers.currency,
      dateFormat: 'yyyy-MM-dd'
    });

    console.log(chalk.green('\n✅ Configuration saved successfully!'));
    console.log(chalk.cyan('\n📊 Your setup:'));
    console.log(chalk.gray(`  • Providers: ${answers.providers.join(', ')}`));
    console.log(chalk.gray(`  • Monthly budget: ${answers.currency} ${answers.budget}`));
    console.log(chalk.gray(`  • Alerts: ${answers.alerts ? 'Enabled' : 'Disabled'}`));
    
    console.log(chalk.cyan('\n🚀 You\'re all set! Try these commands:'));
    console.log(chalk.gray('  api-cost status     # Check your current usage'));
    console.log(chalk.gray('  api-cost predict    # See cost predictions'));
    console.log(chalk.gray('  api-cost suggest    # Get optimization tips'));
    console.log(chalk.gray('\n📖 For more help: api-cost --help'));

  } catch (error) {
    console.error(chalk.red('❌ Error saving configuration:'), error);
    process.exit(1);
  }
}