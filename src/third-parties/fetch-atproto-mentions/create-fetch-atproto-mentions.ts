import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Logger } from '../../logger';
import { AtprotoMention } from '../../types/atproto-mention';
import * as DE from '../../types/data-error';
import { toDoiUrl } from '../../types/expression-doi';
import * as PH from '../../types/publishing-history';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

const blueskySearchPostsResponseCodec = t.type({
  posts: t.array(t.type({
    uri: t.string,
    author: t.type({
      handle: t.string,
    }),
    record: t.type({
      text: t.string,
      createdAt: tt.DateFromISOString,
    }),
  })),
}, 'blueskySearchPostsResponseCodec');

const sembleLibrariesForUrlResponseCodec = t.type({
  libraries: t.array(t.type({
    user: t.type({
      handle: t.string,
    }),
    card: t.type({
      uri: t.string,
      createdAt: tt.DateFromISOString,
    }),
  })),
}, 'sembleLibrariesForUrlResponseCodec');

const toRecordKey = (atUri: string) => atUri.substring(atUri.lastIndexOf('/') + 1);

const fetchFromBluesky = (
  queryExternalService: QueryExternalService,
  logger: Logger,
) => (paperUrl: string): TE.TaskEither<DE.DataError, ReadonlyArray<AtprotoMention>> => {
  const url = `https://api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=*&limit=25&url=${encodeURIComponent(paperUrl)}`;
  return pipe(
    url,
    queryExternalService(),
    TE.chainEitherKW(flow(
      decodeAndLogFailures(logger, blueskySearchPostsResponseCodec, { url }),
      E.mapLeft(() => DE.unavailable),
    )),
    TE.map((response) => pipe(
      response.posts,
      RA.map((post) => ({
        atUri: post.uri,
        source: 'Bluesky' as const,
        authorHandle: post.author.handle,
        text: post.record.text,
        createdAt: post.record.createdAt,
        href: `https://bsky.app/profile/${post.author.handle}/post/${toRecordKey(post.uri)}`,
      })),
    )),
  );
};

const fetchFromSemble = (
  queryExternalService: QueryExternalService,
  logger: Logger,
) => (paperUrl: string): TE.TaskEither<DE.DataError, ReadonlyArray<AtprotoMention>> => {
  const url = `https://api.semble.so/api/network.cosmik.card.getLibrariesForUrl?url=${encodeURIComponent(paperUrl)}`;
  return pipe(
    url,
    queryExternalService(),
    TE.chainEitherKW(flow(
      decodeAndLogFailures(logger, sembleLibrariesForUrlResponseCodec, { url }),
      E.mapLeft(() => DE.unavailable),
    )),
    TE.map((response) => pipe(
      response.libraries,
      RA.map((library) => ({
        atUri: library.card.uri,
        source: 'Semble' as const,
        authorHandle: library.user.handle,
        text: 'Saved this paper to their library',
        createdAt: library.card.createdAt,
        href: `https://semble.so/url?id=${encodeURIComponent(paperUrl)}`,
      })),
    )),
  );
};

const getPaperUrls = (history: PH.PublishingHistory) => pipe(
  history,
  PH.getAllExpressions,
  RA.flatMap((expression) => [
    toDoiUrl(expression.expressionDoi),
    expression.publisherHtmlUrl.toString(),
  ]),
  RA.uniq(S.Eq),
);

const byAtUri: Eq.Eq<AtprotoMention> = pipe(
  S.Eq,
  Eq.contramap((mention) => mention.atUri),
);

const failOnlyIfEverySourceFailed = (
  results: ReadonlyArray<E.Either<DE.DataError, ReadonlyArray<AtprotoMention>>>,
) => pipe(
  results,
  RA.rights,
  E.fromPredicate(
    (successes) => successes.length > 0,
    () => DE.unavailable,
  ),
  E.map(RA.flatten),
);

export const createFetchAtprotoMentions = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['fetchAtprotoMentions'] => (history) => pipe(
  getPaperUrls(history),
  RA.flatMap((paperUrl) => [
    fetchFromBluesky(queryExternalService, logger)(paperUrl),
    fetchFromSemble(queryExternalService, logger)(paperUrl),
  ]),
  T.sequenceArray,
  T.map(failOnlyIfEverySourceFailed),
  TE.map(RA.uniq(byAtUri)),
);
