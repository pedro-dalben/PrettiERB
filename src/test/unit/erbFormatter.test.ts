import { expect } from 'chai';
import { ErbFormatter } from '../../formatter/erbFormatter';
import * as vscode from 'vscode';

describe('ErbFormatter', () => {
    let formatter: ErbFormatter;
    let mockOptions: vscode.FormattingOptions;

    beforeEach(() => {
        formatter = new ErbFormatter();
        mockOptions = {
            tabSize: 2,
            insertSpaces: true
        };
    });

    describe('Basic formatting', () => {
        it('should format simple ERB output', () => {
            const input = '<%=user.name%>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.equal('<%= user.name %>\n');
        });

        it('should format ERB code blocks', () => {
            const input = '<%if user.present?%>\n<p>Hello</p>\n<%end%>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('<% if user.present? %>');
            expect(result).to.include('<% end %>');
        });

        it('should format HTML with proper indentation', () => {
            const input = '<div>\n<p>Hello</p>\n</div>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('  <p>Hello</p>');
        });
    });

    describe('Complex ERB formatting', () => {
        it('should format nested ERB blocks', () => {
            const input = `<% if user.present? %>
<% user.posts.each do |post| %>
<%= post.title %>
<% end %>
<% end %>`;

            const result = formatter.format(input, mockOptions);
            const lines = result.split('\n');

            // Check indentation levels
            expect(lines[1]).to.match(/^\s{2}<% user\.posts\.each/);
            expect(lines[2]).to.match(/^\s{4}<%= post\.title/);
        });

        it('should format mixed HTML and ERB', () => {
            const input = `<div class="container">
<% if @posts.any? %>
<h1>Posts</h1>
<% @posts.each do |post| %>
<article>
<h2><%= post.title %></h2>
<p><%= post.content %></p>
</article>
<% end %>
<% else %>
<p>No posts found</p>
<% end %>
</div>`;

            const result = formatter.format(input, mockOptions);
            expect(result).to.include('  <% if @posts.any? %>');
            expect(result).to.include('    <h1>Posts</h1>');
            expect(result).to.include('        <h2><%= post.title %></h2>');
        });
    });

    describe('ERB comments', () => {
        it('should format ERB comments', () => {
            const input = '<%#This is a comment%>';
            const result = formatter.format(input, mockOptions);
            expect(result).to.equal('<%# This is a comment %>\n');
        });

        it('should preserve comment indentation', () => {
            const input = `<div>
<%# Comment inside div %>
<p>Content</p>
</div>`;

            const result = formatter.format(input, mockOptions);
            expect(result).to.include('  <%# Comment inside div %>');
        });
    });

    describe('Whitespace handling', () => {
        it('should preserve blank lines when configured', () => {
            const input = `<div>

<p>Content</p>

</div>`;

            const result = formatter.format(input, mockOptions);
            const lines = result.split('\n');
            expect(lines.filter(line => line.trim() === '')).to.have.length.greaterThan(0);
        });

        it('should handle multiple consecutive blank lines', () => {
            const input = `<div>



<p>Content</p>
</div>`;

            const result = formatter.format(input, mockOptions);
            // Should reduce multiple blank lines but preserve some
            expect(result).to.include('\n\n');
        });
    });

    describe('Tab vs spaces configuration', () => {
        it('should use tabs when configured', () => {
            mockOptions.insertSpaces = false;

            const input = `<div>
<p>Content</p>
</div>`;

            const result = formatter.format(input, mockOptions);
            expect(result).to.include('\t<p>Content</p>');
        });

        it('should respect custom tab size', () => {
            mockOptions.tabSize = 4;

            const input = `<div>
<p>Content</p>
</div>`;

            const result = formatter.format(input, mockOptions);
            expect(result).to.include('    <p>Content</p>');
        });
    });

    describe('Error handling', () => {
        it('should handle malformed ERB gracefully', () => {
            const input = '<% if incomplete';
            const result = formatter.format(input, mockOptions);
            expect(result).to.be.a('string');
        });

        it('should return original text on parsing errors', () => {
            const input = 'Some invalid <%= erb %> content <% that breaks';
            const result = formatter.format(input, mockOptions);
            expect(result).to.include('Some invalid');
        });
    });

    describe('Real-world examples', () => {
        it('should format Rails view templates', () => {
            const input = `<%= content_for :title, "User Profile" %>
<div class="profile-container">
<% if current_user == @user %>
<%= link_to "Edit Profile", edit_user_path(@user), class: "btn btn-primary" %>
<% end %>
<h1><%= @user.full_name %></h1>
<% if @user.posts.any? %>
<div class="posts">
<% @user.posts.each do |post| %>
<%= render "posts/post", post: post %>
<% end %>
</div>
<% else %>
<p class="no-posts">No posts yet.</p>
<% end %>
</div>`;

            const result = formatter.format(input, mockOptions);

            // Verify proper indentation and formatting
            expect(result).to.include('<%= content_for :title, "User Profile" %>');
            expect(result).to.include('  <% if current_user == @user %>');
            expect(result).to.include('    <%= link_to "Edit Profile", edit_user_path(@user), class: "btn btn-primary" %>');
        });

        it('should format form helpers correctly', () => {
            const input = `<%= form_with model: @user, local: true do |form| %>
<div class="field">
<%= form.label :name %>
<%= form.text_field :name, class: "form-control" %>
</div>
<div class="field">
<%= form.label :email %>
<%= form.email_field :email, class: "form-control" %>
</div>
<%= form.submit "Save", class: "btn btn-primary" %>
<% end %>`;

            const result = formatter.format(input, mockOptions);

            expect(result).to.include('<%= form_with model: @user, local: true do |form| %>');
            expect(result).to.include('  <div class="field">');
            expect(result).to.include('    <%= form.label :name %>');
        });
    });
});
