import * as t from 'io-ts';

type ServerInfo = {
  name: string,
  avatarUrl: string,
  versionsSupported: boolean,
  domain: string,
};

export const articleServers: Record<ArticleServer, ServerInfo> = {
  biorxiv: {
    name: 'bioRxiv',
    avatarUrl: '/static/images/biorxiv.jpg',
    versionsSupported: true,
    domain: 'biorxiv.org',
  },
  medrxiv: {
    name: 'medRxiv',
    avatarUrl: '/static/images/medrxiv.jpg',
    versionsSupported: true,
    domain: 'medrxiv.org',
  },
  researchsquare: {
    name: 'Research Square',
    avatarUrl: '/static/images/researchsquare.png',
    versionsSupported: false,
    domain: 'www.researchsquare.com',
  },
  scielopreprints: {
    name: 'SciELO Preprints',
    avatarUrl: '/static/images/scielo.svg',
    versionsSupported: false,
    domain: 'preprints.scielo.org',
  },
  osf: {
    name: 'OSF Preprints',
    avatarUrl: '/static/images/osf.png',
    versionsSupported: false,
    domain: 'osf.io',
  },
  arxiv: {
    name: 'arXiv',
    avatarUrl: '/static/images/osf.png',
    versionsSupported: false,
    domain: 'arxiv.org',
  },
};

export const articleServerCodec = t.keyof(articleServers);

export type ArticleServer = 'biorxiv'
| 'medrxiv'
| 'researchsquare'
| 'scielopreprints'
| 'osf'
| 'arxiv';

export const isSupportedArticle = (articleId: string): boolean => (
  !!articleId.match(/^10\.1101\/[0-9]{1,}/)
  || articleId.startsWith('10.21203/')
  || articleId.startsWith('10.1590/SciELOPreprints')
);
