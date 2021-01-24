import { OperandValue } from './lib/expression';
import { ExpressionParser } from './lib/parser';
import { LogicalOperand, LogicalOperator } from './lib/parsers/boolean';

export interface DataSource {
    query(criterion: Criterion): boolean;
}

class CriterionOperand extends LogicalOperand {
    constructor (readonly criterion: Criterion) { 
        super();
    }

    getValue(data: DataSource): boolean {
        return data.query(this.criterion);
    }
}

export class Criterion implements OperandValue<boolean> {

    constructor(readonly propertyType: string, readonly propertyKey: string, readonly propertySubKey: string, readonly operator: string, readonly propertyValue: string) {
    }

    evaluate(value: string): boolean {
        return this.operator === 'EQ' ? (value === this.propertyValue) : (value !== this.propertyValue);
    }
}

export class CriteriaExpressionParser extends ExpressionParser<boolean> {
    
    protected buildOperand(token: string, input: any[]): CriterionOperand {
        let cfg = input[parseInt(token) - 1];
        let criterion = new Criterion(cfg.propertyType, cfg.propertyKey, cfg.propertySubKey, cfg.operator, cfg.propertyValue);
        return new CriterionOperand(criterion);
    }

    protected buildOperator(token: string): LogicalOperator {
        return new LogicalOperator(token);
    }

    protected isOperand(input: string): boolean {
        return this.isNumber(input);
    }
    
    protected isOperator(input: string): boolean {
        return input === 'AND' || input === 'OR';
    }
}
