import { Expression } from './../expression';
import { BooleanLiteralExpressionParser } from './boolean';

describe('The boolean expression parser', () => {

    describe('successfully parses and evaluates', () => {

        it('test case 1', () => {
            let input = [ true ];
            let exp = '1';

            let expression = testParser(exp, input);
            expect(expression.operands.length).toBe(1);
            expect(expression.operators.length).toBe(0);
            expect(expression.evaluate()).toBe(true);
        });
        
        it ('test case 2', () => {
            let input = [ true, true ];
            let exp = '1 AND 2';

            let expression = testParser(exp, input);
            expect(expression.operands.length).toBe(2);
            expect(expression.operators.length).toBe(1);
            expect(expression.evaluate()).toBe(true);
        });

        it ('test case 3', () => {
            let input = [ true, false ];
            let exp = '1 AND 2';

            let expression = testParser(exp, input);
            expect(expression.evaluate()).toBe(false);
        });

        it ('test case 4', () => {
            let input = [ false, true ];
            let exp = '1 OR 2';

            let expression = testParser(exp, input);
            expect(expression.evaluate()).toBe(true);
        });

        it ('test case 5', () => {
            let input = [ false, false ];
            let exp = '1 OR 2';

            let expression = testParser(exp, input);
            expect(expression.evaluate()).toBe(false);
        });

        it ('test case 6', () => {
            let input = [ false, true, true ];
            let exp = '1 OR (2 AND 3)';

            let expression = testParser(exp, input);
            expect(expression.operands.length).toBe(2);
            expect(expression.operators.length).toBe(1);
            expect(expression.evaluate()).toBe(true);
        });

        it ('test case 7', () => {
            let input = [ true, true, false ];
            let exp = '(1 AND 2) OR 3';

            let expression = testParser(exp, input);
            expect(expression.operands.length).toBe(2);
            expect(expression.operators.length).toBe(1);
            expect(expression.evaluate()).toBe(true);
        });

        it ('test case 8', () => {
            let input = [ false, true, true, true ];
            let exp = '(1 AND 2) OR (3 OR 4)';

            let expression = testParser(exp, input);
            expect(expression.operands.length).toBe(2);
            expect(expression.operators.length).toBe(1);
            expect(expression.evaluate()).toBe(true);
        });
    });

    describe('detects syntax errors', () => {

        it ('test case 1', () => {
            let exp = '1)';
            let expression = testParser(exp, null);

            expect(expression.errorMessage).toBe('Unexpected ")" at position 2');
        });
        
        it ('test case 2', () => {
            let exp = '1 AND (2';
            let expression = testParser(exp, null);

            expect(expression.errorMessage).toBe('Expected ")" at position 6');
        });
    });

    function testParser(exp: string, data: any[]): Expression<boolean> {
        return new BooleanLiteralExpressionParser().parse(exp, data);
    }
});