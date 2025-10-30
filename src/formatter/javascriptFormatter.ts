import { FormattingOptions } from './erbFormatter';

let prettier: any;
try {
    prettier = require('prettier');
} catch (e) {
    prettier = null;
}

export class JavaScriptFormatter {
    async format(content: string, options: FormattingOptions, usePrettier: boolean = true): Promise<string> {
        const trimmed = content.trim();
        if (!trimmed) {
            return '';
        }

        if (usePrettier) {
            try {
                return await this.formatWithPrettier(trimmed, options);
            } catch (error) {
                console.warn('Prettier formatting failed, falling back to basic formatting:', error);
                return this.formatBasic(trimmed, options);
            }
        }

        return this.formatBasic(trimmed, options);
    }

    private async formatWithPrettier(content: string, options: FormattingOptions): Promise<string> {
        const indentSize = options.useTabs ? undefined : options.indentSize;

        const formatted = await prettier.format(content, {
            parser: 'babel',
            printWidth: 100,
            tabWidth: indentSize,
            useTabs: options.useTabs,
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
        });

        return formatted.trim();
    }

    private formatBasic(content: string, options: FormattingOptions): string {
        const lines = content.split('\n');
        const formattedLines: string[] = [];
        let indentLevel = 0;
        let inMultilineComment = false;
        let inSingleLineString = false;
        let inMultiLineString = false;
        const stringChar: string[] = [];

        for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed) {
                formattedLines.push('');
                continue;
            }

            let currentLine = trimmed;

            if (this.isClosingBrace(line)) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            const indent = this.getIndent(indentLevel, options);
            formattedLines.push(indent + currentLine);

            if (this.isOpeningBrace(line) && !line.includes('}')) {
                indentLevel++;
            }

            if (trimmed.startsWith('//')) {
                continue;
            }

            if (trimmed.startsWith('/*')) {
                inMultilineComment = true;
            }

            if (trimmed.endsWith('*/')) {
                inMultilineComment = false;
            }

            if (!inMultilineComment) {
                let braceCount = 0;
                let parenCount = 0;
                let squareCount = 0;
                let inString = false;
                let stringType = '';

                for (let i = 0; i < currentLine.length; i++) {
                    const char = currentLine[i];
                    const prevChar = i > 0 ? currentLine[i - 1] : '';

                    if (!inString && (char === '"' || char === "'" || char === '`')) {
                        inString = true;
                        stringType = char;
                    } else if (inString && char === stringType && prevChar !== '\\') {
                        inString = false;
                        stringType = '';
                    }

                    if (!inString) {
                        if (char === '{') braceCount++;
                        if (char === '}') braceCount--;
                        if (char === '(') parenCount++;
                        if (char === ')') parenCount--;
                        if (char === '[') squareCount++;
                        if (char === ']') squareCount--;
                    }
                }
            }
        }

        return formattedLines.join('\n');
    }

    private isOpeningBrace(line: string): boolean {
        const trimmed = line.trim();
        return trimmed.endsWith('{') ||
               trimmed.endsWith('{ ') ||
               !!trimmed.includes('{') && !!trimmed.match(/}$/);
    }

    private isClosingBrace(line: string): boolean {
        const trimmed = line.trim();
        return trimmed.startsWith('}') ||
               trimmed.startsWith('} ') ||
               trimmed.startsWith('};') ||
               trimmed.startsWith('},');
    }

    private getIndent(level: number, options: FormattingOptions): string {
        if (options.useTabs) {
            return '\t'.repeat(level);
        }
        return ' '.repeat(level * options.indentSize);
    }
}
