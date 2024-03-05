import * as t from 'io-ts';

export const articleServerCodec = t.union(
  [
    t.literal('biorxiv'),
    t.literal('medrxiv'),
    t.literal('researchsquare'),
    t.literal('scielopreprints'),
    t.literal('osf'),
    t.literal('accessmicrobiology'),
    t.literal('elife'),
  ],
);

export type ArticleServer = t.TypeOf<typeof articleServerCodec>;

type ServerInfo = {
  name: string,
  avatarUrl: string,
  domain: string,
};

export const articleServers: Record<ArticleServer, ServerInfo> = {
  biorxiv: {
    name: 'bioRxiv',
    avatarUrl: '/static/images/biorxiv.jpg',
    domain: 'biorxiv.org',
  },
  medrxiv: {
    name: 'medRxiv',
    avatarUrl: '/static/images/medrxiv.jpg',
    domain: 'medrxiv.org',
  },
  researchsquare: {
    name: 'Research Square',
    avatarUrl: '/static/images/researchsquare.png',
    domain: 'www.researchsquare.com',
  },
  scielopreprints: {
    name: 'SciELO Preprints',
    avatarUrl: '/static/images/scielo.svg',
    domain: 'preprints.scielo.org',
  },
  osf: {
    name: 'OSF Preprints',
    avatarUrl: '/static/images/osf.png',
    domain: 'osf.io',
  },
  accessmicrobiology: {
    name: 'Access Microbiology',
    avatarUrl: 'https://raw.githubusercontent.com/sciety/group-static-files/main/access-microbiology.png',
    domain: 'www.microbiologyresearch.org',
  },
  elife: {
    name: 'eLife',
    avatarUrl: '/static/images/elife.png',
    domain: 'elifesciences.org',
  },
};
