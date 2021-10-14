import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { docmap } from '../../../src/docmaps/docmap/docmap';
import { Docmap } from '../../../src/docmaps/docmap/docmap-type';
import { FindVersionsForArticleDoi } from '../../../src/docmaps/docmap/generate-docmap-view-model';
import { toDocmap } from '../../../src/docmaps/docmap/to-docmap';
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

const expectOutputs = (ex: Record<string, unknown>) => E.right(expect.objectContaining({
  steps: expect.objectContaining({
    '_:b0': expect.objectContaining({
      actions: [expect.objectContaining({
        outputs: [expect.objectContaining(ex)],
      })],
    }),
  }),
}));

describe('to-docmap', () => {
  it('includes the article id in the url used as the docmap id', () => {
    const result = toDocmap({
      articleId,
      group: arbitraryGroup(),
      inputPublishedDate: O.none,
      evaluations: [{
        sourceUrl: new URL(arbitraryUri()),
        reviewId: arbitraryReviewId(),
        occurredAt: arbitraryDate(),
      }],
    });

    expect(result.id).toStrictEqual(expect.stringContaining(articleId.value));
  });

  it('includes the publisher properties', async () => {
    const group = arbitraryGroup();

    const result = toDocmap({
      articleId,
      group,
      inputPublishedDate: O.none,
      evaluations: [{
        sourceUrl: new URL(arbitraryUri()),
        reviewId: arbitraryReviewId(),
        occurredAt: arbitraryDate(),
      }],
    });

    expect(result.publisher).toStrictEqual(expect.objectContaining({
      id: group.homepage,
      name: group.name,
      logo: expect.stringContaining(group.avatarPath),
      homepage: group.homepage,
      account: {
        id: expect.stringContaining(group.id),
        service: 'https://sciety.org',
      },
    }));
  });

  it('sets created to the date of the first evaluation', async () => {
    const earlierDate = new Date('1900');
    const laterDate = new Date('2000');
    const result = toDocmap({
      articleId,
      group: arbitraryGroup(),
      inputPublishedDate: O.none,
      evaluations: [
        {
          sourceUrl: new URL(arbitraryUri()),
          reviewId: arbitraryReviewId(),
          occurredAt: earlierDate,
        },
        {
          sourceUrl: new URL(arbitraryUri()),
          reviewId: arbitraryReviewId(),
          occurredAt: laterDate,
        },
      ],
    });

    expect(result.created).toStrictEqual(earlierDate.toISOString());
  });

  it('sets updated to the date of the last evaluation', async () => {
    const earlierDate = new Date('1900');
    const laterDate = new Date('2000');
    const result = toDocmap({
      articleId,
      group: arbitraryGroup(),
      inputPublishedDate: O.none,
      evaluations: [
        {
          sourceUrl: new URL(arbitraryUri()),
          reviewId: arbitraryReviewId(),
          occurredAt: earlierDate,
        },
        {
          sourceUrl: new URL(arbitraryUri()),
          reviewId: arbitraryReviewId(),
          occurredAt: laterDate,
        },
      ],
    });

    expect(result.updated).toStrictEqual(laterDate.toISOString());
  });

  describe('when there are multiple evaluations by the selected group', () => {
    const earlierDate = new Date('1900');
    const laterDate = new Date('2000');
    const reviews = [
      review(indexedGroupId, earlierDate),
      review(indexedGroupId, laterDate),
    ];
    const firstStep = '_:b0';

    let result: Docmap;

    beforeEach(async () => {
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => TE.right(reviews),
      };
      result = await pipe(
        docmap(ports)({ articleId, groupId: indexedGroupId }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns a single step', () => {
      expect(Object.keys(result.steps)).toHaveLength(1);
    });

    it('with a single action', () => {
      expect(result.steps[firstStep].actions).toHaveLength(1);
    });

    it('with a single anonymous person actor as the participants', () => {
      expect(result.steps[firstStep].actions[0].participants).toStrictEqual([{
        actor: {
          name: 'anonymous',
          type: 'person',
        },
        role: 'peer-reviewer',
      }]);
    });

    it('with one output per evaluation', () => {
      expect(result.steps[firstStep].actions[0].outputs).toHaveLength(reviews.length);
    });

    it('each output links to the evaluation on sciety', () => {
      const contentValues = pipe(
        result.steps[firstStep].actions[0].outputs,
        RA.map((output) => output.content),
      );

      expect(contentValues[0]).toStrictEqual(
        expect.arrayContaining([{
          type: 'web-page',
          url: `https://sciety.org/articles/activity/${articleId.value}#${reviews[0].reviewId}`,
        }]),
      );
      expect(contentValues[1]).toStrictEqual(
        expect.arrayContaining([{
          type: 'web-page',
          url: `https://sciety.org/articles/activity/${articleId.value}#${reviews[1].reviewId}`,
        }]),
      );
    });

    it('each output links to the original source of the evaluation', () => {
      const contentValues = pipe(
        result.steps[firstStep].actions[0].outputs,
        RA.map((output) => output.content),
      );

      expect(contentValues[0]).toStrictEqual(
        expect.arrayContaining([{
          type: 'web-page',
          url: `https://reviews.example.com/${reviews[0].reviewId}`,
        }]),
      );
      expect(contentValues[1]).toStrictEqual(
        expect.arrayContaining([{
          type: 'web-page',
          url: `https://reviews.example.com/${reviews[1].reviewId}`,
        }]),
      );
    });

    it('each output has published date of corresponding evaluation', () => {
      expect(pipe(
        result.steps[firstStep].actions[0].outputs,
        RA.map((output) => output.published),
      )).toStrictEqual([earlierDate, laterDate]);
    });

    it('output content is always `review-article`', () => {
      expect(pipe(
        result.steps[firstStep].actions[0].outputs,
        RA.map((output) => output.type),
        RA.uniq(S.Eq),
      )).toStrictEqual(['review-article']);
    });
  });

  describe('when there is a single evaluation by the selected group', () => {
    describe('in the first step', () => {
      it('assertions are empty', async () => {
        const result = await docmap(defaultPorts)({ articleId, groupId: indexedGroupId })();

        expect(result).toStrictEqual(E.right(expect.objectContaining({
          steps: expect.objectContaining({
            '_:b0': expect.objectContaining({
              assertions: [],
            }),
          }),
        })));
      });

      describe('the inputs', () => {
        it('include the uri and doi', async () => {
          const result = await docmap(defaultPorts)({ articleId, groupId: indexedGroupId })();

          expect(result).toStrictEqual(E.right(expect.objectContaining({
            steps: expect.objectContaining({
              '_:b0': expect.objectContaining({
                inputs: [expect.objectContaining(
                  {
                    doi: articleId.value,
                    url: expect.stringContaining(articleId.value),
                  },
                )],
              }),
            }),
          })));
        });

        describe('when there is an input published date', () => {
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

          it('is included as the published date', async () => {
            expect(result.steps['_:b0'].inputs).toStrictEqual([
              expect.objectContaining({ published: articleDate }),
            ]);
          });
        });

        describe('when there is no input published date', () => {
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

          it('there is no published date', async () => {
            expect(result.steps['_:b0'].inputs).toStrictEqual([
              expect.not.objectContaining({ published: expect.anything }),
            ]);
          });
        });
      });

      describe('the only action', () => {
        describe('the only participant', () => {
          it('is anonymous', async () => {
            const result = await docmap(defaultPorts)({ articleId, groupId: indexedGroupId })();

            expect(result).toStrictEqual(E.right(expect.objectContaining({
              steps: expect.objectContaining({
                '_:b0': expect.objectContaining({
                  actions: [expect.objectContaining({
                    participants: [
                      { actor: { name: 'anonymous', type: 'person' }, role: 'peer-reviewer' },
                    ],
                  })],
                }),
              }),
            })));
          });
        });

        describe('the only output', () => {
          it('is always of type review-article', async () => {
            const result = await docmap(defaultPorts)({ articleId, groupId: indexedGroupId })();

            expect(result).toStrictEqual(expectOutputs({
              type: 'review-article',
            }));
          });

          it('includes the published date of the evaluation', async () => {
            const evaluationDate = arbitraryDate();
            const ports = {
              ...defaultPorts,
              findReviewsForArticleDoi: () => TE.right([review(indexedGroupId, evaluationDate)]),
            };

            const result = await docmap(ports)({ articleId, groupId: indexedGroupId })();

            expect(result).toStrictEqual(expectOutputs({
              published: evaluationDate,
            }));
          });

          it('includes the url to the original evaluation source', async () => {
            const evaluationId = arbitraryReviewId();
            const sourceUrl = arbitraryUri();
            const ports = {
              ...defaultPorts,
              findReviewsForArticleDoi: () => TE.right(
                [
                  {
                    reviewId: evaluationId,
                    groupId: indexedGroupId,
                    occurredAt: arbitraryDate(),
                  },
                ],
              ),
              fetchReview: () => TE.right({ url: new URL(sourceUrl) }),
            };
            const result = await docmap(ports)({ articleId, groupId: indexedGroupId })();

            expect(result).toStrictEqual(expectOutputs({
              content: expect.arrayContaining([{
                type: 'web-page',
                url: sourceUrl,
              }]),
            }));
          });

          it('includes the url to the evaluation on sciety', async () => {
            const evaluationId = arbitraryReviewId();
            const ports = {
              ...defaultPorts,
              findReviewsForArticleDoi: () => TE.right(
                [
                  {
                    reviewId: evaluationId,
                    groupId: indexedGroupId,
                    occurredAt: arbitraryDate(),
                  },
                ],
              ),
            };
            const result = await docmap(ports)({ articleId, groupId: indexedGroupId })();

            expect(result).toStrictEqual(expectOutputs({
              content: expect.arrayContaining([{
                type: 'web-page',
                url: `https://sciety.org/articles/activity/${articleId.value}#${evaluationId}`,
              }]),
            }));
          });
        });
      });
    });
  });
});
