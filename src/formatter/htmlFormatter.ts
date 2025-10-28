import { FormattingOptions } from './erbFormatter';

/**
 * Formatter for HTML content with intelligent indentation based on tag structure
 */
export class HtmlFormatter {
    private selfClosingTags = [
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
        'link', 'meta', 'param', 'source', 'track', 'wbr'
    ];

    private blockElements = [
        'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
        'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'form',
        'fieldset', 'legend', 'section', 'article', 'aside', 'header',
        'footer', 'nav', 'main', 'figure', 'figcaption', 'blockquote'
    ];

    /**
     * Formats HTML content with appropriate indentation
     * @param content - HTML content to format
     * @param indentLevel - Current indentation level
     * @param options - Formatting options
     * @returns Formatted HTML content with indentation
     */
    format(content: string, indentLevel: number, options: FormattingOptions): string {
        const trimmed = content.trim();
        if (!trimmed) {
            return '';
        }

        const indent = this.getIndent(indentLevel, options);

        // Se é uma tag de abertura, aplicar indentação
        if (this.isOpeningTag(trimmed)) {
            return `${indent}${trimmed}`;
        }

        // Se é uma tag de fechamento, aplicar indentação reduzida
        if (this.isClosingTag(trimmed)) {
            const reducedIndent = this.getIndent(Math.max(0, indentLevel - 1), options);
            return `${reducedIndent}${trimmed}`;
        }

        // Conteúdo de texto
        if (this.isTextContent(trimmed)) {
            const textIndent = this.getIndent(indentLevel + 1, options);
            return `${textIndent}${trimmed}`;
        }

        return `${indent}${trimmed}`;
    }

    /**
     * Calculates the new indentation level after processing HTML content
     * @param content - HTML content
     * @param currentLevel - Current indentation level
     * @returns New indentation level
     */
    getIndentLevel(content: string, currentLevel: number): number {
        const trimmed = content.trim();

        if (this.isOpeningTag(trimmed)) {
            const tagName = this.extractTagName(trimmed);
            if (tagName && !this.selfClosingTags.includes(tagName) && !this.isSelfClosing(trimmed)) {
                return currentLevel + 1;
            }
        }

        if (this.isClosingTag(trimmed)) {
            return Math.max(0, currentLevel - 1);
        }

        return currentLevel;
    }

    private isOpeningTag(content: string): boolean {
        return /^<[^\/!][^>]*>$/.test(content.trim());
    }

    private isClosingTag(content: string): boolean {
        return /^<\/[^>]+>$/.test(content.trim());
    }

    private isSelfClosing(content: string): boolean {
        return content.endsWith('/>') || content.endsWith(' />');
    }

    private isTextContent(content: string): boolean {
        return !content.startsWith('<') && !content.endsWith('>');
    }

    private extractTagName(tag: string): string | null {
        const match = tag.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
        return match ? match[1].toLowerCase() : null;
    }

    private getIndent(level: number, options: FormattingOptions): string {
        if (options.useTabs) {
            return '\t'.repeat(level);
        }
        return ' '.repeat(level * options.indentSize);
    }
}
