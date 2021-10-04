import { URL } from 'url';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { StatusCodes } from 'http-status-codes';
import { docmapIndex } from '../../../src/docmaps/docmap-index';
import { FindVersionsForArticleDoi } from '../../../src/docmaps/docmap/docmap';
import { groupEvaluatedArticle } from '../../../src/domain-events/group-evaluated-article-event';
import * as DE from '../../../src/types/data-error';
import * as GID from '../../../src/types/group-id';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('docmap-index', () => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');

  describe('when all ports work', () => {
    describe('and there are no docmaps', () => {
      let response: { body: { articles: ReadonlyArray<unknown> }, status: StatusCodes };

      beforeEach(async () => {
        const ports = {
          getAllEvents: T.of([]),
          fetchReview: shouldNotBeCalled,
          findReviewsForArticleDoi: shouldNotBeCalled,
          findVersionsForArticleDoi: shouldNotBeCalled,
          fetchArticle: shouldNotBeCalled,
          getGroup: shouldNotBeCalled,
        };
        response = await docmapIndex(ports)({})();
      });

      it('return an empty list in the articles field', async () => {
        expect(response.body).toStrictEqual({ articles: [] });
      });

      it('return a 200 status code', () => {
        expect(response.status).toStrictEqual(StatusCodes.OK);
      });
    });

    describe('when there are docmaps', () => {
      let response: { body: { articles: ReadonlyArray<unknown> }, status: StatusCodes };

      beforeEach(async () => {
        const review = (groupId: GID.GroupId, date: Date) => ({
          reviewId: arbitraryReviewId(),
          groupId,
          occurredAt: date,
        });
        const ports = {
          getAllEvents: T.of([
            groupEvaluatedArticle(ncrcGroupId, arbitraryDoi(), arbitraryReviewId()),
          ]),
          fetchReview: () => TE.right({ url: new URL(arbitraryUri()) }),
          findReviewsForArticleDoi: () => TE.right([review(ncrcGroupId, arbitraryDate())]),
          findVersionsForArticleDoi: (): ReturnType<FindVersionsForArticleDoi> => TO.some([
            {
              source: new URL(arbitraryUri()),
              occurredAt: arbitraryDate(),
              version: 1,
            },
          ]),
          getGroup: () => TO.some({
            ...arbitraryGroup(),
            id: ncrcGroupId,
          }),
          fetchArticle: () => TE.right({ server: arbitraryArticleServer() }),
        };
        response = await docmapIndex(ports)({})();
      });

      it('return them as a list in the articles field', () => {
        expect(response.body.articles).toHaveLength(1);
      });

      it('return a 200 status code', () => {
        expect(response.status).toStrictEqual(StatusCodes.OK);
      });
    });
  });

  describe('when any docmap fails to generate', () => {
    let response: { body: { articles: ReadonlyArray<unknown> }, status: StatusCodes };

    beforeEach(async () => {
      const ports = {
        getAllEvents: T.of([
          groupEvaluatedArticle(ncrcGroupId, arbitraryDoi(), arbitraryReviewId()),
        ]),
        fetchReview: () => TE.left(DE.unavailable),
        findReviewsForArticleDoi: () => TE.left(DE.unavailable),
        findVersionsForArticleDoi: () => TO.none,
        getGroup: () => TO.none,
        fetchArticle: () => TE.left(DE.unavailable),
      };
      response = await docmapIndex(ports)({})();
    });

    it.todo('returns a body containing an error object');

    it.skip('returns a 500 status code', () => {
      expect(response.status).toStrictEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe('when the query parameters are invalid', () => {
    it.todo('returns a body containing an error object');

    it.todo('returns a 400 status code');
  });
});
