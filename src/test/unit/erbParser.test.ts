import { expect } from 'chai';
import { ErbParser, ErbToken } from '../../formatter/erbParser';

describe('ErbParser', () => {
    let parser: ErbParser;

    beforeEach(() => {
        parser = new ErbParser();
    });

    describe('Basic ERB parsing', () => {
        it('should parse simple HTML content', () => {
            const input = '<div>Hello World</div>';
            const tokens = parser.parse(input);

            expect(tokens).to.have.length(1);
            expect(tokens[0].type).to.equal('html');
            expect(tokens[0].content).to.equal('<div>Hello World</div>');
        });

        it('should parse ERB output expressions', () => {
            const input = '<%= user.name %>';
            const tokens = parser.parse(input);

            expect(tokens).to.have.length(1);
            expect(tokens[0].type).to.equal('ruby_output');
            expect(tokens[0].content).to.equal('user.name');
        });

        it('should parse ERB code expressions', () => {
            const input = '<% if user.present? %>';
            const tokens = parser.parse(input);

            expect(tokens).to.have.length(1);
            expect(tokens[0].type).to.equal('ruby_block_start');
            expect(tokens[0].content).to.equal('if user.present?');
        });

        it('should parse ERB comments', () => {
            const input = '<%# This is a comment %>';
            const tokens = parser.parse(input);

            expect(tokens).to.have.length(1);
            expect(tokens[0].type).to.equal('comment');
            expect(tokens[0].content).to.equal('This is a comment');
        });
    });

    describe('Complex ERB parsing', () => {
        it('should parse mixed HTML and ERB', () => {
            const input = '<div><%= user.name %></div>';
            const tokens = parser.parse(input);

            expect(tokens).to.have.length(3);
            expect(tokens[0].type).to.equal('html');
            expect(tokens[0].content).to.equal('<div>');
            expect(tokens[1].type).to.equal('ruby_output');
            expect(tokens[1].content).to.equal('user.name');
            expect(tokens[2].type).to.equal('html');
            expect(tokens[2].content).to.equal('</div>');
        });

        it('should parse nested ERB blocks', () => {
            const input = `<% if user.present? %>
  <% user.posts.each do |post| %>
    <%= post.title %>
  <% end %>
<% end %>`;
            const tokens = parser.parse(input);

            const blockStarts = tokens.filter(t => t.type === 'ruby_block_start');
            const blockEnds = tokens.filter(t => t.type === 'ruby_block_end');

            expect(blockStarts).to.have.length(2);
            expect(blockEnds).to.have.length(2);
        });

        it('should handle malformed ERB gracefully', () => {
            const input = '<% incomplete erb';
            const tokens = parser.parse(input);

            expect(tokens).to.have.length(1);
            expect(tokens[0].type).to.equal('html');
        });
    });

    describe('Block detection', () => {
        it('should detect if statements as block starts', () => {
            const input = '<% if condition %>';
            const tokens = parser.parse(input);

            expect(tokens[0].type).to.equal('ruby_block_start');
        });

        it('should detect unless statements as block starts', () => {
            const input = '<% unless condition %>';
            const tokens = parser.parse(input);

            expect(tokens[0].type).to.equal('ruby_block_start');
        });

        it('should detect each blocks as block starts', () => {
            const input = '<% users.each do |user| %>';
            const tokens = parser.parse(input);

            expect(tokens[0].type).to.equal('ruby_block_start');
        });

        it('should detect end statements as block ends', () => {
            const input = '<% end %>';
            const tokens = parser.parse(input);

            expect(tokens[0].type).to.equal('ruby_block_end');
        });

        it('should detect else statements as block ends', () => {
            const input = '<% else %>';
            const tokens = parser.parse(input);

            expect(tokens[0].type).to.equal('ruby_block_end');
        });
    });

    describe('Edge cases', () => {
        it('should handle empty lines', () => {
            const input = '\n\n<div></div>\n\n';
            const tokens = parser.parse(input);

            const blankLines = tokens.filter(t => t.type === 'blank_line');
            expect(blankLines).to.have.length(4);
        });

        it('should handle ERB with special characters', () => {
            const input = '<%= "Hello & Goodbye" %>';
            const tokens = parser.parse(input);

            expect(tokens[0].type).to.equal('ruby_output');
            expect(tokens[0].content).to.equal('"Hello & Goodbye"');
        });

        it('should handle multiple ERB tags on same line', () => {
            const input = '<%= user.name %> - <%= user.email %>';
            const tokens = parser.parse(input);

            expect(tokens).to.have.length(3);
            expect(tokens[0].type).to.equal('ruby_output');
            expect(tokens[1].type).to.equal('html');
            expect(tokens[2].type).to.equal('ruby_output');
        });
    });
});
