import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Docmap, docmap, FindVersionsForArticleDoi } from '../../../src/docmaps/docmap/docmap';
import { generateDocmapViewModel } from '../../../src/docmaps/docmap/generate-docmap-view-model';
import { GroupId } from '../../../src/types/group-id';
import { ReviewId } from '../../../src/types/review-id';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../helpers';
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

const expectOutputs = (ex: Record<string, unknown>) => E.right(expect.objectContaining({
  steps: expect.objectContaining({
    '_:b0': expect.objectContaining({
      actions: [expect.objectContaining({
        outputs: [expect.objectContaining(ex)],
      })],
    }),
  }),
}));

describe('generate-docmap-view-model', () => {
  it.skip('includes the article id', async () => {
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => TE.right([review(indexedGroupId, arbitraryDate())]),
    };
    const result = await pipe(
      { articleId, groupId: indexedGroupId, updated: arbitraryDate() },
      generateDocmapViewModel(ports),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(result).toStrictEqual(expect.objectContaining({ articleId }));
  });

  it.skip('includes the group', async () => {
    const homepage = arbitraryUri();
    const avatarPath = arbitraryString();
    const name = arbitraryString();
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => TE.right([review(indexedGroupId, arbitraryDate())]),
      getGroup: () => TO.some({
        ...arbitraryGroup(),
        id: indexedGroupId,
        homepage,
        avatarPath,
        name,
      }),
    };
    const result = await docmap(ports)({ articleId, groupId: indexedGroupId })();

    expect(result).toStrictEqual(E.right(expect.objectContaining({
      publisher: {
        id: homepage,
        name,
        logo: expect.stringContaining(avatarPath),
        homepage,
        account: {
          id: expect.stringContaining(indexedGroupId),
          service: 'https://sciety.org',
        },
      },
    })));
  });

  it.skip('handles all article servers', async () => {
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
    await docmap(ports)({ articleId, groupId: indexedGroupId })();

    expect(findVersionsForArticleDoi).toHaveBeenCalledWith(articleId, server);
  });

  describe('when there are multiple evaluations by the selected group', () => {
    const earlierDate = new Date('1900');
    const laterDate = new Date('2000');
    const reviews = [
      review(indexedGroupId, earlierDate),
      review(indexedGroupId, laterDate),
    ];

    beforeEach(async () => {
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right(reviews),
      };
      await pipe(
        docmap(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it.todo('returns all evaluations, checking all values that the type dictates');
  });

  describe('when there are no evaluations by the selected group', () => {
    it.skip('returns not-found', async () => {
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right([]),
      };
      const result = await docmap(ports)({ articleId, groupId: indexedGroupId })();

      expect(result).toStrictEqual(E.left('not-found'));
    });
  });

  describe('when there are evaluations by other groups', () => {
    it.skip('only uses the evaluation by the selected group', async () => {
      const earlierDate = new Date('1900');
      const laterDate = new Date('2000');
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right(
          [
            review(arbitraryGroupId(), earlierDate),
            review(indexedGroupId, laterDate),
          ],
        ),
      };

      const result = await docmap(ports)({ articleId, groupId: indexedGroupId })();

      expect(result).toStrictEqual(expectOutputs({
        published: laterDate,
      }));
    });
  });

  describe('when there is a single evaluation by the selected group', () => {
    describe('when there are article versions', () => {
      let result: Docmap;
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
          docmap(ports),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it.skip('include the article publication date', async () => {
        expect(result.steps['_:b0'].inputs).toStrictEqual([
          expect.objectContaining({ published: articleDate }),
        ]);
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
