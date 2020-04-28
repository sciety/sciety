import templateArticleTeaser from '../../src/templates/article-teaser';

describe('article-teaser template', (): void => {
  const article = {
    article: {
      category: 'Psychoceramics',
      type: 'New Results',
      doi: '10.1101/2000.1234',
      title: 'The study of cracked pots',
      abstract: 'More lorem ipsum',
      authors: ['John Doe'],
      publicationDate: new Date('2000-01-15'),
    },
    reviews: [
      {
        publicationDate: new Date('2000-02-01'),
        author: 'Alice',
        summary: 'Lorem ipsum',
        doi: '1234',
      },
      {
        publicationDate: new Date('2000-03-04'),
        author: 'Bob',
        summary: 'Sit amet',
        doi: '1234',
      },
    ],
  };
  const articleLink = '/articles/10.5555%2F12345678';
  let actual: string;

  beforeEach(() => {
    actual = templateArticleTeaser(article, articleLink);
  });

  it('renders inside an article tag', async (): Promise<void> => {
    expect(actual).toEqual(expect.stringMatching(/^<article\s/));
  });

  it('renders the category', () => {
    expect(actual).toEqual(expect.stringContaining(article.article.category));
  });

  it('renders the title as a link', () => {
    expect(actual).toEqual(expect.stringContaining(`<a href="/articles/10.5555%2F12345678">${article.article.title}</a>`));
  });

  it('renders the authors', () => {
    expect(actual).toEqual(expect.stringContaining(article.article.authors[0]));
  });

  it('renders the number of reviews', () => {
    expect(actual).toEqual(expect.stringContaining('2 reviews'));
  });
});
