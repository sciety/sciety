import { URLSearchParams } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import * as PR from 'io-ts/PathReporter';
import { Logger } from './logger';
import { Doi } from '../types/doi';
import { Json } from '../types/json';

export type GetJson = (uri: string) => Promise<Json>;

type SearchResult = {
  doi: Doi,
  title: string,
  authors: string,
  postedDate: Date,
};

type SearchResults = {
  items: Array<SearchResult>,
  total: number,
};

export type SearchEuropePmc = (query: string) => TE.TaskEither<'unavailable', SearchResults>;

const resultDetails = t.type({
  doi: t.string,
  title: t.string,
  authorString: t.string,
  firstPublicationDate: DateFromISOString,
});

const europePmcResponse = t.type({
  hitCount: t.number,
  resultList: t.type({
    result: t.array(resultDetails),
  }),
});

type EuropePmcResponse = t.TypeOf<typeof europePmcResponse>;

const constructQueryParams = (query: string): URLSearchParams => (
  new URLSearchParams({
    query: `${query} (PUBLISHER:"bioRxiv" OR PUBLISHER:"medRxiv") sort_date:y`,
    format: 'json',
    pageSize: '10',
  }));

const constructSearchUrl = (queryParams: URLSearchParams): string => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${queryParams.toString()}`;

const constructSearchResults = (data: EuropePmcResponse): SearchResults => {
  const items = data.resultList.result.map((item): SearchResult => ({
    doi: new Doi(item.doi),
    title: item.title,
    authors: item.authorString,
    postedDate: new Date(item.firstPublicationDate),
  }));
  return {
    items,
    total: data.hitCount,
  };
};

type GetFromUrl = <A>(codec: t.Decoder<Json, A>) => (url: string) => TE.TaskEither<'not-found' | 'unavailable', A>;

const getFromUrl = (getJson: GetJson, logger: Logger): GetFromUrl => (codec) => (url) => pipe(
  TE.tryCatch(async () => getJson(url), E.toError),
  TE.chain(flow(
    codec.decode,
    TE.fromEither,
    TE.mapLeft((e) => new Error(PR.failure(e).join('\n'))),
  )),
  TE.mapLeft(
    (error): 'unavailable' => {
      logger('error', 'Could not parse EuropePMC response', { error });
      return 'unavailable';
    },
  ),
);

export const createSearchEuropePmc = (getJson: GetJson, logger: Logger): SearchEuropePmc => (query) => pipe(
  query,
  constructQueryParams,
  constructSearchUrl,
  getFromUrl(getJson, logger)(europePmcResponse),
  TE.bimap(
    constant('unavailable'),
    constructSearchResults,
  ),
);
