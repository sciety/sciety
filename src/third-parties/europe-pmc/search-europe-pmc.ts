import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { ArticleServer } from '../../types/article-server';
import { articleIdCodec } from '../../types/article-id';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { Logger } from '../../shared-ports';
import { constructQueryUrl } from './construct-query-url';
import { QueryExternalService } from '../query-external-service';
import { ExternalQueries } from '../external-queries';

const europePmcPublisher = t.union(
  [
    t.literal('bioRxiv'),
    t.literal('medRxiv'),
    t.literal('Research Square'),
    t.literal('SciELO Preprints'),
    t.literal('Access Microbiology'),
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
  doi: articleIdCodec,
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
    case 'Access Microbiology':
      return 'microbiologyresearch';
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

const getFromUrl = (queryExternalService: QueryExternalService, logger: Logger) => (url: string) => pipe(
  url,
  queryExternalService('error'),
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

export const searchEuropePmc = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['searchForArticles'] => (pageSize) => (
  query,
  cursor,
  evaluatedOnly,
) => pipe(
  constructQueryUrl(query, cursor, evaluatedOnly, pageSize),
  getFromUrl(queryExternalService, logger),
  TE.map(constructSearchResults(logger, pageSize)),
);
