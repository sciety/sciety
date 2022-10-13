type ServerInfo = {
  name: string,
  avatarUrl: string,
  versionsSupported: boolean,
  domain: string,
};

type ExtendedServerInfo = {
  id: ArticleServer,
  name: string,
  avatarUrl: string,
  versionsSupported: boolean,
  domain: string,
};

export const articleServersArray: ReadonlyArray<ExtendedServerInfo> = [
  {
    id: 'biorxiv',
    name: 'bioRxiv',
    avatarUrl: '/static/images/biorxiv.jpg',
    versionsSupported: true,
    domain: 'biorxiv.org',
  },
  {
    id: 'medrxiv',
    name: 'medRxiv',
    avatarUrl: '/static/images/medrxiv.jpg',
    versionsSupported: true,
    domain: 'medrxiv.org',
  },
  {
    id: 'researchsquare',
    name: 'Research Square',
    avatarUrl: '/static/images/researchsquare.png',
    versionsSupported: false,
    domain: 'www.researchsquare.com',
  },
  {
    id: 'scielopreprints',
    name: 'SciELO Preprints',
    avatarUrl: '/static/images/scielo.svg',
    versionsSupported: false,
    domain: 'preprints.scielo.org',
  },
];

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

export type ArticleServer = 'biorxiv'
| 'medrxiv'
| 'researchsquare'
| 'scielopreprints';
