import { FormattingOptions } from './erbFormatter';

/**
 * Formatter for Ruby code that handles spacing, operators, and Ruby-specific syntax
 */
export class RubyFormatter {
    private operators = [
        '==', '!=', '<=', '>=', '<', '>', '&&', '||', '+', '-', '*', '/', '%',
        '=', '+=', '-=', '*=', '/=', '%=', '<<', '>>', '&', '|', '^', '~'
    ];

    private railsHelpers = [
        'link_to', 'button_to', 'mail_to', 'form_with', 'form_for', 'form_tag',
        'content_for', 'content_tag', 'tag', 'image_tag', 'stylesheet_link_tag',
        'javascript_include_tag', 'render', 'partial', 'collection'
    ];

    /**
     * Formats Ruby code with proper spacing and syntax conventions
     * @param content - Ruby code to format
     * @param options - Formatting options
     * @returns Formatted Ruby code
     */
    format(content: string, options: FormattingOptions): string {
        let formatted = content.trim();

        // Parse and format while preserving string literals
        formatted = this.formatPreservingStrings(formatted);

        return formatted;
    }

    private formatPreservingStrings(content: string): string {
        const stringRegex = /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g;
        const regexRegex = /\/(?:[^\/\\\n]|\\.)+\/[gimuy]*/g;
        const strings: string[] = [];
        const regexes: string[] = [];
        let stringIndex = 0;
        let regexIndex = 0;

        // Extract strings and replace with placeholders
        let withoutStrings = content.replace(stringRegex, (match) => {
            strings.push(match);
            return `__STRING_${stringIndex++}__`;
        });

        // Extract regex patterns and replace with placeholders
        withoutStrings = withoutStrings.replace(regexRegex, (match) => {
            regexes.push(match);
            return `__REGEX_${regexIndex++}__`;
        });

        // Format the code without strings and regexes
        withoutStrings = this.normalizeOperatorSpacing(withoutStrings);
        withoutStrings = this.normalizeBracketSpacing(withoutStrings);
        withoutStrings = this.normalizeCommaSpacing(withoutStrings);
        withoutStrings = this.normalizeColonSpacing(withoutStrings);
        withoutStrings = this.formatSpecialRubyConstructs(withoutStrings);
        withoutStrings = this.formatRailsHelpers(withoutStrings);
        withoutStrings = this.formatMethodChains(withoutStrings);
        withoutStrings = this.removeExtraSpaces(withoutStrings);

        // Restore regexes
        regexes.forEach((regex, index) => {
            withoutStrings = withoutStrings.replace(`__REGEX_${index}__`, regex);
        });

        // Restore strings
        strings.forEach((str, index) => {
            withoutStrings = withoutStrings.replace(`__STRING_${index}__`, str);
        });

        return withoutStrings;
    }

    private normalizeOperatorSpacing(content: string): string {
        let result = content;

        // First, protect multi-character operators by replacing them with placeholders
        const multiCharOps = ['==', '!=', '<=', '>=', '&&', '||', '+=', '-=', '*=', '/=', '%=', '<<', '>>', '=>'];
        const placeholders: { [key: string]: string } = {};

        multiCharOps.forEach((op, index) => {
            const placeholder = `__OP_${index}__`;
            placeholders[placeholder] = op;
            const escapedOp = this.escapeRegex(op);
            const regex = new RegExp(`\\s*${escapedOp}\\s*`, 'g');
            result = result.replace(regex, ` ${placeholder} `);
        });

        // Then handle single-character operators
        const singleCharOps = ['=', '+', '-', '*', '/', '%', '<', '>', '&', '|', '^'];

        singleCharOps.forEach(op => {
            const escapedOp = this.escapeRegex(op);
            const regex = new RegExp(`\\s*${escapedOp}\\s*`, 'g');
            result = result.replace(regex, ` ${op} `);
        });

        // Finally, restore multi-character operators
        Object.entries(placeholders).forEach(([placeholder, op]) => {
            result = result.replace(new RegExp(placeholder, 'g'), op);
        });

        // Clean up any double spaces created
        result = result.replace(/\s{2,}/g, ' ');

        return result;
    }

    private normalizeBracketSpacing(content: string): string {
        return content
            // Remove spaces after opening parentheses
            .replace(/\(\s+/g, '(')
            // Remove spaces before closing parentheses
            .replace(/\s+\)/g, ')')
            // Remove spaces after opening square brackets
            .replace(/\[\s+/g, '[')
            // Remove spaces before closing square brackets
            .replace(/\s+\]/g, ']')
            // Add spaces after opening curly braces (for hashes)
            .replace(/\{\s*/g, '{ ')
            // Add spaces before closing curly braces (for hashes)
            .replace(/\s*\}/g, ' }')
            // Handle empty hashes
            .replace(/\{\s+\}/g, '{}');
    }

    private normalizeCommaSpacing(content: string): string {
        return content
            // Remove spaces before commas
            .replace(/\s+,/g, ',')
            // Add space after commas if there isn't one
            .replace(/,(?!\s)/g, ', ');
    }

    private normalizeColonSpacing(content: string): string {
        let result = content;

        result = result.replace(/\s*=>\s*/g, ' => ');

        result = result.replace(/\s:([a-zA-Z_][a-zA-Z0-9_?!]*)/g, ' :$1');

        result = result.replace(/([\{\(,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*/g, '$1$2: ');

        result = result.replace(/(\s)([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^\s:])/g, '$1$2: $3');

        return result;
    }

    private removeExtraSpaces(content: string): string {
        return content
            // Multiple consecutive spaces
            .replace(/\s{2,}/g, ' ')
            // Trim start and end
            .trim();
    }

    private formatRailsHelpers(content: string): string {
        let result = content;

        // Format common Rails helpers with proper spacing
        for (const helper of this.railsHelpers) {
            // Format helper method calls with proper spacing around arguments
            const helperRegex = new RegExp(`${helper}\\s*\\(`, 'g');
            result = result.replace(helperRegex, `${helper}(`);
        }

        return result;
    }

    private formatSpecialRubyConstructs(content: string): string {
        return content
            // Fix lambda arrows: - > should be ->
            .replace(/\s*-\s*>\s*/g, '->')
            // Fix block parameters: | x | should be |x|
            .replace(/\|\s+([^|]+)\s+\|/g, '|$1|')
            // Fix proc blocks: proc { | x | should be proc { |x|
            .replace(/proc\s*\{\s*\|\s*([^|]+)\s*\|/g, 'proc { |$1|');
    }

    private formatMethodChains(content: string): string {
        // Format method chains - ensure proper spacing around dots
        return content
            .replace(/\s*\.\s*/g, '.')
            .replace(/\?\s*\./g, '?.');
    }

    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
