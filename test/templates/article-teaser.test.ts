import Doi from '../../src/data/doi';
import templateArticleTeaser from '../../src/templates/article-teaser';
import { ArticleTeaser } from '../../src/types/article-teaser';

describe('article-teaser template', (): void => {
  const articleTeaser: ArticleTeaser = {
    doi: new Doi('10.5555/12345678'),
    title: 'The study of cracked pots',
    authors: ['John Doe'],
    numberOfReviews: 2,
  };
  let actual: string;

  beforeEach(() => {
    actual = templateArticleTeaser(articleTeaser);
  });

  it('renders inside an article tag', async (): Promise<void> => {
    expect(actual).toStrictEqual(expect.stringMatching(/^<article\s/));
  });

  it('renders the title as a link', () => {
    expect(actual).toStrictEqual(expect.stringContaining(`<a href="/articles/${articleTeaser.doi}">${articleTeaser.title}</a>`));
  });

  it('renders the authors', () => {
    expect(actual).toStrictEqual(expect.stringContaining(articleTeaser.authors[0]));
  });

  it('renders the number of reviews', () => {
    expect(actual).toStrictEqual(expect.stringContaining(`${articleTeaser.numberOfReviews} reviews`));
  });
});
