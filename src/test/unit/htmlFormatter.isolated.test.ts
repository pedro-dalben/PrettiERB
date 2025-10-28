import { expect } from 'chai';
import { HtmlFormatter } from '../../formatter/htmlFormatter';

interface FormattingOptions {
    indentSize: number;
    useTabs: boolean;
    preserveBlankLines: boolean;
}

describe('HtmlFormatter (Isolated)', () => {
    let formatter: HtmlFormatter;
    let options: FormattingOptions;

    beforeEach(() => {
        formatter = new HtmlFormatter();
        options = {
            indentSize: 2,
            useTabs: false,
            preserveBlankLines: true
        };
    });

    describe('Basic HTML formatting', () => {
        it('should format opening tags with proper indentation', () => {
            const input = '<div>';
            const result = formatter.format(input, 0, options);
            expect(result).to.equal('<div>');
        });

        it('should format closing tags with proper indentation', () => {
            const input = '</div>';
            const result = formatter.format(input, 1, options);
            expect(result).to.equal('</div>');
        });

        it('should format self-closing tags', () => {
            const input = '<br />';
            const result = formatter.format(input, 0, options);
            expect(result).to.equal('<br />');
        });
    });

    describe('Indentation calculation', () => {
        it('should increase indent level for opening tags', () => {
            const content = '<div>';
            const newLevel = formatter.getIndentLevel(content, 0);
            expect(newLevel).to.equal(1);
        });

        it('should decrease indent level for closing tags', () => {
            const content = '</div>';
            const newLevel = formatter.getIndentLevel(content, 1);
            expect(newLevel).to.equal(0);
        });

        it('should not change indent level for self-closing tags', () => {
            const content = '<br />';
            const newLevel = formatter.getIndentLevel(content, 0);
            expect(newLevel).to.equal(0);
        });

        it('should not change indent level for void elements', () => {
            const content = '<img>';
            const newLevel = formatter.getIndentLevel(content, 0);
            expect(newLevel).to.equal(0);
        });
    });

    describe('Tag recognition', () => {
        it('should recognize standard HTML tags', () => {
            const content = '<div class="container">';
            const result = formatter.format(content, 0, options);
            expect(result).to.equal('<div class="container">');
        });

        it('should handle tags with attributes', () => {
            const content = '<input type="text" name="username" required>';
            const result = formatter.format(content, 0, options);
            expect(result).to.equal('<input type="text" name="username" required>');
        });

        it('should handle custom elements', () => {
            const content = '<custom-element>';
            const result = formatter.format(content, 0, options);
            expect(result).to.equal('<custom-element>');
        });
    });

    describe('Text content formatting', () => {
        it('should format text content with increased indentation', () => {
            const content = 'Hello World';
            const result = formatter.format(content, 0, options);
            expect(result).to.equal('  Hello World');
        });

        it('should preserve text content', () => {
            const content = 'This is some text with spaces';
            const result = formatter.format(content, 0, options);
            expect(result).to.equal('  This is some text with spaces');
        });
    });

    describe('Indentation with tabs', () => {
        beforeEach(() => {
            options.useTabs = true;
        });

        it('should use tabs for indentation when configured', () => {
            const content = '<div>';
            const result = formatter.format(content, 1, options);
            expect(result).to.equal('\t<div>');
        });

        it('should calculate tab indentation correctly', () => {
            const content = '<div>';
            const result = formatter.format(content, 2, options);
            expect(result).to.equal('\t\t<div>');
        });
    });

    describe('Custom indent size', () => {
        beforeEach(() => {
            options.indentSize = 4;
        });

        it('should use custom indent size', () => {
            const content = '<div>';
            const result = formatter.format(content, 1, options);
            expect(result).to.equal('    <div>');
        });

        it('should calculate custom indentation correctly', () => {
            const content = '<div>';
            const result = formatter.format(content, 2, options);
            expect(result).to.equal('        <div>');
        });
    });

    describe('Edge cases', () => {
        it('should handle empty content', () => {
            const content = '';
            const result = formatter.format(content, 0, options);
            expect(result).to.equal('');
        });

        it('should handle whitespace-only content', () => {
            const content = '   ';
            const result = formatter.format(content, 0, options);
            expect(result).to.equal('');
        });

        it('should handle malformed tags gracefully', () => {
            const content = '<div class="unclosed';
            const result = formatter.format(content, 0, options);
            expect(result).to.equal('<div class="unclosed');
        });

        it('should prevent negative indentation', () => {
            const content = '</div>';
            const newLevel = formatter.getIndentLevel(content, 0);
            expect(newLevel).to.equal(0);
        });
    });

    describe('HTML5 elements', () => {
        it('should handle semantic HTML5 elements', () => {
            const elements = ['<section>', '<article>', '<aside>', '<header>', '<footer>', '<nav>', '<main>'];

            elements.forEach(element => {
                const newLevel = formatter.getIndentLevel(element, 0);
                expect(newLevel).to.equal(1);
            });
        });

        it('should handle HTML5 void elements', () => {
            const elements = ['<area>', '<base>', '<br>', '<col>', '<embed>', '<hr>', '<img>', '<input>', '<link>', '<meta>', '<param>', '<source>', '<track>', '<wbr>'];

            elements.forEach(element => {
                const newLevel = formatter.getIndentLevel(element, 0);
                expect(newLevel).to.equal(0);
            });
        });
    });
});
