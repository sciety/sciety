import { templateDate } from '../../src/shared-components/date';
import { toHtmlFragment } from '../../src/types/html-fragment';

describe('date template', () => {
  it.each([
    ['2000-01-02', 'Jan 2, 2000'],
    ['2001-02-03', 'Feb 3, 2001'],
  ])('returns a time element on %s', async (string: string, display: string) => {
    const actual = templateDate(new Date(string));

    expect(actual).toBe(toHtmlFragment(`<time datetime="${string}">${display}</time>`));
  });

  it('adds a class', () => {
    const actual = templateDate(new Date('2002-05-04'), 'a-class-name');

    expect(actual).toBe(toHtmlFragment('<time datetime="2002-05-04" class="a-class-name">May 4, 2002</time>'));
  });
});
