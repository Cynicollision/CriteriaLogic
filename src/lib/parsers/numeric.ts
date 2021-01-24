import { Operand, Operator } from './../expression';
import { ExpressionParser } from './../parser';

class ArithmeticOperator implements Operator<number> {
    constructor(readonly value: string) { }
    
    apply(left: number, right: number): number {
        switch (this.value) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
            case '^':
                return left ** right;
            default:
                throw `Unexpected arithmetic operator ${this.value}`;
        }
    }
}

class NumericOperand implements Operand<number> {
    readonly innerValue: number;
    constructor(value: number) {
        this.innerValue = new Number(value).valueOf();
    }

    evaluate() {
        return this.innerValue;
    }
}

export class NumericLiteralExpressionParser extends ExpressionParser<number> {
    
    public buildOperand(token: string, input: any[]): NumericOperand {
        let value = input[parseInt(token) - 1];
        return new NumericOperand(value);
    }

    public buildOperator(token: string): ArithmeticOperator {
        return new ArithmeticOperator(token);
    }

    protected isOperand(input: string): boolean {
        return this.isNumber(input);
    }
    
    protected isOperator(input: string): boolean {
        return ['+','-','*','/','^'].indexOf(input) !== -1;
    }
}