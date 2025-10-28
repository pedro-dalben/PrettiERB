import * as vscode from 'vscode';
import { ErbFormatter } from './formatter/erbFormatter';
import { ErbFormattingProvider } from './providers/formattingProvider';
import { logger, LogLevel } from './utils/logger';

export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('erbFormatter');
    const logLevelStr = config.get<string>('logLevel', 'none');
    const logLevelMap: { [key: string]: LogLevel } = {
        'debug': LogLevel.DEBUG,
        'info': LogLevel.INFO,
        'warn': LogLevel.WARN,
        'error': LogLevel.ERROR,
        'none': LogLevel.NONE
    };
    logger.setLogLevel(logLevelMap[logLevelStr] || LogLevel.NONE);

    logger.info('PrettiERB extension is now active!');

    const formatter = new ErbFormatter();
    const formattingProvider = new ErbFormattingProvider(formatter);

    // Registrar o provedor de formatação
    const disposable1 = vscode.languages.registerDocumentFormattingEditProvider(
        { scheme: 'file', language: 'erb' },
        formattingProvider
    );

    // Registrar o provedor de formatação de range
    const disposable2 = vscode.languages.registerDocumentRangeFormattingEditProvider(
        { scheme: 'file', language: 'erb' },
        formattingProvider
    );

    // Comando para formatar documento
    const disposable3 = vscode.commands.registerCommand('prettierb.format', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'erb') {
            vscode.commands.executeCommand('editor.action.formatDocument');
        }
    });

    // Auto-formatação ao salvar
    const disposable4 = vscode.workspace.onWillSaveTextDocument((event) => {
        const config = vscode.workspace.getConfiguration('erbFormatter');
        if (config.get('formatOnSave') && event.document.languageId === 'erb') {
            const edit = vscode.commands.executeCommand('editor.action.formatDocument');
            event.waitUntil(edit);
        }
    });

    context.subscriptions.push(disposable1, disposable2, disposable3, disposable4);
}

export function deactivate() {}
