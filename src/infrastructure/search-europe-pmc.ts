import { URLSearchParams } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Logger } from './logger';
import { Doi } from '../types/doi';
import { Json, JsonCompatible } from '../types/json';

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

type EuropePmcQueryResponse = JsonCompatible<{
  hitCount: number,
  resultList: {
    result: Array<{
      doi: string,
      title: string,
      authorString: string,
      firstPublicationDate: string,
    }>,
  },
}>;

const constructQueryParams = (query: string): URLSearchParams => (
  new URLSearchParams({
    query: `${query} PUBLISHER:"bioRxiv" sort_date:y`,
    format: 'json',
    pageSize: '10',
  }));

const constructSearchUrl = (queryParams: URLSearchParams): string => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${queryParams.toString()}`;

const logError = (logger: Logger) => (error: unknown): 'unavailable' => {
  logger('error', 'Failed to search Europe PMC', { error });
  return 'unavailable';
};

const search = async (getJson: GetJson, query: string): Promise<Json> => (
  pipe(
    query,
    constructQueryParams,
    constructSearchUrl,
    getJson,
  )
);

const constructSearchResults = (json: Json): TE.TaskEither<'unavailable', SearchResults> => {
  try {
    const data = json as EuropePmcQueryResponse;
    const items = data.resultList.result.map((item): SearchResult => ({
      doi: new Doi(item.doi),
      title: item.title,
      authors: item.authorString,
      postedDate: new Date(item.firstPublicationDate),
    }));

    return TE.right({
      items,
      total: data.hitCount,
    });
  } catch (error: unknown) {
    return TE.left('unavailable');
  }
};

export const createSearchEuropePmc = (getJson: GetJson, logger: Logger): SearchEuropePmc => (
  (query) => (
    pipe(
      TE.tryCatch(async () => search(getJson, query), logError(logger)),
      TE.chain(constructSearchResults),
    )
  )
);
