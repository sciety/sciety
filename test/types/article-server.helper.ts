import { ArticleServer } from '../../src/types/article-server';

export const arbitraryArticleServer = (): ArticleServer => (
  Math.random() > 0.5
    ? 'biorxiv' as const
    : 'medrxiv' as const
);
