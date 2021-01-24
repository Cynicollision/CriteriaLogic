import { Expression } from './../expression';
import { NumericLiteralExpressionParser } from './numeric';

describe('The numeric expression parser successfully parses and evaluates', () => {

    it ('test case 1', () => {
        let input = [ 4 ];
        let exp = '1';

        let expression = testParser(exp, input);
        
        expect(expression.operands.length).toBe(1);
        expect(expression.operators.length).toBe(0);

        expect(expression.evaluate()).toBe(4);
    });
    
    it ('test case 2', () => {
        let input = [ 1, 5 ];
        let exp = '1 + 2';

        let expression = testParser(exp, input);
        
        expect(expression.operands.length).toBe(2);
        expect(expression.operators.length).toBe(1);

        expect(expression.evaluate()).toBe(6);
    });

    it ('test case 3', () => {
        let input = [ 420, 69 ];
        let exp = '1 * 2';

        let expression = testParser(exp, input);

        expect(expression.evaluate()).toBe(28980);
    });

    it ('test case 4', () => {
        let input = [ 2, 4, 1 ];
        let exp = '1 * (2 - 3)';

        let expression = testParser(exp, input);

        expect(expression.evaluate()).toBe(6);
    });

    it ('test case 5', () => {
        let input = [ 55, 11 ];
        let exp = '1 / 2';

        let expression = testParser(exp, input);

        expect(expression.evaluate()).toBe(5);
    });

    it ('test case 6', () => {
        let input = [ 3, 3 ];
        let exp = '1 ^ 2';

        let expression = testParser(exp, input);

        expect(expression.evaluate()).toBe(27);
    });

    function testParser(exp: string, data: any[]): Expression<number> {
        return new NumericLiteralExpressionParser().parse(exp, data);
    }
});
