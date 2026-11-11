import * as TE from 'fp-ts/TaskEither';
import { createFetchAtprotoMentions } from '../../../src/third-parties/fetch-atproto-mentions';
import { QueryExternalService } from '../../../src/third-parties/query-external-service';
import { dummyLogger } from '../../dummy-logger';
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
});
