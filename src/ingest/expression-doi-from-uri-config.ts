import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Eq as stringEq } from 'fp-ts/string';

export const expressionDoiFromUriConfig: ExpressionDoiFromUriConfig = {
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
  biorxivLegacy: {
    startOfDoi: '10.1101/',
    regexToCaptureEndOfDoi: /.*\/((?:\d{4}\.\d{2}\.\d{2}\.)?\d+).*/,
    prefix: '10.1101',
  },
  medrxiv: {
    startOfDoi: '10.1101/',
    regexToCaptureEndOfDoi: /.*\/((?:\d{4}\.\d{2}\.\d{2}\.)?\d+).*/,
    prefix: '10.1101',
  },
  // This is unsafe for osf shortlinks as they might resolve to a DOI with a prefix that is not 10.31219
  osf: {
    startOfDoi: '10.31219/osf.io/',
    regexToCaptureEndOfDoi: /https:\/\/osf\.io\/.*([a-z0-9]{5})\/?$/,
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

export type PaperServerConfiguration = {
  startOfDoi: string,
  regexToCaptureEndOfDoi: RegExp,
  prefix: string,
};

export const uriIsMissingDoiPrefix = (uri: string, doiPrefix: string): boolean => !uri.includes(doiPrefix);

export const isSupported = (
  server: string, config: ExpressionDoiFromUriConfig,
): server is SupportedServerName => pipe(
  config,
  Object.keys,
  RA.elem(stringEq)(server),
);

type SupportedServerName = 'researchsquare' | 'scielo' | 'biorxivLegacy' | 'medrxiv' | 'osf' | 'psyarxiv' | 'arxiv';

export type ExpressionDoiFromUriConfig = Record<SupportedServerName, PaperServerConfiguration>;
