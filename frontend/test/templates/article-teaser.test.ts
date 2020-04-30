import templateArticleTeaser from '../../src/templates/article-teaser';
import { ArticleTeaser } from '../../src/types/article-teaser';

describe('article-teaser template', (): void => {
  const articleTeaser: ArticleTeaser = {
    title: 'The study of cracked pots',
    authors: ['John Doe'],
    numberOfReviews: 2,
    link: '/articles/10.5555%2F12345678',
  };
  let actual: string;

  beforeEach(() => {
    actual = templateArticleTeaser(articleTeaser);
  });

  it('renders inside an article tag', async (): Promise<void> => {
    expect(actual).toEqual(expect.stringMatching(/^<article\s/));
  });

  it('renders the title as a link', () => {
    expect(actual).toEqual(expect.stringContaining(`<a href="${articleTeaser.link}">${articleTeaser.title}</a>`));
  });

  it('renders the authors', () => {
    expect(actual).toEqual(expect.stringContaining(articleTeaser.authors[0]));
  });

  it('renders the number of reviews', () => {
    expect(actual).toEqual(expect.stringContaining(`${articleTeaser.numberOfReviews} reviews`));
  });
});
