export interface Operand<T> {
    evaluate(input?: any): T;
}

export interface OperandValue<T> {
    evaluate(otherValue?: any): T;
}

export class SubExpressionOperand<T> implements Operand<T> {
    constructor (readonly value: Expression<T>){ 
    }

    evaluate(input?: any): T {
        return this.value.evaluate(input);
    }
}

export interface Operator<T> {
    apply(left: T, right: T): T;
}

export class Expression<T> {
    private errorMsg: string = '';
    public operands: Operand<T>[] = [];
    public operators: Operator<T>[] = [];

    public get errorMessage(): string {
        return this.errorMsg;
    }

    public get hasErrors(): boolean {
        return this.errorMsg !== '';
    }

    evaluate(data?: any): T {
        let operands = [...this.operands];
        let operators = [...this.operators];

        let left = operands.shift();
        let returnValue = left.evaluate(data);

        while (operands.length > 0) {
            let right = operands.shift();
            let rightResult = right.evaluate(data);

            let operator = operators.shift();
            returnValue = operator.apply(returnValue, rightResult);
        }
    
        return returnValue;
    }

    addOperand(operand: Operand<T>): void {
        this.operands.push(operand);
    }

    addOperator(operator: Operator<T>): void {
        this.operators.push(operator);
    }

    setError(errorMsg): void {
        this.errorMsg = errorMsg;
    }
}
