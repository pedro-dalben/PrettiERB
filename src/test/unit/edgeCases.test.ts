import { expect } from 'chai';
import { ErbFormatter } from '../../formatter/erbFormatter';
import { ErbParser } from '../../formatter/erbParser';
import * as vscode from 'vscode';

describe('Edge Cases Tests', () => {
    let formatter: ErbFormatter;
    let parser: ErbParser;
    let mockOptions: vscode.FormattingOptions;

    beforeEach(() => {
        formatter = new ErbFormatter();
        parser = new ErbParser();
        mockOptions = {
            tabSize: 2,
            insertSpaces: true
        };
    });

    describe('Malformed ERB handling', () => {
        it('should handle unclosed ERB tags', () => {
            const input = '<% if condition';
            const result = formatter.format(input, mockOptions);
            expect(result).to.be.a('string');
        });

        it('should handle ERB tags without closing %>', () => {
            const input = '<%= user.name';
            const result = formatter.format(input, mockOptions);
            expect(result).to.be.a('string');
        });

        it('should handle nested ERB tags', () => {
            const input = '<% if <%= condition %> %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.be.a('string');
        });

        it('should handle ERB tags with special characters', () => {
            const input = '<%= "String with <> & special chars" %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('String with <> & special chars');
        });
    });

    describe('Unicode and encoding', () => {
        it('should handle Unicode characters in ERB', () => {
            const input = '<%= "Hello 世界! 🌍" %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('Hello 世界! 🌍');
        });

        it('should handle emoji in comments', () => {
            const input = '<%# This is a comment with emoji 🚀 %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('🚀');
        });

        it('should handle accented characters', () => {
            const input = '<%= "Café, naïve, résumé" %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('Café, naïve, résumé');
        });
    });

    describe('Complex string handling', () => {
        it('should handle strings with embedded quotes', () => {
            const input = '<%= "He said \\"Hello\\" to me" %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('\\"Hello\\"');
        });

        it('should handle heredoc strings', () => {
            const input = `<%= <<~HTML
  <div>
    <p>Heredoc content</p>
  </div>
HTML %>`;
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('<<~HTML');
        });

        it('should handle interpolated strings', () => {
            const input = '<%= "Hello #{user.name}, welcome!" %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('#{user.name}');
        });
    });

    describe('Whitespace edge cases', () => {
        it('should handle tabs mixed with spaces', () => {
            const input = '<div>\n\t  <% if condition %>\n\t    <p>Content</p>\n\t  <% end %>\n</div>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.be.a('string');
        });

        it('should handle Windows line endings', () => {
            const input = '<div>\r\n<% if condition %>\r\n<p>Content</p>\r\n<% end %>\r\n</div>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.be.a('string');
        });

        it('should handle mixed line endings', () => {
            const input = '<div>\n<% if condition %>\r\n<p>Content</p>\r<% end %>\n</div>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.be.a('string');
        });
    });

    describe('Complex Ruby expressions', () => {
        it('should handle complex method chains', () => {
            const input = '<%= user.posts.published.recent.limit(5).pluck(:title) %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('user.posts.published.recent.limit(5).pluck(:title)');
        });

        it('should handle lambda expressions', () => {
            const input = '<% lambda_func = ->(x) { x * 2 } %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('->(x) { x * 2 }');
        });

        it('should handle proc expressions', () => {
            const input = '<% my_proc = proc { |x| puts x } %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('proc { |x| puts x }');
        });

        it('should handle regex patterns', () => {
            const input = '<% pattern = /\\A[a-z]+\\z/i %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('/\\A[a-z]+\\z/i');
        });
    });

    describe('HTML edge cases', () => {
        it('should handle self-closing XML tags', () => {
            const input = '<input type="text" name="username" />';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('/>');
        });

        it('should handle HTML5 data attributes', () => {
            const input = '<div data-user-id="<%= user.id %>" data-role="<%= user.role %>">Content</div>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('data-user-id');
            expect(result).to.include('data-role');
        });

        it('should handle custom elements', () => {
            const input = '<custom-component prop="<%= value %>">Content</custom-component>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('custom-component');
        });
    });

    describe('Rails-specific edge cases', () => {
        it('should handle Rails form helpers with blocks', () => {
            const input = `<%= form_with model: @user do |f| %>
  <%= f.text_field :name %>
<% end %>`;
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('form_with model: @user do |f|');
        });

        it('should handle Rails link helpers with complex options', () => {
            const input = '<%= link_to "Delete", user_path(@user), method: :delete, confirm: "Are you sure?", class: "btn btn-danger" %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('method: :delete');
        });

        it('should handle Rails render calls', () => {
            const input = '<%= render partial: "shared/header", locals: { title: @page_title } %>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('render partial:');
        });
    });

    describe('Parser edge cases', () => {
        it('should handle empty ERB tags', () => {
            const input = '<% %>';
            const tokens = parser.parse(input);
            expect(tokens).to.have.length(1);
        });

        it('should handle ERB tags with only whitespace', () => {
            const input = '<%   %>';
            const tokens = parser.parse(input);
            expect(tokens).to.have.length(1);
        });

        it('should handle multiple ERB tags without spaces', () => {
            const input = '<%=a%><%=b%><%=c%>';
            const tokens = parser.parse(input);
            expect(tokens).to.have.length(3);
        });
    });

    describe('Configuration edge cases', () => {
        it('should handle zero tab size', () => {
            mockOptions.tabSize = 0;
            const input = '<div>\n<p>Content</p>\n</div>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.be.a('string');
        });

        it('should handle very large tab size', () => {
            mockOptions.tabSize = 100;
            const input = '<div>\n<p>Content</p>\n</div>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.be.a('string');
        });
    });
});
