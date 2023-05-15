import * as t from 'io-ts';
import { Doi } from './doi';

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
};

export const articleServerCodec = t.union(
  [
    t.literal('biorxiv'),
    t.literal('medrxiv'),
    t.literal('researchsquare'),
    t.literal('scielopreprints'),
    t.literal('osf'),
  ],
);

export type ArticleServer = 'biorxiv'
| 'medrxiv'
| 'researchsquare'
| 'scielopreprints'
| 'osf';

export const isSupportedArticle = (articleId: Doi): boolean => (
  !!articleId.value.match(/^10\.1101\/[0-9]{1,}/)
  || articleId.hasPrefix('10.21203')
  || articleId.value.startsWith('10.1590/SciELOPreprints')
);
