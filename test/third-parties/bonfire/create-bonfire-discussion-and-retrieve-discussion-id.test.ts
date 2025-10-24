import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { createBonfireDiscussionAndRetrieveDiscussionId } from '../../../src/third-parties/bonfire';
import { generateAuthenticationHeaders } from '../../../src/third-parties/bonfire/generate-authentication-headers';
import { ExpressionDoi } from '../../../src/types/expression-doi';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import {postDataBonfire} from '../../../src/third-parties/bonfire/post-data-bonfire';

jest.mock('../../../src/third-parties/bonfire/generate-authentication-headers');
jest.mock('../../../src/third-parties/bonfire/post-data-bonfire');

const invokeCreateBonfireDiscussionIdAndRetrieveDiscussionId = async (expressionDoi: ExpressionDoi) => pipe(
  expressionDoi,
  createBonfireDiscussionAndRetrieveDiscussionId(dummyLogger),
  TE.getOrElse(shouldNotBeCalled),
)();

describe('create-bonfire-discussion-and-retrieve-discussion-id', () => {
  beforeEach(() => {
    (jest.mocked(generateAuthenticationHeaders)).mockReturnValueOnce(TE.right({}));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when an id with a correct type is returned', () => {
    const bonfireDiscussionId = arbitraryString();
    const doiOfDiscussedArticle = arbitraryExpressionDoi();
    let result: Awaited<ReturnType<typeof invokeCreateBonfireDiscussionIdAndRetrieveDiscussionId>>;

    (jest.mocked(postDataBonfire)).mockReturnValueOnce(() => TE.right({
      data: {
        addMediaByUri: {
          id: bonfireDiscussionId,
        },
      },
    }));

    beforeEach(async () => {
      result = await invokeCreateBonfireDiscussionIdAndRetrieveDiscussionId(doiOfDiscussedArticle);
    });

    it('includes the id in the query response', () => {
      expect(result).toStrictEqual(bonfireDiscussionId);
    });
  });

  describe('when an id is not returned', () => {
    it.todo('returns an error');
  });
});
