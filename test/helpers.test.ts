import * as t from './helpers';

describe('arbitraryWord', () => {
  it('has the correct length', () => {
    expect(t.arbitraryWord(8)).toHaveLength(8);
  });

  it('is different each time', () => {
    expect(t.arbitraryWord(8)).not.toStrictEqual(t.arbitraryWord(8));
  });

  it('always begins with a letter', () => {
    expect(t.arbitraryWord(8)).toMatch(/^[a-zA-Z]/);
  });
});

describe('arbitraryString', () => {
  it('is different each time', () => {
    expect(t.arbitraryString()).not.toStrictEqual(t.arbitraryString());
  });
});
