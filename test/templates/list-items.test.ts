import templateListItems from '../../src/templates/list-items';

describe('list-items template', (): void => {
  it.each([
    [[], ''],
    [['Alice'], '<li>Alice</li>\n'],
    [['Alice', 'Bob'], '<li>Alice</li>\n<li>Bob</li>\n'],
  ])('returns <li> elements on %s', async (items: Array<string>, expected: string): Promise<void> => {
    const actual = templateListItems(items);

    expect(actual).toBe(expected);
  });
});
