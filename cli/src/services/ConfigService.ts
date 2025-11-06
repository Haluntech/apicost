import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Config, APIProvider, Budget } from '../types';

export class ConfigService {
  private configPath: string;
  private encryptionKey: string;

  constructor() {
    const homeDir = os.homedir();
    const configDir = path.join(homeDir, '.api-cost');
    
    // Ensure config directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    this.configPath = path.join(configDir, 'config.json');
    this.encryptionKey = this.getEncryptionKey();
  }

  private getEncryptionKey(): string {
    // Simple encryption key - in production, use a more secure approach
    return 'api-cost-guard-key-v1';
  }

  private encrypt(text: string): string {
    // Simple obfuscation - for demo purposes
    return Buffer.from(text).toString('base64');
  }

  private decrypt(ciphertext: string): string {
    try {
      return Buffer.from(ciphertext, 'base64').toString();
    } catch {
      return '';
    }
  }

  getConfig(): Config {
    const defaultConfig: Config = {
      apis: {},
      budget: {
        monthly: 200,
        alertThreshold: 0.8,
        alerts: true
      },
      currency: 'USD',
      dateFormat: 'yyyy-MM-dd'
    };

    if (!fs.existsSync(this.configPath)) {
      return defaultConfig;
    }

    try {
      const storedConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      return { ...defaultConfig, ...storedConfig };
    } catch {
      return defaultConfig;
    }
  }

  updateConfig(updates: Partial<Config>): void {
    const currentConfig = this.getConfig();
    const newConfig = { ...currentConfig, ...updates };
    fs.writeFileSync(this.configPath, JSON.stringify(newConfig, null, 2));
  }

  addAPIProvider(provider: APIProvider): void {
    const config = this.getConfig();
    
    // Encrypt API key
    const encryptedProvider = {
      ...provider,
      apiKey: this.encrypt(provider.apiKey)
    };
    
    config.apis[provider.name] = encryptedProvider;
    this.updateConfig(config);
  }

  getAPIProvider(name: string): APIProvider | null {
    const config = this.getConfig();
    const provider = config.apis[name];
    
    if (!provider) {
      return null;
    }
    
    // Decrypt API key
    return {
      ...provider,
      apiKey: this.decrypt(provider.apiKey)
    };
  }

  getAllAPIProviders(): APIProvider[] {
    const config = this.getConfig();
    return Object.values(config.apis).map(provider => ({
      ...provider,
      apiKey: this.decrypt(provider.apiKey)
    }));
  }

  removeAPIProvider(name: string): void {
    const config = this.getConfig();
    delete config.apis[name];
    this.updateConfig(config);
  }

  updateBudget(budget: Partial<Budget>): void {
    const config = this.getConfig();
    config.budget = { ...config.budget, ...budget };
    this.updateConfig(config);
  }

  getBudget(): Budget {
    return this.getConfig().budget;
  }

  validateAPIKey(provider: string, apiKey: string): boolean {
    // Basic validation for different providers
    switch (provider) {
      case 'openai':
        return apiKey.startsWith('sk-') && apiKey.length > 20;
      case 'claude':
        return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
      case 'google':
        return apiKey.length > 20; // Google AI has various key formats
      default:
        return apiKey.length > 10;
    }
  }

  isFirstRun(): boolean {
    return !fs.existsSync(this.configPath);
  }

  reset(): void {
    if (fs.existsSync(this.configPath)) {
      fs.unlinkSync(this.configPath);
    }
  }

  exportConfig(): string {
    const config = this.getConfig();
    // Remove sensitive data for export
    const exportData = {
      ...config,
      apis: Object.keys(config.apis).reduce((acc, key) => {
        acc[key] = {
          ...config.apis[key],
          apiKey: '***REDACTED***'
        };
        return acc;
      }, {} as Record<string, any>)
    };
    return JSON.stringify(exportData, null, 2);
  }

  importConfig(configJson: string): void {
    try {
      const importedConfig = JSON.parse(configJson);
      // Validate basic structure
      if (importedConfig.apis && typeof importedConfig.apis === 'object') {
        // Remove any redacted keys
        Object.keys(importedConfig.apis).forEach(key => {
          if (importedConfig.apis[key].apiKey === '***REDACTED***') {
            delete importedConfig.apis[key];
          }
        });
      }
      this.updateConfig(importedConfig);
    } catch (error) {
      throw new Error('Invalid config file format');
    }
  }
}