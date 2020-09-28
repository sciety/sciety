import templateDate from '../../src/templates/date';

describe('date template', (): void => {
  it.each([
    ['2000-01-02', 'Jan 2, 2000'],
    ['2001-02-03', 'Feb 3, 2001'],
  ])('returns a time element on %s', async (string: string, display: string): Promise<void> => {
    const actual = templateDate(new Date(string));

    expect(actual).toBe(`<time datetime="${string}">${display}</time>`);
  });

  it('adds a class', () => {
    const actual = templateDate(new Date('2002-05-04'), 'a-class-name');

    expect(actual).toBe('<time datetime="2002-05-04" class="a-class-name">May 4, 2002</time>');
  });
});
