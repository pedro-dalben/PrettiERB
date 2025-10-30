export interface ErbToken {
    type: 'html' | 'ruby_expression' | 'ruby_output' | 'ruby_output_block_start' | 'ruby_block_start' | 'ruby_block_end' | 'comment' | 'blank_line' | 'javascript';
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
        let pendingHtmlTag: { content: string, startLine: number, startColumn: number } | null = null;
        let pendingErbTag: { content: string, startLine: number, startColumn: number } | null = null;
        let insideScript = false;
        let scriptStartLine = 0;
        let scriptContent: string[] = [];

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];

            if (this.isBlankLine(line)) {
                if (pendingHtmlTag) {
                    pendingHtmlTag.content += '\n';
                } else if (pendingErbTag) {
                    pendingErbTag.content += '\n';
                } else if (insideScript) {
                    scriptContent.push('');
                } else {
                    tokens.push({
                        type: 'blank_line',
                        content: '',
                        line: lineIndex + 1,
                        column: 0
                    });
                }
                continue;
            }

            const trimmedLine = line.trim();

            if (pendingErbTag) {
                pendingErbTag.content += '\n' + line;

                if (line.includes('%>')) {
                    const erbContent = pendingErbTag.content.substring(
                        pendingErbTag.content.indexOf('<%') + 2,
                        pendingErbTag.content.lastIndexOf('%>')
                    ).trim();

                    const erbToken = this.parseErbContent(erbContent, pendingErbTag.startLine, pendingErbTag.startColumn);
                    tokens.push(erbToken);
                    pendingErbTag = null;
                }
                continue;
            }

            if (insideScript) {
                if (trimmedLine === '</script>') {
                    insideScript = false;
                    const jsContent = scriptContent.join('\n').trim();
                    if (jsContent) {
                        tokens.push({
                            type: 'javascript',
                            content: jsContent,
                            line: scriptStartLine,
                            column: 0
                        });
                    }
                    tokens.push({
                        type: 'html',
                        content: trimmedLine,
                        line: lineIndex + 1,
                        column: 0
                    });
                    scriptContent = [];
                    continue;
                } else {
                    scriptContent.push(line);
                    continue;
                }
            }

            if (pendingHtmlTag) {
                pendingHtmlTag.content += '\n' + line;

                if (this.isHtmlTagComplete(pendingHtmlTag.content)) {
                    const content = pendingHtmlTag.content.trim();

                    if (this.isScriptOpeningTag(content)) {
                        insideScript = true;
                        scriptStartLine = lineIndex + 2;
                    }

                    tokens.push({
                        type: 'html',
                        content: content,
                        line: pendingHtmlTag.startLine,
                        column: pendingHtmlTag.startColumn
                    });
                    pendingHtmlTag = null;
                }
                continue;
            }

            if (line.includes('<%') && !line.includes('%>')) {
                pendingErbTag = {
                    content: line,
                    startLine: lineIndex + 1,
                    startColumn: line.indexOf('<%')
                };
                continue;
            }

            if (trimmedLine.startsWith('<script')) {
                if (trimmedLine.includes('</script>')) {
                    const startMatch = trimmedLine.match(/<script[^>]*>/);
                    const endMatch = trimmedLine.match(/<\/script>/);
                    if (startMatch && endMatch) {
                        const startTag = startMatch[0];
                        const jsContent = trimmedLine.substring(startMatch.index! + startTag.length, endMatch.index).trim();
                        tokens.push({
                            type: 'html',
                            content: startTag,
                            line: lineIndex + 1,
                            column: 0
                        });
                        if (jsContent) {
                            tokens.push({
                                type: 'javascript',
                                content: jsContent,
                                line: lineIndex + 1,
                                column: 0
                            });
                        }
                        tokens.push({
                            type: 'html',
                            content: '</script>',
                            line: lineIndex + 1,
                            column: 0
                        });
                        continue;
                    }
                } else {
                    pendingHtmlTag = {
                        content: line,
                        startLine: lineIndex + 1,
                        startColumn: line.indexOf('<')
                    };
                    continue;
                }
            }

            if (this.startsHtmlTag(trimmedLine) && !this.isHtmlTagComplete(line)) {
                pendingHtmlTag = {
                    content: line,
                    startLine: lineIndex + 1,
                    startColumn: line.indexOf('<')
                };
                continue;
            }

            const lineTokens = this.parseLine(line, lineIndex + 1);
            tokens.push(...lineTokens);
        }

        if (pendingErbTag) {
            tokens.push({
                type: 'html',
                content: pendingErbTag.content.trim(),
                line: pendingErbTag.startLine,
                column: pendingErbTag.startColumn
            });
        }

        if (pendingHtmlTag) {
            tokens.push({
                type: 'html',
                content: pendingHtmlTag.content.trim(),
                line: pendingHtmlTag.startLine,
                column: pendingHtmlTag.startColumn
            });
        }

        if (insideScript && scriptContent.length > 0) {
            const jsContent = scriptContent.join('\n').trim();
            if (jsContent) {
                tokens.push({
                    type: 'javascript',
                    content: jsContent,
                    line: scriptStartLine,
                    column: 0
                });
            }
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

    private isScriptOpeningTag(content: string): boolean {
        return /^<script[^>]*>$/i.test(content.trim());
    }

    private startsHtmlTag(line: string): boolean {
        return /^\s*<[a-zA-Z][a-zA-Z0-9]*/.test(line);
    }

    private isHtmlTagComplete(content: string): boolean {
        let inString = false;
        let stringChar = '';
        let inErb = false;
        let tagStarted = false;

        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            const nextChar = content[i + 1];

            if (!inString && char === '<' && nextChar === '%') {
                inErb = true;
                i++;
                continue;
            }

            if (inErb && char === '%' && nextChar === '>') {
                inErb = false;
                i++;
                continue;
            }

            if (inErb) {
                continue;
            }

            if (!inString && (char === '"' || char === "'")) {
                inString = true;
                stringChar = char;
                continue;
            }

            if (inString && char === stringChar && content[i - 1] !== '\\') {
                inString = false;
                stringChar = '';
                continue;
            }

            if (!inString && !inErb) {
                if (char === '<') {
                    tagStarted = true;
                }

                if (char === '>' && tagStarted) {
                    return true;
                }
            }
        }

        return false;
    }
}
