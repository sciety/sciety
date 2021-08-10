import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { docmap, FindVersionsForArticleDoi } from '../../src/docmaps/docmap';
import * as DE from '../../src/types/data-error';
import { GroupId } from '../../src/types/group-id';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

const indexedGroupId = arbitraryGroupId();
const articleId = arbitraryDoi();

const review = (groupId: GroupId, date: Date) => ({
  reviewId: arbitraryReviewId(),
  groupId,
  occurredAt: date,
});

const defaultPorts = {
  fetchReview: () => TE.right({ url: new URL(arbitraryUri()) }),
  findReviewsForArticleDoi: () => T.of([review(indexedGroupId, arbitraryDate())]),
  findVersionsForArticleDoi: (): ReturnType<FindVersionsForArticleDoi> => TO.some([
    {
      source: new URL(arbitraryUri()),
      occurredAt: arbitraryDate(),
      version: 1,
    },
  ]),
  getGroup: () => TO.some({
    id: indexedGroupId,
    homepage: arbitraryUri(),
    avatarPath: arbitraryString(),
    shortDescription: arbitraryString(),
    descriptionPath: arbitraryString(),
    name: arbitraryString(),
  }),
  fetchArticle: () => TE.right({ server: 'biorxiv' as const }),
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

describe('docmap', () => {
  it('includes the article id', async () => {
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => T.of([review(indexedGroupId, arbitraryDate())]),
    };
    const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

    expect(result).toStrictEqual(E.right(expect.objectContaining({
      id: expect.stringContaining(articleId.value),
    })));
  });

  it('includes the publisher properties', async () => {
    const homepage = arbitraryUri();
    const avatarPath = arbitraryString();
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => T.of([review(indexedGroupId, arbitraryDate())]),
      getGroup: () => TO.some({
        id: indexedGroupId,
        homepage,
        avatarPath,
        shortDescription: arbitraryString(),
        descriptionPath: arbitraryString(),
        name: arbitraryString(),
      }),
    };
    const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

    expect(result).toStrictEqual(E.right(expect.objectContaining({
      publisher: {
        id: homepage,
        logo: expect.stringContaining(avatarPath),
        homepage,
        account: {
          id: expect.stringContaining(indexedGroupId),
          service: 'https://sciety.org',
        },
      },
    })));
  });

  it('sets created to the date of the first evaluation', async () => {
    const evaluationDate = arbitraryDate();
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => T.of([review(indexedGroupId, evaluationDate)]),
    };

    const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

    expect(result).toStrictEqual(E.right(expect.objectContaining({
      created: evaluationDate.toISOString(),
    })));
  });

  describe('when there are multiple evaluations by the selected group', () => {
    it('only uses the earliest evaluation', async () => {
      const earlierDate = new Date('1900');
      const laterDate = new Date('2000');
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => T.of(
          [
            review(indexedGroupId, earlierDate),
            review(indexedGroupId, laterDate),
          ],
        ),
      };
      const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

      expect(result).toStrictEqual(expectOutputs({
        published: earlierDate,
      }));
    });
  });

  describe('when there are no evaluations by the selected group', () => {
    it('returns not-found', async () => {
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => T.of([]),
      };
      const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

      expect(result).toStrictEqual(E.left('not-found'));
    });
  });

  describe('when there are evaluations by other groups', () => {
    it('only uses the evaluation by the selected group', async () => {
      const earlierDate = new Date('1900');
      const laterDate = new Date('2000');
      const ports = {
        ...defaultPorts,
        findReviewsForArticleDoi: () => T.of(
          [
            review(arbitraryGroupId(), earlierDate),
            review(indexedGroupId, laterDate),
          ],
        ),
      };

      const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

      expect(result).toStrictEqual(expectOutputs({
        published: laterDate,
      }));
    });
  });

  describe('when there is a single evaluation by the selected group', () => {
    describe('in the first step', () => {
      it('assertions are always empty', async () => {
        const result = await docmap(defaultPorts)(articleId, [articleId], indexedGroupId)();

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
          const result = await docmap(defaultPorts)(articleId, [articleId], indexedGroupId)();

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

        it('include the article publication date', async () => {
          const articleDate = arbitraryDate();
          const findVersionsForArticleDoi = jest.fn().mockImplementation(
            (): ReturnType<FindVersionsForArticleDoi> => TO.some([
              {
                source: new URL(arbitraryUri()),
                occurredAt: articleDate,
                version: 1,
              },
            ]),
          );
          const server = 'biorxiv' as const;
          const ports = {
            ...defaultPorts,
            findVersionsForArticleDoi,
            fetchArticle: () => TE.right({ server }),
          };
          const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

          expect(result).toStrictEqual(E.right(expect.objectContaining({
            steps: expect.objectContaining({
              '_:b0': expect.objectContaining({
                inputs: [expect.objectContaining(
                  {
                    published: articleDate,
                  },
                )],
              }),
            }),
          })));
          expect(findVersionsForArticleDoi).toHaveBeenCalledWith(articleId, server);
        });
      });

      describe('the only action', () => {
        describe('the only participant', () => {
          it('is anonymous', async () => {
            const result = await docmap(defaultPorts)(articleId, [articleId], indexedGroupId)();

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
            const result = await docmap(defaultPorts)(articleId, [articleId], indexedGroupId)();

            expect(result).toStrictEqual(expectOutputs({
              type: 'review-article',
            }));
          });

          it('includes the published date of the evaluation', async () => {
            const evaluationDate = arbitraryDate();
            const ports = {
              ...defaultPorts,
              findReviewsForArticleDoi: () => T.of([review(indexedGroupId, evaluationDate)]),
            };

            const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

            expect(result).toStrictEqual(expectOutputs({
              published: evaluationDate,
            }));
          });

          it('includes the url to the original evaluation source', async () => {
            const evaluationId = arbitraryReviewId();
            const sourceUrl = arbitraryUri();
            const ports = {
              ...defaultPorts,
              findReviewsForArticleDoi: () => T.of(
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
            const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

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
              findReviewsForArticleDoi: () => T.of(
                [
                  {
                    reviewId: evaluationId,
                    groupId: indexedGroupId,
                    occurredAt: arbitraryDate(),
                  },
                ],
              ),
            };
            const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

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

  describe('when the doi is not in the docmap index', () => {
    it('returns not-found', async () => {
      const result = await docmap(defaultPorts)(articleId, [], arbitraryGroupId())();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });

  describe('when the group cant be retrieved', () => {
    it.todo('returns 500');
  });

  describe('when the versions cant be retrieved from preprint server', () => {
    it('returns unavailable', async () => {
      const ports = {
        ...defaultPorts,
        findVersionsForArticleDoi: (): ReturnType<FindVersionsForArticleDoi> => TO.none,
      };
      const result = await docmap(ports)(articleId, [articleId], indexedGroupId)();

      expect(result).toStrictEqual(E.left(DE.unavailable));
    });
  });
});
