import { ArticleServer } from '../../types/article-server';

export type SupportedArticleServer = 'biorxiv' | 'medrxiv';

export const isSupportedArticleServer = (server: ArticleServer): server is SupportedArticleServer => server === 'biorxiv' || server === 'medrxiv';
