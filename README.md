# CriteriaLogic

Library for building expressions to filter a structured data source using user-supplied logic for the criteria, in text format, such as: `1 AND (2 OR 3)`.

Clone the repo and run `npm test`.

### Usage 

```
let data = [
    //...
    {
        captain: {
            name: 'fox',
            planet: {
                name: 'corneria',
                galaxy: 'lylat',
            },
        },
        ship: {
            name: 'arwing',
            class: 'fighter',
        },
    },
    //...
];

let parser = new CriteriaExpressionParser();

let expression = parser.parse('1 AND 2', [
    new Criterion('captain', 'planet', 'name', 'EQ', 'corneria'),
    new Criterion('ship', 'name', null, 'EQ', 'arwing'),
]);

let matches = data.filter(s => expression.evaluate(s));

expect(matches.length).toBe(1); // assumes 'data' contains no duplicates.
```
### Notes
Operator precedence is not supported - criteria string must use parentheses to ensure subexpressions evaluate as desired.