import { ErbParser } from './erbParser';
import { HtmlFormatter } from './htmlFormatter';
import { RubyFormatter } from './rubyFormatter';
import { logger } from '../utils/logger';

export interface FormattingOptions {
    indentSize: number;
    useTabs: boolean;
    preserveBlankLines: boolean;
}

export interface VSCodeFormattingOptions {
    tabSize?: number;
    insertSpaces?: boolean;
}

export class ErbFormatter {
    private parser: ErbParser;
    private htmlFormatter: HtmlFormatter;
    private rubyFormatter: RubyFormatter;

    constructor() {
        this.parser = new ErbParser();
        this.htmlFormatter = new HtmlFormatter();
        this.rubyFormatter = new RubyFormatter();
    }

    /**
     * Formats ERB template content with proper indentation and spacing
     * @param text - The ERB template content to format
     * @param options - VS Code formatting options (tabSize, insertSpaces)
     * @param config - Optional workspace configuration
     * @returns Formatted ERB template string
     */
    format(text: string, options: VSCodeFormattingOptions, config?: any): string {
        const formattingOptions: FormattingOptions = {
            indentSize: options.tabSize || (config?.get('indentSize') ?? 2),
            useTabs: options.insertSpaces === false || (config?.get('useTabs') ?? false),
            preserveBlankLines: config?.get('preserveBlankLines') ?? true
        };

        try {
            logger.debug('Starting ERB formatting', { textLength: text.length, options: formattingOptions });
            const tokens = this.parser.parse(text);
            logger.debug('Parsed tokens', { tokenCount: tokens.length });
            const result = this.formatTokens(tokens, formattingOptions);
            logger.debug('Formatting complete', { resultLength: result.length });
            return result;
        } catch (error) {
            logger.error('Error formatting ERB:', error);
            return text;
        }
    }

    private formatTokens(tokens: any[], options: FormattingOptions): string {
        let result = '';
        let indentLevel = 0;
        let previousWasBlank = false;
        let inlineContext = false;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const nextToken = tokens[i + 1];
            const prevToken = tokens[i - 1];

            // Detect inline context (ERB mixed with HTML on same line)
            inlineContext = this.isInlineContext(token, prevToken, nextToken, tokens, i);

            switch (token.type) {
                case 'html':
                    if (inlineContext) {
                        // For inline context, add indentation only for the first token on the line
                        const isFirstTokenOnLine = !prevToken || prevToken.line !== token.line;
                        if (isFirstTokenOnLine) {
                            const indent = this.getIndent(indentLevel, options);
                            result += indent + token.content;
                        } else {
                            result += token.content;
                        }
                        // Still update indent level for HTML structure
                        indentLevel = this.htmlFormatter.getIndentLevel(token.content, indentLevel);
                    } else {
                        const formattedHtml = this.htmlFormatter.format(token.content, indentLevel, options);
                        result += formattedHtml;
                        indentLevel = this.htmlFormatter.getIndentLevel(token.content, indentLevel);
                    }
                    break;

                case 'ruby_expression':
                case 'ruby_output':
                    const formattedRuby = this.rubyFormatter.format(token.content, options);
                    if (inlineContext) {
                        result += `<%${token.type === 'ruby_output' ? '=' : ''} ${formattedRuby} %>`;
                    } else {
                        const indent = this.getIndent(indentLevel, options);
                        result += `${indent}<%${token.type === 'ruby_output' ? '=' : ''} ${formattedRuby} %>`;
                    }
                    break;

                case 'ruby_block_start':
                    const blockIndent = this.getIndent(indentLevel, options);
                    const formattedBlockStart = this.rubyFormatter.format(token.content, options);
                    result += `${blockIndent}<% ${formattedBlockStart} %>`;
                    indentLevel++;
                    break;

                case 'ruby_output_block_start':
                    const outputBlockIndent = this.getIndent(indentLevel, options);
                    const formattedOutputBlockStart = this.rubyFormatter.format(token.content, options);
                    result += `${outputBlockIndent}<%= ${formattedOutputBlockStart} %>`;
                    indentLevel++;
                    break;

                case 'ruby_block_end':
                    indentLevel = Math.max(0, indentLevel - 1);
                    const endIndent = this.getIndent(indentLevel, options);
                    result += `${endIndent}<% ${token.content} %>`;
                    break;

                case 'comment':
                    const commentIndent = this.getIndent(indentLevel, options);
                    result += `${commentIndent}<%# ${token.content.trim()} %>`;
                    break;

                case 'blank_line':
                    if (options.preserveBlankLines && !previousWasBlank) {
                        result += '\n';
                        previousWasBlank = true;
                        continue;
                    }
                    break;

                default:
                    result += token.content;
            }

            // Add line break if necessary
            const nextInlineContext = nextToken ? this.isInlineContext(nextToken, token, tokens[i + 2], tokens, i + 1) : false;
            if (token.type !== 'blank_line' && nextToken && !inlineContext && !nextInlineContext) {
                result += '\n';
                previousWasBlank = false;
            }
        }

        return this.cleanupResult(result);
    }

    private isInlineContext(token: any, prevToken: any, nextToken: any, allTokens?: any[], currentIndex?: number): boolean {
        if (!token || token.type === 'blank_line') {
            return false;
        }

        if (prevToken && prevToken.line === token.line && prevToken.type === 'html') {
            return true;
        }
        if (nextToken && nextToken.line === token.line && nextToken.type === 'html') {
            return true;
        }

        // Special case: if this is an HTML token, check if there are mixed tokens on the same line
        // But only if the line contains a complete inline expression (like <tag>ERB</tag>)
        if (token.type === 'html' && allTokens && currentIndex !== undefined) {
            const tokensOnSameLine = allTokens.filter(t => t.line === token.line);
            const hasNonHtmlOnSameLine = tokensOnSameLine.some(t => t.type !== 'html');

            // Only consider inline if this line has both opening and closing HTML tags
            // This prevents single opening/closing tags from being treated as inline
            const htmlTokensOnLine = tokensOnSameLine.filter(t => t.type === 'html');
            const hasOpeningTag = htmlTokensOnLine.some(t => t.content.match(/^<[^\/]/));
            const hasClosingTag = htmlTokensOnLine.some(t => t.content.match(/^<\//));

            return hasNonHtmlOnSameLine && hasOpeningTag && hasClosingTag;
        }

        return false;
    }

    private cleanupResult(result: string): string {
        // Remove excessive blank lines (more than 2 consecutive)
        result = result.replace(/\n{3,}/g, '\n\n');

        // Ensure file ends with single newline
        result = result.trim() + '\n';

        // Remove trailing whitespace from lines
        result = result.replace(/[ \t]+$/gm, '');

        return result;
    }

    private getIndent(level: number, options: FormattingOptions): string {
        if (options.useTabs) {
            return '\t'.repeat(level);
        }
        return ' '.repeat(level * options.indentSize);
    }
}
