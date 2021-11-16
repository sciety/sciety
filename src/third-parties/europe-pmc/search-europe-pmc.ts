import { URLSearchParams } from 'url';
import * as E from 'fp-ts/Either';
import { Json } from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import {
  constant, flow, pipe, tupled,
} from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { Logger } from '../../infrastructure/logger';
import { ArticleServer } from '../../types/article-server';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type GetJson = (uri: string) => Promise<Json>;

type SearchResult = {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: O.Option<ReadonlyArray<string>>,
};

export type SearchResults = {
  items: ReadonlyArray<SearchResult>,
  total: number,
  nextCursor: O.Option<string>,
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
  bookOrReportDetails: t.type({
    publisher: europePmcPublisher,
  }),
});

const europePmcResponse = t.type({
  hitCount: t.number,
  nextCursorMark: tt.optionFromNullable(t.string),
  resultList: t.type({
    result: t.array(resultDetails),
  }),
});

type EuropePmcResponse = t.TypeOf<typeof europePmcResponse>;

type EuropePmcPublisher = t.TypeOf<typeof europePmcPublisher>;

const constructQueryParams = (pageSize: number) => (query: string, cursor: O.Option<string>) => (
  new URLSearchParams({
    query: `${query} (PUBLISHER:"bioRxiv" OR PUBLISHER:"medRxiv") sort_date:y`,
    format: 'json',
    pageSize: pageSize.toString(),
    resultType: 'core',
    cursorMark: O.getOrElse(constant('*'))(cursor),
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

const constructSearchResults = (pageSize: number) => (data: EuropePmcResponse) => {
  const items = data.resultList.result.map((item) => ({
    doi: item.doi,
    server: translatePublisherToServer(item.bookOrReportDetails.publisher),
    title: pipe(item.title, toHtmlFragment, sanitise),
    authors: pipe(
      item.authorList.author,
      RA.map((author) => ('fullName' in author ? author.fullName : author.collectiveName)),
      O.some,
    ),
  }));
  const nextCursor = data.resultList.result.length < pageSize ? O.none : data.nextCursorMark;
  return {
    items,
    total: data.hitCount,
    nextCursor,
  };
};

type GetFromUrl = (dependencies: Dependencies) => (url: string) => TE.TaskEither<DE.DataError, EuropePmcResponse>;

const getFromUrl: GetFromUrl = ({ getJson, logger }: Dependencies) => (url: string) => pipe(
  TE.tryCatch(async () => getJson(url), E.toError),
  TE.mapLeft(
    (error) => {
      // TODO recognise not-found somehow
      logger('error', 'Could not fetch', { error, url });
      return DE.unavailable;
    },
  ),
  TE.chainEitherKW(flow(
    europePmcResponse.decode,
    E.mapLeft((errors) => {
      logger(
        'error',
        'Could not parse response from Europe PMC',
        { errors: PR.failure(errors), url },
      );
      return DE.unavailable;
    }),
  )),
);

type SearchEuropePmc = (dependencies: Dependencies)
=> (pageSize: number)
=> (query: string, cursor: O.Option<string>)
=> TE.TaskEither<DE.DataError, SearchResults>;

export const searchEuropePmc: SearchEuropePmc = (dependencies) => (pageSize) => (query, cursor) => pipe(
  [query, cursor],
  tupled(constructQueryParams(pageSize)),
  constructSearchUrl,
  getFromUrl(dependencies),
  TE.map(constructSearchResults(pageSize)),
);
