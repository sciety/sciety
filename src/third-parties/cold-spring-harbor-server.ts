import { ArticleServer } from '../types/article-server.js';

export type ColdSpringHarborServer = 'biorxiv' | 'medrxiv';

export const isColdSpringHarborServer = (server: ArticleServer): server is ColdSpringHarborServer => server === 'biorxiv' || server === 'medrxiv';
