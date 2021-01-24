import { Expression, Operand, Operator, SubExpressionOperand } from './expression';

export abstract class ExpressionParser<T> {
    protected abstract buildOperand(token: string, values?: any[]): Operand<T>;
    protected abstract buildOperator(token: string): Operator<T>;
    protected abstract isOperand(input: string): boolean;
    protected abstract isOperator(input: string): boolean;

    public parse(logicString: string, data: any[]): Expression<T> {
        let toParse = logicString.replace(/\s/g, '');
        let expression = this.initExpression(toParse);

        if (expression.hasErrors) {
            return expression;
        }
    
        try {
            while (toParse.length > 0) {
                let token = this.getFirstToken(toParse);
            
                if (this.isOperand(token)) {
                    expression.addOperand(this.buildOperand(token, data));
                    toParse = this.removeFirstToken(toParse);
                }
                else if (this.isOperator(token)) {
                    expression.addOperator(this.buildOperator(token));
                    toParse = this.removeFirstToken(toParse);
                }
                else if (this.isSubExpressionStart(token)) {
                    let subExpLogicString = this.getFirstSubExpression(toParse);
                    let subExpression = this.parse(subExpLogicString, data);
                    
                    if (!subExpression.hasErrors) {
                        expression.addOperand(new SubExpressionOperand(subExpression));
                        toParse = this.removeFirstSubExpression(toParse);
                    }
                    else {
                        expression.setError(`Error in subexpression: ${subExpression.errorMessage}`);
                        break;
                    }
                }
                else {
                    expression.setError(`Unknown token: ${token}`);
                    break;
                }
            }
        }
        catch (e) {
            expression.setError(`Unexpected error: ${e}`);
        }
    
        return expression;
    }

    private initExpression(logicString: string): Expression<T> {
        let expression = new Expression<T>();
        let open = 0;
        
        for (let i = 0; i < logicString.length; i++) {
            let c = logicString.charAt(i);
            
            if (open < 0) {
                expression.setError('Unexpected ")" at position ' + i);
                break;
            }
            
            if (c === '(') {
                open++;
            }
            else if (c === ')') {
                open--;
            }
        }
        
        if (open > 0) {
            expression.setError('Expected ")" at position ' + logicString.length);
        }
        else if (open < 0) {
            expression.setError('Unexpected ")" at position ' + logicString.length);
        }
    
        return expression;
    }
    
    // returns the first operand or operator token (e.g. 1, AND, +)
    private getFirstToken(input: string): string {
        if (input.length === 0) {
            return '';
        }
        
        let token = input[0];
        let i = 1;

        while (i < input.length && this.getTokenType(token) === this.getTokenType(input[i])) {
            token += input[i];
            i++;
        }
    
        return token;
    }
    
    private removeFirstToken(input: string): string {
        let token = this.getFirstToken(input);
        return input.slice(token.length);
    }

    // assumes input starts with '(' and ends with ')'.
    private getFirstSubExpression(input: string): string {
        let subExp = '';
        let open = 0;
    
        for (let i = 1; i < input.length; i++) {
            if (input[i] === '(') {
                subExp += input[i];
                open++;
            }
            else if (input[i] === ')') {
                if (open === 0) {
                    break;
                }
                subExp += input[i];
                open--;
            }
            else {
                subExp += input[i];
            }
        }
    
        return subExp;
    }

    private removeFirstSubExpression(input: string): string {
        let token = this.getFirstSubExpression(input);
        return input.slice(token.length + 2); // length + 2 to remove outer parens
    }

    private getTokenType(c: string): string {
        if (c === '(' || c === ')') {
            return 'GROUP';
        }
        else if (this.isNumber(c)) {
            return 'OPERAND';
        }
        return 'OPERATOR';
    }

    protected isNumber(c: string): boolean {
        return c >= '0' && c <= '9';
    }
    
    private isSubExpressionStart(input: string): boolean {
        return input[0] === '(';
    }
}