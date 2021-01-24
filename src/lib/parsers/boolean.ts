import { Operand, Operator } from './../expression';
import { ExpressionParser } from './../parser';

export abstract class LogicalOperand implements Operand<boolean> {
    protected abstract getValue(data?: any): boolean;

    evaluate(input?: any): boolean {
        return this.getValue(input);
    }
}

export class LogicalOperator implements Operator<boolean> {
    constructor(readonly value: string) { }

    apply(left: boolean, right: boolean): boolean {
        return this.value.toLowerCase() === 'and'
            ? left && right
            : left || right;
    }
}

class BooleanLiteral extends LogicalOperand {
    constructor(readonly value: boolean) {
        super();
    }

    getValue() {
        return this.value;
    }
}

export class BooleanLiteralExpressionParser extends ExpressionParser<boolean> {
    
    public buildOperand(token: string, input: any[]): BooleanLiteral {
        let value = input[parseInt(token) - 1];
        return new BooleanLiteral(value);
    }

    public buildOperator(token: string): LogicalOperator {
        return new LogicalOperator(token);
    }
        
    protected isOperand(input: string): boolean {
        return this.isNumber(input);
    }
    
    protected isOperator(input: string): boolean {
        return input === 'AND' || input === 'OR';
    }
}