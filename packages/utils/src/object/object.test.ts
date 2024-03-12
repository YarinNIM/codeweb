import { extract, removeFields } from '../object';

const person: Record<string, any> = {
  name: 'Dara',
  age: 12,
  gender: 'male',
  uuid: 1234567890,
};

describe('Object', () => {
  it('Extract an object into new object', () => {
    const newObject = extract(['name', 'age'], person);
    expect(newObject).toEqual({
      name: person.name,
      age: person.age,
    });
  });

  it('Removes some fields', () => {
    const newObj = removeFields(['name', 'age', 'uuid'], person);
    expect(newObj).toEqual({
      gender: person.gender,
    });
  });
});
