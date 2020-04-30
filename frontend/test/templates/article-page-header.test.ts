import Doi from '../../src/data/doi';
import templateArticlePageHeader from '../../src/templates/article-page-header';

describe('article page header template', (): void => {
  const article = {
    title: 'Something interesting',
    type: 'Thing',
    doi: new Doi('10.1101/2000.1234'),
    publicationDate: new Date('2009-11-28'),
    abstract: 'Anything',
    authors: ['Gary', 'Uncle Wiggly'],
  };
  let actual: string;

  beforeEach(() => {
    actual = templateArticlePageHeader(article);
  });

  it('renders inside an header tag', () => {
    expect(actual).toEqual(expect.stringMatching(/^<header\s/));
  });

  it('renders the article type', () => {
    expect(actual).toEqual(expect.stringContaining(article.type));
  });

  it('renders the article DOI', () => {
    expect(actual).toEqual(expect.stringContaining(article.doi.value));
  });

  it('renders the article publication date', () => {
    expect(actual).toEqual(expect.stringContaining('2009-11-28'));
  });

  it('renders the article authors', () => {
    article.authors.forEach((author) => {
      expect(actual).toEqual(expect.stringContaining(author));
    });
  });
});
