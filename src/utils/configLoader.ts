import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export interface ErbFormatterConfig {
    indentSize?: number;
    useTabs?: boolean;
    formatOnSave?: boolean;
    preserveBlankLines?: boolean;
    logLevel?: string;
}

/**
 * Loads PrettiERB configuration from .erbformatterrc file or VS Code settings
 */
export class ConfigLoader {
    private static CONFIG_FILE_NAMES = [
        '.erbformatterrc',
        '.erbformatterrc.json',
        '.erbformatter.json'
    ];

    /**
     * Searches for .erbformatterrc in the workspace and parent directories
     * @param startPath - Starting directory path
     * @returns Parsed configuration object or null if not found
     */
    static loadFromFile(startPath: string): ErbFormatterConfig | null {
        let currentPath = startPath;
        const root = path.parse(currentPath).root;

        while (currentPath !== root) {
            for (const fileName of this.CONFIG_FILE_NAMES) {
                const configPath = path.join(currentPath, fileName);

                if (fs.existsSync(configPath)) {
                    try {
                        const content = fs.readFileSync(configPath, 'utf-8');
                        return JSON.parse(content);
                    } catch (error) {
                        console.error(`Error parsing ${configPath}:`, error);
                        return null;
                    }
                }
            }

            const parentPath = path.dirname(currentPath);
            if (parentPath === currentPath) {
                break;
            }
            currentPath = parentPath;
        }

        return null;
    }

    /**
     * Merges configuration from file, VS Code settings, and defaults
     * @param workspacePath - Workspace root path
     * @returns Merged configuration object
     */
    static loadConfig(workspacePath?: string): ErbFormatterConfig {
        const vscodeConfig = vscode.workspace.getConfiguration('erbFormatter');

        const config: ErbFormatterConfig = {
            indentSize: vscodeConfig.get('indentSize', 2),
            useTabs: vscodeConfig.get('useTabs', false),
            formatOnSave: vscodeConfig.get('formatOnSave', true),
            preserveBlankLines: vscodeConfig.get('preserveBlankLines', true),
            logLevel: vscodeConfig.get('logLevel', 'none')
        };

        if (workspacePath) {
            const fileConfig = this.loadFromFile(workspacePath);
            if (fileConfig) {
                Object.assign(config, fileConfig);
            }
        }

        return config;
    }
}
