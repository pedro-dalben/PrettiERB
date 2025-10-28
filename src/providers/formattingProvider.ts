import * as vscode from 'vscode';
import { ErbFormatter } from '../formatter/erbFormatter';

export class ErbFormattingProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {
    constructor(private formatter: ErbFormatter) {}

    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
        );

        return this.provideDocumentRangeFormattingEdits(document, fullRange, options, token);
    }

    provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        const text = document.getText(range);
        const config = vscode.workspace.getConfiguration('erbFormatter');
        const formattedText = this.formatter.format(text, options, config);

        if (formattedText === text) {
            return [];
        }

        return [vscode.TextEdit.replace(range, formattedText)];
    }
}
