import { URLSearchParams } from 'url';
import * as E from 'fp-ts/Either';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Json } from 'io-ts-types';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import { Logger } from './logger';
import { ArticleServer } from '../types/article-server';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { Doi } from '../types/doi';

type GetJson = (uri: string) => Promise<Json>;

type SearchResult = {
  doi: Doi,
  server: ArticleServer,
  title: string,
  authors: string,
  postedDate: Date,
};

export type SearchResults = {
  items: ReadonlyArray<SearchResult>,
  total: number,
};

type Dependencies = {
  getJson: GetJson,
  logger: Logger,
};

type SearchEuropePmc = (query: string) => RTE.ReaderTaskEither<Dependencies, 'unavailable', SearchResults>;

const europePmcPublisher = t.union([t.literal('bioRxiv'), t.literal('medRxiv')]);

const resultDetails = t.type({
  doi: DoiFromString,
  title: t.string,
  authorString: t.string,
  firstPublicationDate: DateFromISOString,
  bookOrReportDetails: t.type({
    publisher: europePmcPublisher,
  }),
});

const europePmcResponse = t.type({
  hitCount: t.number,
  resultList: t.type({
    result: t.array(resultDetails),
  }),
});

type EuropePmcResponse = t.TypeOf<typeof europePmcResponse>;

type EuropePmcPublisher = t.TypeOf<typeof europePmcPublisher>;

const constructQueryParams = (query: string) => (
  new URLSearchParams({
    query: `${query} (PUBLISHER:"bioRxiv" OR PUBLISHER:"medRxiv") sort_date:y`,
    format: 'json',
    pageSize: '10',
  }));

const constructSearchUrl = (queryParams: URLSearchParams) => `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${queryParams.toString()}`;

const translatePublisherToServer = (publisher: EuropePmcPublisher): ArticleServer => {
  switch (publisher) {
    case 'bioRxiv':
      return 'biorxiv';
    case 'medRxiv':
      return 'medrxiv';
  }
};

const constructSearchResults = (data: EuropePmcResponse) => {
  const items = data.resultList.result.map((item) => ({
    doi: item.doi,
    server: translatePublisherToServer(item.bookOrReportDetails.publisher),
    title: item.title,
    authors: item.authorString,
    postedDate: item.firstPublicationDate,
  }));
  return {
    items,
    total: data.hitCount,
  };
};

type GetFromUrl = (url: string) => RTE.ReaderTaskEither<Dependencies, 'unavailable', EuropePmcResponse>;

const getFromUrl: GetFromUrl = (url: string) => ({ getJson, logger }: Dependencies) => pipe(
  TE.tryCatch(async () => getJson(url), E.toError),
  TE.mapLeft(
    (error) => {
      // TODO recognise not-found somehow
      logger('error', 'Could not fetch', { error, url });
      return 'unavailable' as const;
    },
  ),
  TE.chainEitherKW(flow(
    europePmcResponse.decode,
    E.mapLeft((error) => {
      logger('error', 'Could not parse response', { error, url });
      return 'unavailable' as const;
    }),
  )),
);

export const searchEuropePmc: SearchEuropePmc = flow(
  constructQueryParams,
  constructSearchUrl,
  getFromUrl,
  RTE.map(constructSearchResults),
);
