import * as T from 'fp-ts/Task';
import { StatusCodes } from 'http-status-codes';
import { docmapIndex } from '../../../src/docmaps/docmap-index';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('docmap-index', () => {
  describe('when all ports work', () => {
    describe('and there are no docmaps', () => {
      let response: { body: unknown, status: StatusCodes };

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
      it.todo('return them as a list in the articles field');

      it.todo('return a 200 status code');
    });
  });

  describe('when any docmap fails to generate', () => {
    it.todo('returns a body containing an error object');

    it.todo('returns a 500 status code');
  });

  describe('when the query parameters are invalid', () => {
    it.todo('returns a body containing an error object');

    it.todo('returns a 400 status code');
  });
});
