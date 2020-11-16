import templateListItems from '../../src/shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../../src/types/html-fragment';

describe('list-items template', (): void => {
  it.each([
    [[], toHtmlFragment('')],
    [['Alice'], toHtmlFragment('<li class="item">Alice</li>\n')],
    [['Alice', 'Bob'], toHtmlFragment('<li class="item">Alice</li>\n<li class="item">Bob</li>\n')],
  ])('returns <li> elements on %s', async (items: Array<string>, expected: HtmlFragment): Promise<void> => {
    const actual = templateListItems(items);

    expect(actual).toBe(expected);
  });
});
