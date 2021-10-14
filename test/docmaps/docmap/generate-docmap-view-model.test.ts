import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Docmap, docmap } from '../../../src/docmaps/docmap/docmap';
import {
  DocmapModel,
  FindVersionsForArticleDoi,
  generateDocmapViewModel,
} from '../../../src/docmaps/docmap/generate-docmap-view-model';
import { GroupId } from '../../../src/types/group-id';
import { ReviewId } from '../../../src/types/review-id';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

const indexedGroupId = arbitraryGroupId();
const articleId = arbitraryDoi();

const review = (groupId: GroupId, date: Date) => ({
  reviewId: arbitraryReviewId(),
  groupId,
  occurredAt: date,
});

const defaultPorts = {
  fetchReview: (id: ReviewId) => TE.right({ url: new URL(`https://reviews.example.com/${id}`) }),
  findReviewsForArticleDoi: () => TE.right([review(indexedGroupId, arbitraryDate())]),
  findVersionsForArticleDoi: (): ReturnType<FindVersionsForArticleDoi> => TO.some([
    {
      source: new URL(arbitraryUri()),
      occurredAt: arbitraryDate(),
      version: 1,
    },
  ]),
  getGroup: () => TO.some({
    ...arbitraryGroup(),
    id: indexedGroupId,
  }),
  fetchArticle: () => TE.right({ server: arbitraryArticleServer() }),
};

describe('generate-docmap-view-model', () => {
  it('includes the article id', async () => {
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => TE.right([review(indexedGroupId, arbitraryDate())]),
    };
    const result = await pipe(
      { articleId, groupId: indexedGroupId },
      generateDocmapViewModel(ports),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(result).toStrictEqual(expect.objectContaining({ articleId }));
  });

  it('includes the group', async () => {
    const group = arbitraryGroup();
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => TE.right([review(group.id, arbitraryDate())]),
      getGroup: () => TO.some(group),
    };
    const result = await pipe(
      { articleId, groupId: group.id },
      generateDocmapViewModel(ports),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(result).toStrictEqual(expect.objectContaining({ group }));
  });

  it('handles all article servers', async () => {
    const findVersionsForArticleDoi = jest.fn().mockImplementation(
      (): ReturnType<FindVersionsForArticleDoi> => TO.some([
        {
          source: new URL(arbitraryUri()),
          occurredAt: arbitraryDate(),
          version: 1,
        },
      ]),
    );
    const server = arbitraryArticleServer();
    const ports = {
      ...defaultPorts,
      findVersionsForArticleDoi,
      fetchArticle: () => TE.right({ server }),
    };
    await generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId })();

    expect(findVersionsForArticleDoi).toHaveBeenCalledWith(articleId, server);
  });

  describe('when there are multiple evaluations by the selected group', () => {
    const earlierDate = new Date('1900');
    const laterDate = new Date('2000');
    const reviews = [
      review(indexedGroupId, earlierDate),
      review(indexedGroupId, laterDate),
    ];
    let result: DocmapModel;

    beforeEach(async () => {
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right(reviews),
      };
      result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns all evaluations, checking all values that the type dictates', () => {
      expect(result.evaluations).toStrictEqual([
        expect.objectContaining({
          occurredAt: earlierDate,
          reviewId: reviews[0].reviewId,
          sourceUrl: new URL(`https://reviews.example.com/${reviews[0].reviewId}`),
        }),
        expect.objectContaining({
          occurredAt: laterDate,
          reviewId: reviews[1].reviewId,
          sourceUrl: new URL(`https://reviews.example.com/${reviews[1].reviewId}`),
        }),
      ]);
    });
  });

  describe('when there are no evaluations by the selected group', () => {
    it('returns an E.left of not-found', async () => {
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right([]),
      };
      const result = await generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId })();

      expect(result).toStrictEqual(E.left('not-found'));
    });
  });

  describe('when there are evaluations by other groups', () => {
    it('only uses the evaluation by the selected group', async () => {
      const earlierDate = new Date('1900');
      const laterDate = new Date('2000');
      const reviewByThisGroup = review(indexedGroupId, laterDate);
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right(
          [
            review(arbitraryGroupId(), earlierDate),
            reviewByThisGroup,
          ],
        ),
      };

      const result = await pipe(
        generateDocmapViewModel(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result.evaluations).toStrictEqual([
        expect.objectContaining({
          reviewId: reviewByThisGroup.reviewId,
        }),
      ]);
    });
  });

  describe('when there is a single evaluation by the selected group', () => {
    describe('when there are article versions', () => {
      let result: DocmapModel;
      const articleDate = arbitraryDate();
      const ports = {
        ...defaultPorts,
        findVersionsForArticleDoi: (): ReturnType<FindVersionsForArticleDoi> => TO.some([
          {
            source: new URL(arbitraryUri()),
            occurredAt: articleDate,
            version: 1,
          },
        ]),
      };

      beforeEach(async () => {
        result = await pipe(
          { articleId, groupId: indexedGroupId },
          generateDocmapViewModel(ports),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it('includes the date of the last published article version', async () => {
        expect(result.inputPublishedDate).toStrictEqual(O.some(articleDate));
      });
    });

    describe('when there are no article versions', () => {
      let result: Docmap;
      const ports = {
        ...defaultPorts,
        findVersionsForArticleDoi: (): ReturnType<FindVersionsForArticleDoi> => TO.none,
      };

      beforeEach(async () => {
        result = await pipe(
          { articleId, groupId: indexedGroupId },
          docmap(ports),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it.skip('doesn\'t include the article publication date', async () => {
        expect(result.steps['_:b0'].inputs).toStrictEqual([
          expect.not.objectContaining({ published: expect.anything }),
        ]);
      });
    });
  });

  describe('when the group cant be retrieved', () => {
    it.todo('returns not-found');
  });
});
