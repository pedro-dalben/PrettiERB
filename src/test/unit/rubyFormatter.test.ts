import { expect } from 'chai';
import { RubyFormatter } from '../../formatter/rubyFormatter';
import { FormattingOptions } from '../../formatter/erbFormatter';

describe('RubyFormatter', () => {
    let formatter: RubyFormatter;
    let options: FormattingOptions;

    beforeEach(() => {
        formatter = new RubyFormatter();
        options = {
            indentSize: 2,
            useTabs: false,
            preserveBlankLines: true
        };
    });

    describe('Operator spacing', () => {
        it('should add spaces around assignment operators', () => {
            const input = 'x=5';
            const result = formatter.format(input, options);
            expect(result).to.equal('x = 5');
        });

        it('should add spaces around comparison operators', () => {
            const input = 'x==5';
            const result = formatter.format(input, options);
            expect(result).to.equal('x == 5');
        });

        it('should add spaces around arithmetic operators', () => {
            const input = 'x+y*z';
            const result = formatter.format(input, options);
            expect(result).to.equal('x + y * z');
        });

        it('should handle compound assignment operators', () => {
            const input = 'x+=5';
            const result = formatter.format(input, options);
            expect(result).to.equal('x += 5');
        });

        it('should handle logical operators', () => {
            const input = 'x&&y||z';
            const result = formatter.format(input, options);
            expect(result).to.equal('x && y || z');
        });
    });

    describe('Bracket and parentheses spacing', () => {
        it('should remove spaces inside parentheses', () => {
            const input = '( x + y )';
            const result = formatter.format(input, options);
            expect(result).to.equal('(x + y)');
        });

        it('should remove spaces inside square brackets', () => {
            const input = '[ 1, 2, 3 ]';
            const result = formatter.format(input, options);
            expect(result).to.equal('[1, 2, 3]');
        });

        it('should format hash brackets correctly', () => {
            const input = '{x:1,y:2}';
            const result = formatter.format(input, options);
            expect(result).to.equal('{ x: 1, y: 2 }');
        });
    });

    describe('Comma spacing', () => {
        it('should add space after commas', () => {
            const input = 'method(a,b,c)';
            const result = formatter.format(input, options);
            expect(result).to.equal('method(a, b, c)');
        });

        it('should remove space before commas', () => {
            const input = 'method(a , b , c)';
            const result = formatter.format(input, options);
            expect(result).to.equal('method(a, b, c)');
        });
    });

    describe('Hash formatting', () => {
        it('should format hash rockets correctly', () => {
            const input = '{:key=>value}';
            const result = formatter.format(input, options);
            expect(result).to.equal('{ :key => value }');
        });

        it('should format new hash syntax correctly', () => {
            const input = '{key:value}';
            const result = formatter.format(input, options);
            expect(result).to.equal('{ key: value }');
        });

        it('should handle mixed hash syntax', () => {
            const input = '{key:value,:old=>style}';
            const result = formatter.format(input, options);
            expect(result).to.equal('{ key: value, :old => style }');
        });
    });

    describe('Method calls and chains', () => {
        it('should format method chains', () => {
            const input = 'user.posts.published.recent';
            const result = formatter.format(input, options);
            expect(result).to.equal('user.posts.published.recent');
        });

        it('should format method calls with arguments', () => {
            const input = 'method(arg1,arg2)';
            const result = formatter.format(input, options);
            expect(result).to.equal('method(arg1, arg2)');
        });
    });

    describe('String and symbol formatting', () => {
        it('should preserve string content', () => {
            const input = '"Hello,  World!"';
            const result = formatter.format(input, options);
            expect(result).to.equal('"Hello,  World!"');
        });

        it('should format symbols correctly', () => {
            const input = ':symbol_name';
            const result = formatter.format(input, options);
            expect(result).to.equal(':symbol_name');
        });
    });

    describe('Complex expressions', () => {
        it('should format complex conditional expressions', () => {
            const input = 'user.present?&&user.active?||admin?';
            const result = formatter.format(input, options);
            expect(result).to.equal('user.present? && user.active? || admin?');
        });

        it('should format array and hash literals', () => {
            const input = '[{name:"John",age:30},{name:"Jane",age:25}]';
            const result = formatter.format(input, options);
            expect(result).to.equal('[{ name: "John", age: 30 }, { name: "Jane", age: 25 }]');
        });
    });

    describe('Edge cases', () => {
        it('should handle empty input', () => {
            const input = '';
            const result = formatter.format(input, options);
            expect(result).to.equal('');
        });

        it('should handle whitespace-only input', () => {
            const input = '   ';
            const result = formatter.format(input, options);
            expect(result).to.equal('');
        });

        it('should preserve necessary spaces in strings', () => {
            const input = '"This  has   multiple    spaces"';
            const result = formatter.format(input, options);
            expect(result).to.equal('"This  has   multiple    spaces"');
        });
    });
});
