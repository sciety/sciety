import { URLSearchParams } from 'url';
import * as E from 'fp-ts/Either';
import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/DateFromISOString';
import * as PR from 'io-ts/PathReporter';
import { Logger } from './logger';
import { ArticleServer } from '../types/article-server';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type GetJson = (uri: string) => Promise<Json>;

type SearchResult = {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
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

const europePmcPublisher = t.union([t.literal('bioRxiv'), t.literal('medRxiv')]);

const europePmcAuthor = t.union([
  t.type({ fullName: t.string }),
  t.type({ collectiveName: t.string }),
]);

const resultDetails = t.type({
  doi: DoiFromString,
  title: t.string,
  authorList: t.type({
    author: t.readonlyArray(europePmcAuthor),
  }),
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

const constructQueryParams = (pageSize: number) => (query: string) => (
  new URLSearchParams({
    query: `${query} (PUBLISHER:"bioRxiv" OR PUBLISHER:"medRxiv") sort_date:y`,
    format: 'json',
    pageSize: pageSize.toString(),
    resultType: 'core',
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
    title: pipe(item.title, toHtmlFragment, sanitise),
    authors: pipe(
      item.authorList.author,
      RA.map((author) => ('fullName' in author ? author.fullName : author.collectiveName)),
    ),
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
    E.mapLeft((errors) => {
      logger('error', 'Could not parse response', { errors: PR.failure(errors), url });
      return 'unavailable' as const;
    }),
  )),
);

type SearchEuropePmc = (pageSize: number)
=> (query: string, cursor: O.Option<string>)
=> RTE.ReaderTaskEither<Dependencies, 'unavailable', SearchResults>;

export const searchEuropePmc: SearchEuropePmc = (pageSize) => flow(
  constructQueryParams(pageSize),
  constructSearchUrl,
  getFromUrl,
  RTE.map(constructSearchResults),
);
