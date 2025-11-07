import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';
import * as fs from 'fs';

let statusBarItem: vscode.StatusBarItem;
let terminal: vscode.Terminal | null = null;
let monitoringInterval: NodeJS.Timeout | null = null;
let extensionContext: vscode.ExtensionContext;

export function activate(context: vscode.ExtensionContext) {
    extensionContext = context;
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        100 // Priority
    );
    statusBarItem.command = 'apiCostGuard.showStatus';
    context.subscriptions.push(statusBarItem);

    // Register commands
    const commands = [
        vscode.commands.registerCommand('apiCostGuard.showStatus', () => showStatus()),
        vscode.commands.registerCommand('apiCostGuard.startMonitoring', () => startMonitoring()),
        vscode.commands.registerCommand('apiCostGuard.stopMonitoring', () => stopMonitoring()),
        vscode.commands.registerCommand('apiCostGuard.showSettings', () => showSettings())
    ];

    commands.forEach(command => context.subscriptions.push(command));

    // Initial status update
    updateStatusBar();

    // Auto-update status every 2 minutes
    const interval = setInterval(updateStatusBar, 2 * 60 * 1000) as any;
    context.subscriptions.push({ dispose: () => clearInterval(interval) });

    // Monitor package.json for changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/package.json');
    context.subscriptions.push(watcher.onDidChange(() => {
        // User installed a new AI package - update status
        updateStatusBar();
    }));
}

function updateStatusBar(): void {
    const config = vscode.workspace.getConfiguration('apiCostGuard');
    const apiKey = config.get<string>('apiKey');
    
    if (!apiKey) {
        statusBarItem.text = '$(graph) Not Configured';
        statusBarItem.tooltip = 'API Cost Guard: Configure API key to start monitoring';
        statusBarItem.color = new vscode.ThemeColor('editorError.foreground');
        return;
    }

    // Try to get quick status
    try {
        const apiCostPath = getApiCostPath();
        if (apiCostPath) {
            const { execSync } = require('child_process');
            const result = execSync(`${apiCostPath} status --json`, { encoding: 'utf8', stdio: 'pipe' });
            const data = JSON.parse(result);
            
            if (data.totalCost > 0) {
                statusBarItem.text = `$${data.totalCost.toFixed(2)}`;
                statusBarItem.tooltip = `API Cost Guard: $${data.totalCost.toFixed(2)} spent this month (${data.budgetUsed.toFixed(1)}% of budget)`;
                
                // Color based on budget usage
                if (data.budgetUsed >= 90) {
                    statusBarItem.color = new vscode.ThemeColor('minimap.errorHighlight');
                } else if (data.budgetUsed >= 70) {
                    statusBarItem.color = new vscode.ThemeColor('minimap.warningHighlight');
                } else {
                    statusBarItem.color = new vscode.ThemeColor('editor.foreground');
                }
            } else {
                statusBarItem.text = '$0.00';
                statusBarItem.tooltip = 'API Cost Guard: No usage recorded yet';
                statusBarItem.color = new vscode.ThemeColor('editor.foreground');
            }
        }
    } catch (error) {
        statusBarItem.text = '$(error) Error';
        statusBarItem.tooltip = 'API Cost Guard: Failed to fetch status';
        statusBarItem.color = new vscode.ThemeColor('minimap.errorHighlight');
    }
}

function getApiCostPath(): string | null {
    // Try to find api-cost in the system
    const possiblePaths = [
        '/usr/local/bin/api-cost',
        '/opt/homebrew/bin/api-cost',
        path.join(process.env.HOME || '', '.npm-global/bin/api-cost')
    ];

    for (const path of possiblePaths) {
        try {
            fs.accessSync(path, fs.constants.X_OK);
            return path;
        } catch {
            continue;
        }
    }
    return null;
}

function showStatus(): void {
    const apiCostPath = getApiCostPath();
    if (!apiCostPath) {
        vscode.window.showErrorMessage('API Cost Guard not found. Please install it first: npm install -g api-cost-guard');
        return;
    }

    // Create or show terminal
    if (!terminal) {
        terminal = vscode.window.createTerminal({
            name: 'API Cost Guard',
            shellPath: process.platform === 'win32' ? 'cmd.exe' : 'bash'
        });
        extensionContext.subscriptions.push(terminal);
    }

    terminal.sendText(`api-cost status\n`);
    terminal.show();
}

function startMonitoring(): void {
    const apiCostPath = getApiCostPath();
    if (!apiCostPath) {
        vscode.window.showErrorMessage('API Cost Guard not found. Please install it first: npm install -g api-cost-guard');
        return;
    }

    if (monitoringInterval) {
        vscode.window.showInformationMessage('Monitoring is already running');
        return;
    }

    // Create terminal for monitoring
    if (!terminal) {
        terminal = vscode.window.createTerminal({
            name: 'API Cost Monitor',
            shellPath: process.platform === 'win32' ? 'cmd.exe' : 'bash'
        });
        extensionContext.subscriptions.push(terminal);
    }

    terminal.sendText(`api-cost monitor\n`);
    terminal.show();

    // Start monitoring in terminal
    monitoringInterval = setInterval(() => {
        updateStatusBar();
    }, 30 * 1000); // Update every 30 seconds

    vscode.window.showInformationMessage('API Cost monitoring started in terminal');
}

function stopMonitoring(): void {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }

    if (terminal) {
        terminal.sendText('\x03'); // Send Ctrl+C
        terminal.dispose();
        terminal = null;
    }

    vscode.window.showInformationMessage('API Cost monitoring stopped');
}

function showSettings(): void {
    const config = vscode.workspace.getConfiguration('apiCostGuard');
    
    const editConfig = vscode.Uri.file(
        path.join(require('os').homedir(), '.api-cost', 'config.json')
    );

    vscode.workspace.openTextDocument(editConfig).then((doc) => {
        if (doc) {
            vscode.window.showTextDocument(doc);
        } else {
            vscode.window.showInformationMessage('Config file not found. Run "api-cost init" to create one.');
        }
    });
}

export function deactivate() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }
    if (terminal) {
        terminal.dispose();
    }
}