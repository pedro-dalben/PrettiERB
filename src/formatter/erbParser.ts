export interface ErbToken {
    type: 'html' | 'ruby_expression' | 'ruby_output' | 'ruby_output_block_start' | 'ruby_block_start' | 'ruby_block_end' | 'comment' | 'blank_line';
    content: string;
    line: number;
    column: number;
}

/**
 * Parser for ERB templates that tokenizes content into HTML, Ruby code, and ERB tags
 */
export class ErbParser {
    private rubyBlockKeywords = [
        'if', 'unless', 'case', 'for', 'while', 'def', 'class', 'module',
        'begin', 'do', 'each', 'map', 'select', 'reject', 'times', 'loop',
        'with_index', 'find', 'detect', 'collect', 'inject', 'reduce'
    ];

    private rubyBlockEndKeywords = [
        'end', 'else', 'elsif', 'when', 'rescue', 'ensure'
    ];

    private railsHelpers = [
        'form_with', 'form_for', 'form_tag', 'content_for', 'capture',
        'link_to', 'button_to', 'mail_to', 'content_tag', 'tag'
    ];

    /**
     * Parses ERB template text into a sequence of tokens
     * @param text - The ERB template content
     * @returns Array of ERB tokens with type, content, line, and column information
     */
    parse(text: string): ErbToken[] {
        const tokens: ErbToken[] = [];
        const lines = text.split('\n');

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];

            if (this.isBlankLine(line)) {
                tokens.push({
                    type: 'blank_line',
                    content: '',
                    line: lineIndex + 1,
                    column: 0
                });
                continue;
            }

            const lineTokens = this.parseLine(line, lineIndex + 1);
            tokens.push(...lineTokens);
        }

        return tokens;
    }

    private parseLine(line: string, lineNumber: number): ErbToken[] {
        const tokens: ErbToken[] = [];
        let currentPos = 0;

        while (currentPos < line.length) {
            const erbStart = line.indexOf('<%', currentPos);

            if (erbStart === -1) {
                // Resto da linha é HTML
                const htmlContent = line.substring(currentPos).trim();
                if (htmlContent) {
                    tokens.push({
                        type: 'html',
                        content: htmlContent,
                        line: lineNumber,
                        column: currentPos
                    });
                }
                break;
            }

            // HTML antes do ERB
            if (erbStart > currentPos) {
                const htmlContent = line.substring(currentPos, erbStart).trim();
                if (htmlContent) {
                    tokens.push({
                        type: 'html',
                        content: htmlContent,
                        line: lineNumber,
                        column: currentPos
                    });
                }
            }

            // Encontrar o fim do bloco ERB
            const erbEnd = line.indexOf('%>', erbStart);
            if (erbEnd === -1) {
                // ERB mal formado, tratar como HTML
                tokens.push({
                    type: 'html',
                    content: line.substring(erbStart),
                    line: lineNumber,
                    column: erbStart
                });
                break;
            }

            // Extrair conteúdo ERB
            const erbContent = line.substring(erbStart + 2, erbEnd).trim();
            const erbToken = this.parseErbContent(erbContent, lineNumber, erbStart);
            tokens.push(erbToken);

            currentPos = erbEnd + 2;
        }

        return tokens;
    }

    private parseErbContent(content: string, line: number, column: number): ErbToken {
        // Comentário
        if (content.startsWith('#')) {
            return {
                type: 'comment',
                content: content.substring(1).trim(),
                line,
                column
            };
        }

        // Output (<%=)
        if (content.startsWith('=')) {
            const outputContent = content.substring(1).trim();
            if (this.isBlockStart(outputContent)) {
                return {
                    type: 'ruby_output_block_start',
                    content: outputContent,
                    line,
                    column
                };
            }
            return {
                type: 'ruby_output',
                content: outputContent,
                line,
                column
            };
        }

        // Verificar se é fim de bloco
        const trimmedContent = content.trim();
        if (this.rubyBlockEndKeywords.some(keyword =>
            trimmedContent === keyword || trimmedContent.startsWith(keyword + ' ')
        )) {
            return {
                type: 'ruby_block_end',
                content: trimmedContent,
                line,
                column
            };
        }

        // Verificar se é início de bloco
        if (this.isBlockStart(trimmedContent)) {
            return {
                type: 'ruby_block_start',
                content: trimmedContent,
                line,
                column
            };
        }

        // Expressão Ruby normal
        return {
            type: 'ruby_expression',
            content: trimmedContent,
            line,
            column
        };
    }

    private isBlockStart(content: string): boolean {
        // Check for Ruby block keywords
        const startsWithKeyword = this.rubyBlockKeywords.some(keyword =>
            content.startsWith(keyword + ' ') || content === keyword
        );

        // Check for Rails helpers that take blocks
        const startsWithRailsHelper = this.railsHelpers.some(helper =>
            content.includes(helper) && (content.includes(' do') || content.includes('{'))
        );

        // Check if ends with 'do' or has inline block
        const endsWithDo = content.endsWith(' do') || content.includes(' do ');
        const hasInlineBlock = content.includes('{') && content.includes('}');
        const hasBlockParams = content.includes('|') && !hasInlineBlock;

        // Check for method chains that end with block
        const methodChainWithBlock = /\.\w+\s+(do|\{)/.test(content);

        return startsWithKeyword || startsWithRailsHelper || endsWithDo ||
               hasBlockParams || methodChainWithBlock;
    }

    private isRailsHelper(content: string): boolean {
        return this.railsHelpers.some(helper => content.includes(helper));
    }

    private isBlankLine(line: string): boolean {
        return line.trim() === '';
    }
}
