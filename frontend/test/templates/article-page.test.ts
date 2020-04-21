import templateArticlePage from '../../src/templates/article-page';

describe('article template', (): void => {
  const article = {
    title: 'Something interesting',
    category: 'Shoe trees',
    type: 'Thing',
    doi: 'http://doi.org/1234',
    publicationDate: new Date('2009-11-28'),
    authors: [],
  };
  let actual: string;

  beforeEach(() => {
    actual = templateArticlePage(article);
  });

  it('renders inside an article tag', () => {
    expect(actual).toEqual(expect.stringMatching(/^<article>/));
  });

  it('renders the article category', () => {
    expect(actual).toEqual(expect.stringContaining(article.category));
  });

  it('renders the article type', () => {
    expect(actual).toEqual(expect.stringContaining(article.type));
  });
});
