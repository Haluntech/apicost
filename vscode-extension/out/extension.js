/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(__webpack_require__(1));
const path = __importStar(__webpack_require__(2));
const fs = __importStar(__webpack_require__(3));
let statusBarItem;
let terminal = null;
let monitoringInterval = null;
let extensionContext;
function activate(context) {
    extensionContext = context;
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100 // Priority
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
    const interval = setInterval(updateStatusBar, 2 * 60 * 1000);
    context.subscriptions.push({ dispose: () => clearInterval(interval) });
    // Monitor package.json for changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/package.json');
    context.subscriptions.push(watcher.onDidChange(() => {
        // User installed a new AI package - update status
        updateStatusBar();
    }));
}
function updateStatusBar() {
    const config = vscode.workspace.getConfiguration('apiCostGuard');
    const apiKey = config.get('apiKey');
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
            const { execSync } = __webpack_require__(4);
            const result = execSync(`${apiCostPath} status --json`, { encoding: 'utf8', stdio: 'pipe' });
            const data = JSON.parse(result);
            if (data.totalCost > 0) {
                statusBarItem.text = `$${data.totalCost.toFixed(2)}`;
                statusBarItem.tooltip = `API Cost Guard: $${data.totalCost.toFixed(2)} spent this month (${data.budgetUsed.toFixed(1)}% of budget)`;
                // Color based on budget usage
                if (data.budgetUsed >= 90) {
                    statusBarItem.color = new vscode.ThemeColor('minimap.errorHighlight');
                }
                else if (data.budgetUsed >= 70) {
                    statusBarItem.color = new vscode.ThemeColor('minimap.warningHighlight');
                }
                else {
                    statusBarItem.color = new vscode.ThemeColor('editor.foreground');
                }
            }
            else {
                statusBarItem.text = '$0.00';
                statusBarItem.tooltip = 'API Cost Guard: No usage recorded yet';
                statusBarItem.color = new vscode.ThemeColor('editor.foreground');
            }
        }
    }
    catch (error) {
        statusBarItem.text = '$(error) Error';
        statusBarItem.tooltip = 'API Cost Guard: Failed to fetch status';
        statusBarItem.color = new vscode.ThemeColor('minimap.errorHighlight');
    }
}
function getApiCostPath() {
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
        }
        catch {
            continue;
        }
    }
    return null;
}
function showStatus() {
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
function startMonitoring() {
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
function stopMonitoring() {
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
function showSettings() {
    const config = vscode.workspace.getConfiguration('apiCostGuard');
    const editConfig = vscode.Uri.file(path.join((__webpack_require__(5).homedir)(), '.api-cost', 'config.json'));
    vscode.workspace.openTextDocument(editConfig).then((doc) => {
        if (doc) {
            vscode.window.showTextDocument(doc);
        }
        else {
            vscode.window.showInformationMessage('Config file not found. Run "api-cost init" to create one.');
        }
    });
}
function deactivate() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }
    if (terminal) {
        terminal.dispose();
    }
}


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("os");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map