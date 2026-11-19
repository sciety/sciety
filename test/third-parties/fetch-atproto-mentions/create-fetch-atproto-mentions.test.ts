import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { createFetchAtprotoMentions } from '../../../src/third-parties/fetch-atproto-mentions';
import { QueryExternalService } from '../../../src/third-parties/query-external-service';
import { AtprotoMention } from '../../../src/types/atproto-mention';
import { abortTest } from '../../abort-test';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import { arbitraryPublishingHistoryOnlyPreprints } from '../../types/publishing-history.helper';

const recordQueriedUrls = () => {
  const queriedUrls: Array<string> = [];
  const queryExternalService: QueryExternalService = () => (url) => {
    queriedUrls.push(decodeURIComponent(url));
    return url.includes('api.bsky.app')
      ? TE.right({ posts: [] })
      : TE.right({ libraries: [] });
  };
  return { queriedUrls, queryExternalService };
};

describe('create-fetch-atproto-mentions', () => {
  const history = arbitraryPublishingHistoryOnlyPreprints();
  const additionalSembleUrl = 'https://osf.io/preprints/psyarxiv/687au_v1';

  describe('when Semble is requested with additional urls', () => {
    const { queriedUrls, queryExternalService } = recordQueriedUrls();

    beforeAll(async () => {
      await createFetchAtprotoMentions(queryExternalService, dummyLogger)(history, ['Semble'], [additionalSembleUrl])();
    });

    it('queries Semble for the additional urls', () => {
      expect(queriedUrls).toContainEqual(expect.stringContaining(`getLibrariesForUrl?url=${additionalSembleUrl}`));
    });

    it('does not query Bluesky', () => {
      expect(queriedUrls).not.toContainEqual(expect.stringContaining('api.bsky.app'));
    });
  });

  describe('when only Bluesky is requested', () => {
    const { queriedUrls, queryExternalService } = recordQueriedUrls();

    beforeAll(async () => {
      await createFetchAtprotoMentions(queryExternalService, dummyLogger)(history, ['Bluesky'], [additionalSembleUrl])();
    });

    it('does not query Semble', () => {
      expect(queriedUrls).not.toContainEqual(expect.stringContaining('api.semble.so'));
    });

    it('does not query Bluesky for the additional Semble urls', () => {
      expect(queriedUrls).not.toContainEqual(expect.stringContaining(additionalSembleUrl));
    });
  });

  describe('author details', () => {
    const blueskyPost = (author: Record<string, unknown>) => ({
      uri: 'at://did:plc:abc/app.bsky.feed.post/xyz',
      author: { handle: 'someone.bsky.social', ...author },
      record: { text: 'A post', createdAt: '2026-11-01T00:00:00.000Z' },
    });

    const sembleLibrary = (user: Record<string, unknown>) => ({
      user: { handle: 'someone.example.com', ...user },
      card: { uri: 'at://did:plc:def/network.cosmik.card/uvw', createdAt: '2026-11-02T00:00:00.000Z' },
    });

    const fetchMentions = async (
      source: AtprotoMention['source'],
      response: unknown,
    ): Promise<ReadonlyArray<AtprotoMention>> => pipe(
      await createFetchAtprotoMentions(() => () => TE.right(response), dummyLogger)(history, [source], [])(),
      E.getOrElseW(abortTest('fetch unexpectedly failed')),
    );

    const authorDetails = (mentions: ReadonlyArray<AtprotoMention>) => pipe(
      mentions,
      RA.map((mention) => ({ authorName: mention.authorName, authorAvatarUrl: mention.authorAvatarUrl })),
    );

    describe('when a Bluesky author has a display name and avatar', () => {
      const authorName = arbitraryString();

      it('returns them', async () => {
        const mentions = await fetchMentions('Bluesky', {
          posts: [blueskyPost({ displayName: authorName, avatar: 'https://cdn.bsky.app/img/avatar/x' })],
        });

        expect(authorDetails(mentions)).toStrictEqual([{
          authorName: O.some(authorName),
          authorAvatarUrl: O.some('https://cdn.bsky.app/img/avatar/x'),
        }]);
      });
    });

    describe('when a Bluesky author has no display name or avatar', () => {
      it.each([
        ['missing', {}],
        ['blank', { displayName: '  ', avatar: '' }],
      ])('returns none when they are %s', async (_, author) => {
        const mentions = await fetchMentions('Bluesky', { posts: [blueskyPost(author)] });

        expect(authorDetails(mentions)).toStrictEqual([{ authorName: O.none, authorAvatarUrl: O.none }]);
      });
    });

    describe('when a Semble user has a name and avatar', () => {
      const authorName = arbitraryString();

      it('returns them', async () => {
        const mentions = await fetchMentions('Semble', {
          libraries: [sembleLibrary({ name: authorName, avatarUrl: 'https://cdn.bsky.app/img/avatar/y' })],
        });

        expect(authorDetails(mentions)).toStrictEqual([{
          authorName: O.some(authorName),
          authorAvatarUrl: O.some('https://cdn.bsky.app/img/avatar/y'),
        }]);
      });
    });

    describe('when a Semble user has no name or avatar', () => {
      it('returns none', async () => {
        const mentions = await fetchMentions('Semble', { libraries: [sembleLibrary({})] });

        expect(authorDetails(mentions)).toStrictEqual([{ authorName: O.none, authorAvatarUrl: O.none }]);
      });
    });
  });
});
