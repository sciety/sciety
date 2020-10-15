import templateListItems from '../../src/shared-components/list-items';

describe('list-items template', (): void => {
  it.each([
    [[], ''],
    [['Alice'], '<li class="item">Alice</li>\n'],
    [['Alice', 'Bob'], '<li class="item">Alice</li>\n<li class="item">Bob</li>\n'],
  ])('returns <li> elements on %s', async (items: Array<string>, expected: string): Promise<void> => {
    const actual = templateListItems(items);

    expect(actual).toBe(expected);
  });
});
