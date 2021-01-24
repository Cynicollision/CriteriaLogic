import { CriteriaExpressionParser, Criterion, DataSource, } from './criteria';

// example domain-specific implementation of Criteria/DataSource
class TestSubjectSource implements DataSource { 

    constructor(private data: any) {
    }

    query(criterion: Criterion): boolean {
        let profileValue = this.getPropertyValue(this.data, criterion);
        return criterion.evaluate(profileValue);
    }

    private getPropertyValue(data: any, criterion: Criterion): string {
        let key = criterion.propertyKey;
        let subKey = criterion.propertySubKey;

        switch (criterion.propertyType) {
            case 'ship':
                return data.ship[key];
            case 'captain':
                return data.captain[key][subKey];
            default:
                throw 'Unsupported propertyType: ' + criterion.propertyType;
        }
    }
}

describe('The criteria evaluator filters data for', () => {
    let testData = buildTestData();
    let parser: CriteriaExpressionParser;
    let sources: TestSubjectSource[];

    beforeEach(() => {
        parser = new CriteriaExpressionParser();
        sources = testData.map(v => new TestSubjectSource(v));
    });
    
    it('test case 1 - single criterion', () => {

        let expression = parser.parse('1', [
            new Criterion('captain', 'planet', 'name', 'EQ', 'mars'),
        ]);

        let matches = sources.filter(s => expression.evaluate(s));

        expect(matches.length).toBe(2);
    });

    it('test case 2 - two criteria, OR', () => {

        let expression = parser.parse('1 OR 2', [
            new Criterion('captain', 'planet', 'name', 'EQ', 'mars'),
            new Criterion('ship', 'name', null, 'EQ', 'bell'),
        ]);

        let matches = sources.filter(s => expression.evaluate(s));

        expect(matches.length).toBe(6);
    });
});

function buildTestData() {
    return [
        {
            captain: {
                name: 'joe',
                age: '41',
                planet: {
                    name: 'mars',
                    galaxy: 'g1',
                },
            },
            ship: {
                name: 'boot',
                class: 's1',
            },
        },
        {
            captain: {
                name: 'beth',
                age: '33',
                planet: {
                    name: 'mars',
                    galaxy: 'g1',
                },
            },
            ship: {
                name: 'boot',
                class: 's1',
            },
        },
        {
            captain: {
                name: 'earl',
                age: '25',
                planet: {
                    name: 'earth',
                    galaxy: 'g1',
                },
            },
            ship: {
                name: 'boot',
                class: 's1',
            },
        },
        {
            captain: {
                name: 'fred',
                age: '82',
                planet: {
                    name: 'earth',
                    galaxy: 'g1',
                },
            },
            ship: {
                name: 'boot',
                class: 's1',
            },
        },
        {
            captain: {
                name: 'sam',
                age: '13',
                planet: {
                    name: 'venus',
                    galaxy: 'g1',
                },
            },
            ship: {
                name: 'boot',
                class: 's1',
            },
        },
        {
            captain: {
                name: 'lisa',
                age: '5',
                planet: {
                    name: 'venus',
                    galaxy: 'g1',
                },
            },
            ship: {
                name: 'boot',
                class: 's1',
            },
        },
        {
            captain: {
                name: 'greg',
                age: '51',
                planet: {
                    name: 'taff',
                    galaxy: 'g2',
                },
            },
            ship: {
                name: 'bell',
                class: 's1',
            },
        },
        {
            captain: {
                name: 'pat',
                age: '68',
                planet: {
                    name: 'taff',
                    galaxy: 'g2',
                },
            },
            ship: {
                name: 'bell',
                class: 's1',
            },
        },
        {
            captain: {
                name: 'tammy',
                age: '36',
                planet: {
                    name: 'del',
                    galaxy: 'g2',
                },
            },
            ship: {
                name: 'bell',
                class: 's1',
            },
        },
        {
            captain: {
                name: 'will',
                age: '60',
                planet: {
                    name: 'del',
                    galaxy: 'g2',
                },
            },
            ship: {
                name: 'bell',
                class: 's1',
            },
        },
    ];
}
