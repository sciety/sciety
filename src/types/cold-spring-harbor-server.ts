import { ArticleServer } from './article-server';

export type ColdSpringHarborServer = 'biorxiv' | 'medrxiv';

export const isColdSpringHarborServer = (server: ArticleServer): server is ColdSpringHarborServer => server === 'biorxiv' || server === 'medrxiv';
