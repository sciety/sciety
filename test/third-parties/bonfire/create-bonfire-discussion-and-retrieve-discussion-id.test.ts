import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { createBonfireDiscussionAndRetrieveDiscussionId } from '../../../src/third-parties/bonfire';
import { generateAuthenticationHeaders } from '../../../src/third-parties/bonfire/generate-authentication-headers';
import { postDataBonfire } from '../../../src/third-parties/bonfire/post-data-bonfire';
import * as DE from '../../../src/types/data-error';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

jest.mock('../../../src/third-parties/bonfire/generate-authentication-headers');
jest.mock('../../../src/third-parties/bonfire/post-data-bonfire');

describe('create-bonfire-discussion-and-retrieve-discussion-id', () => {
  beforeEach(() => {
    (jest.mocked(generateAuthenticationHeaders)).mockReturnValueOnce(TE.right({}));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when an id with a correct type is returned', () => {
    it('includes the id in the query response', async () => {
      (jest.mocked(postDataBonfire)).mockReturnValueOnce(() => TE.right({
        data: {
          addMediaByUri: {
            id: '1234',
          },
        },
      }));

      await expect(
        createBonfireDiscussionAndRetrieveDiscussionId(dummyLogger)(arbitraryExpressionDoi())(),
      ).resolves.toStrictEqual(E.right('1234'));
    });
  });

  describe('when an id is not returned', () => {
    it('returns an error', async () => {
      (jest.mocked(postDataBonfire)).mockReturnValueOnce(() => TE.left(DE.notFound));

      await expect(
        createBonfireDiscussionAndRetrieveDiscussionId(dummyLogger)(arbitraryExpressionDoi())(),
      ).resolves.toStrictEqual(E.left('not-found'));
    });

    it('returns an error, if the response does not match codec', async () => {
      (jest.mocked(postDataBonfire)).mockReturnValueOnce(() => TE.right({
        data: {
          addMediaByUri: {
            id: null,
          },
        },
      }));

      await expect(
        createBonfireDiscussionAndRetrieveDiscussionId(dummyLogger)(arbitraryExpressionDoi())(),
      ).resolves.toStrictEqual(E.left('unavailable'));
    });
  });
});
