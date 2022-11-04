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
};

export const articleServerCodec = t.union(
  [
    t.literal('biorxiv'),
    t.literal('medrxiv'),
    t.literal('researchsquare'),
    t.literal('scielopreprints'),
  ],
);

export type ArticleServer = 'biorxiv'
| 'medrxiv'
| 'researchsquare'
| 'scielopreprints';
