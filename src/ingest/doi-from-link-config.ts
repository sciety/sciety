import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Eq as stringEq } from 'fp-ts/string';

export const doiFromLinkConfig: DoiFromLinkConfig = {
  researchsquare: {
    startOfDoi: '10.21203/rs.3.rs-',
    regexToCaptureEndOfDoi: /rs-(.*)$/,
    prefix: '10.21203',
  },
  scielo: {
    startOfDoi: '10.1590/SciELOPreprints.',
    regexToCaptureEndOfDoi: /download\/(\d+)\//,
    prefix: '10.1590',
  },
  biorxiv: {
    startOfDoi: '10.1101/',
    regexToCaptureEndOfDoi: /.*\/((?:\d{4}\.\d{2}\.\d{2}\.)?\d+).*/,
    prefix: '10.1101',
  },
  medrxiv: {
    startOfDoi: '10.1101/',
    regexToCaptureEndOfDoi: /.*\/((?:\d{4}\.\d{2}\.\d{2}\.)?\d+).*/,
    prefix: '10.1101',
  },
  osf: {
    startOfDoi: '10.31219/',
    regexToCaptureEndOfDoi: /https:\/\/(.+)\//,
    prefix: '10.31219',
  },
  psyarxiv: {
    startOfDoi: '10.31234/osf.io/',
    regexToCaptureEndOfDoi: /https:\/\/psyarxiv.com\/(.+)/,
    prefix: '10.31234',
  },
  arxiv: {
    startOfDoi: '10.48550/arXiv.',
    regexToCaptureEndOfDoi: /https:\/\/arxiv.org\/abs\/(.+)/,
    prefix: '10.48550',
  },
};

export type ServerData = {
  startOfDoi: string,
  regexToCaptureEndOfDoi: RegExp,
  prefix: string,
};

export const isSupported = (server: string, allServerData: DoiFromLinkConfig): server is SupportedServerName => pipe(
  allServerData,
  Object.keys,
  RA.elem(stringEq)(server),
);

type SupportedServerName = 'researchsquare' | 'scielo' | 'biorxiv' | 'medrxiv' | 'osf' | 'psyarxiv' | 'arxiv';

export type DoiFromLinkConfig = Record<SupportedServerName, ServerData>;
