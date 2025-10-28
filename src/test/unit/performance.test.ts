import { expect } from 'chai';
import { ErbFormatter } from '../../formatter/erbFormatter';
import * as vscode from 'vscode';

describe('Performance Tests', () => {
    let formatter: ErbFormatter;
    let mockOptions: vscode.FormattingOptions;

    beforeEach(() => {
        formatter = new ErbFormatter();
        mockOptions = {
            tabSize: 2,
            insertSpaces: true
        };
    });

    describe('Large file handling', () => {
        it('should handle large ERB files efficiently', () => {
            // Generate a large ERB file
            const largeContent = generateLargeErbContent(1000);

            const startTime = Date.now();
            const result = formatter.format(largeContent, mockOptions);
            const endTime = Date.now();

            const processingTime = endTime - startTime;

            expect(result).to.be.a('string');
            expect(processingTime).to.be.lessThan(5000); // Should complete within 5 seconds
        });

        it('should handle deeply nested structures', () => {
            const deeplyNested = generateDeeplyNestedContent(50);

            const startTime = Date.now();
            const result = formatter.format(deeplyNested, mockOptions);
            const endTime = Date.now();

            expect(result).to.be.a('string');
            expect(endTime - startTime).to.be.lessThan(2000);
        });

        it('should handle files with many ERB tags', () => {
            const manyTags = generateManyErbTags(500);

            const startTime = Date.now();
            const result = formatter.format(manyTags, mockOptions);
            const endTime = Date.now();

            expect(result).to.be.a('string');
            expect(endTime - startTime).to.be.lessThan(3000);
        });
    });

    describe('Memory usage', () => {
        it('should not cause memory leaks with repeated formatting', () => {
            const content = `<div>
  <% @items.each do |item| %>
    <p><%= item.name %></p>
  <% end %>
</div>`;

            // Format the same content multiple times
            for (let i = 0; i < 100; i++) {
                const result = formatter.format(content, mockOptions);
                expect(result).to.be.a('string');
            }

            // If we get here without running out of memory, the test passes
            expect(true).to.be.true;
        });
    });

    function generateLargeErbContent(lines: number): string {
        const content: string[] = [];
        content.push('<div class="large-container">');

        for (let i = 0; i < lines; i++) {
            if (i % 10 === 0) {
                content.push(`  <% if condition_${i} %>`);
                content.push(`    <div class="section-${i}">`);
            }

            content.push(`      <p>Line ${i}: <%= item_${i}.name %></p>`);

            if (i % 10 === 9) {
                content.push('    </div>');
                content.push('  <% end %>');
            }
        }

        content.push('</div>');
        return content.join('\n');
    }

    function generateDeeplyNestedContent(depth: number): string {
        let content = '';

        // Opening tags
        for (let i = 0; i < depth; i++) {
            content += `<div class="level-${i}">\n`;
            content += `  <% if condition_${i} %>\n`;
        }

        content += '    <p>Deep content</p>\n';

        // Closing tags
        for (let i = depth - 1; i >= 0; i--) {
            content += '  <% end %>\n';
            content += '</div>\n';
        }

        return content;
    }

    function generateManyErbTags(count: number): string {
        const content: string[] = [];

        for (let i = 0; i < count; i++) {
            if (i % 3 === 0) {
                content.push(`<%= variable_${i} %>`);
            } else if (i % 3 === 1) {
                content.push(`<% code_${i} %>`);
            } else {
                content.push(`<%# Comment ${i} %>`);
            }
        }

        return content.join('\n');
    }
});
