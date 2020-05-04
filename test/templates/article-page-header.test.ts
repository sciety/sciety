import Doi from '../../src/data/doi';
import templateArticlePageHeader from '../../src/templates/article-page-header';

describe('article page header template', (): void => {
  const article = {
    title: 'Something interesting',
    doi: new Doi('10.1101/2000.1234'),
    publicationDate: new Date('2009-11-28'),
    abstract: 'Anything',
    authors: ['Gary', 'Uncle Wiggly'],
  };

  it('renders inside an header tag', () => {
    const actual = templateArticlePageHeader(article);

    expect(actual).toStrictEqual(expect.stringMatching(/^<header\s/));
  });

  it('renders the article DOI', () => {
    const actual = templateArticlePageHeader(article);

    expect(actual).toStrictEqual(expect.stringContaining(article.doi.value));
  });

  it('renders the article publication date', () => {
    const actual = templateArticlePageHeader(article);

    expect(actual).toStrictEqual(expect.stringContaining('2009-11-28'));
  });

  it('renders the article authors', () => {
    const actual = templateArticlePageHeader(article);

    article.authors.forEach((author) => {
      expect(actual).toStrictEqual(expect.stringContaining(author));
    });
  });
});
