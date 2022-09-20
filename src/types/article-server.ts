type ServerInfo = {
  name: string,
  avatarUrl: string,
  versionsSupported: boolean,
};

export const articleServers: Record<ArticleServer, ServerInfo> = {
  biorxiv: {
    name: 'bioRxiv',
    avatarUrl: '/static/images/biorxiv.jpg',
    versionsSupported: true,
  },
  medrxiv: {
    name: 'medRxiv',
    avatarUrl: '/static/images/medrxiv.jpg',
    versionsSupported: true,
  },
  researchsquare: {
    name: 'Research Square',
    avatarUrl: '/static/images/researchsquare.png',
    versionsSupported: false,
  },
  scielopreprints: {
    name: 'SciELO Preprints',
    avatarUrl: '/static/images/scielo.svg',
    versionsSupported: false,
  },
};

export type ArticleServer = 'biorxiv'
| 'medrxiv'
| 'researchsquare'
| 'scielopreprints';
