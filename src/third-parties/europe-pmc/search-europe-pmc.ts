import { URLSearchParams } from 'url';
import * as E from 'fp-ts/Either';
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
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { GetJson } from '../../shared-ports';
import { ExternalQueries } from '../external-queries';

type Dependencies = {
  getJson: GetJson,
  logger: Logger,
};

const europePmcPublisher = t.union(
  [
    t.literal('bioRxiv'),
    t.literal('medRxiv'),
    t.literal('Research Square'),
    t.literal('SciELO Preprints'),
  ],
);

const europePmcAuthor = t.union([
  t.type({ fullName: t.string }),
  t.type({ collectiveName: t.string }),
]);

const authorsFromJson = tt.optionFromNullable(t.type({
  author: t.readonlyArray(europePmcAuthor),
}));

type Authors = t.TypeOf<typeof authorsFromJson>;

const itemFromJson = t.type({
  doi: DoiFromString,
  title: t.string,
  authorList: authorsFromJson,
  bookOrReportDetails: t.type({
    publisher: europePmcPublisher,
  }),
});

type Item = t.TypeOf<typeof itemFromJson>;

const europePmcResponse = t.type({
  hitCount: t.number,
  nextCursorMark: tt.optionFromNullable(t.string),
  resultList: t.type({
    result: t.array(itemFromJson),
  }),
});

type EuropePmcResponse = t.TypeOf<typeof europePmcResponse>;

type EuropePmcPublisher = t.TypeOf<typeof europePmcPublisher>;

const constructQueryParams = (
  pageSize: number,
) => (
  query: string,
  cursor: O.Option<string>,
  evaluatedOnly: boolean,
) => (
  new URLSearchParams({
    query: `(${query}) (PUBLISHER:"bioRxiv" OR PUBLISHER:"medRxiv" OR PUBLISHER:"Research Square" OR PUBLISHER:"SciELO Preprints")${evaluatedOnly ? ' (LABS_PUBS:"2112")' : ''} sort_date:y`,
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
    case 'Research Square':
      return 'researchsquare';
    case 'SciELO Preprints':
      return 'scielopreprints';
  }
};

const logIfNoAuthors = (logger: Logger, item: Item) => (authors: Authors): Authors => {
  if (O.isNone(authors)) {
    logger('warn', 'No authorList provided by EuropePMC', { articleId: item.doi.value });
  }
  return authors;
};

const constructSearchResults = (logger: Logger, pageSize: number) => (data: EuropePmcResponse) => {
  const items = data.resultList.result.map((item) => ({
    articleId: item.doi,
    server: translatePublisherToServer(item.bookOrReportDetails.publisher),
    title: pipe(item.title, toHtmlFragment, sanitise),
    authors: pipe(
      item.authorList,
      logIfNoAuthors(logger, item),
      O.map(flow(
        (authorList) => authorList.author,
        RA.map((author) => ('fullName' in author ? author.fullName : author.collectiveName)),
      )),
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
      logger('error', 'Could not get JSON from Europe PMC', { error, url });
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

type SearchEuropePmc = (dependencies: Dependencies) => ExternalQueries['searchForArticles'];

export const searchEuropePmc: SearchEuropePmc = (dependencies) => (pageSize) => (
  query,
  cursor,
  evaluatedOnly,
) => pipe(
  [query, cursor, evaluatedOnly],
  tupled(constructQueryParams(pageSize)),
  constructSearchUrl,
  getFromUrl(dependencies),
  TE.map(constructSearchResults(dependencies.logger, pageSize)),
);
