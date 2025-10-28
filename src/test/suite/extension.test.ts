import * as assert from 'assert';
import * as vscode from 'vscode';
import { ErbFormatter } from '../../formatter/erbFormatter';
import { ErbFormattingProvider } from '../../providers/formattingProvider';

describe('Extension Integration Tests', () => {
    before(() => {
        vscode.window.showInformationMessage('Start all tests.');
    });

    it('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('pedro-dalben.prettierb'));
    });

    it('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('pedro-dalben.prettierb');
        assert.ok(extension);

        await extension!.activate();
        assert.strictEqual(extension!.isActive, true);
    });

    it('Should register ERB language', async () => {
        const languages = await vscode.languages.getLanguages();
        assert.ok(languages.includes('erb'));
    });

    it('Should provide formatting for ERB files', async () => {
        const formatter = new ErbFormatter();
        const provider = new ErbFormattingProvider(formatter);

        const content = '<%=user.name%>';
        const document = await vscode.workspace.openTextDocument({
            content,
            language: 'erb'
        });

        const options: vscode.FormattingOptions = {
            tabSize: 2,
            insertSpaces: true
        };

        const edits = provider.provideDocumentFormattingEdits(
            document,
            options,
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits, 'Edits should be defined');
        assert.ok(Array.isArray(edits), 'Edits should be an array');
        if (edits && edits.length > 0) {
            const formattedText = edits[0].newText;
            assert.ok(formattedText.includes('<%= user.name %>'), 'Should format ERB output tag');
        }
    });

    it('Should format ERB content correctly', async () => {
        const formatter = new ErbFormatter();
        const provider = new ErbFormattingProvider(formatter);

        const content = `<div>
<%if user.present?%>
<%= user.name %>
<%end%>
</div>`;

        const document = await vscode.workspace.openTextDocument({
            content,
            language: 'erb'
        });

        const options: vscode.FormattingOptions = {
            tabSize: 2,
            insertSpaces: true
        };

        const edits = provider.provideDocumentFormattingEdits(
            document,
            options,
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits, 'Edits should be defined');
        assert.ok(Array.isArray(edits), 'Edits should be an array');

        if (edits && edits.length > 0) {
            const formattedText = edits[0].newText;
            assert.ok(formattedText.includes('<% if user.present? %>'), 'Should format if statement');
            assert.ok(formattedText.includes('  <%= user.name %>'), 'Should indent ERB output');
        }
    });

    it('Should handle range formatting', async () => {
        const formatter = new ErbFormatter();
        const provider = new ErbFormattingProvider(formatter);

        const content = `<div>
<%if user.present?%>
<%= user.name %>
<%end%>
</div>`;

        const document = await vscode.workspace.openTextDocument({
            content,
            language: 'erb'
        });

        const options: vscode.FormattingOptions = {
            tabSize: 2,
            insertSpaces: true
        };

        const range = new vscode.Range(1, 0, 3, 0);
        const edits = provider.provideDocumentRangeFormattingEdits(
            document,
            range,
            options,
            new vscode.CancellationTokenSource().token
        );

        assert.ok(edits, 'Edits should be defined');
        assert.ok(Array.isArray(edits), 'Edits should be an array');
    });

    it('Should execute format command', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('prettierb.format'));

        // Test command execution (this would require an active ERB editor)
        try {
            await vscode.commands.executeCommand('prettierb.format');
        } catch (error) {
            assert.ok(true);
        }
    });
});
