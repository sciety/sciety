import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { FindVersionsForArticleDoi, hardcodedNcrcArticle } from '../../src/docmaps/hardcoded-ncrc-article';
import * as DE from '../../src/types/data-error';
import * as GroupId from '../../src/types/group-id';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

const defaultPorts = {
  fetchReview: () => TE.right({ url: new URL(arbitraryUri()) }),
  findReviewsForArticleDoi: () => T.of(
    [
      {
        reviewId: arbitraryReviewId(),
        groupId: arbitraryGroupId(),
        occurredAt: arbitraryDate(),
      },
    ],
  ),
  findVersionsForArticleDoi: (): ReturnType<FindVersionsForArticleDoi> => TO.some([
    {
      source: new URL(arbitraryUri()),
      occurredAt: arbitraryDate(),
      version: 1,
    },
  ]),
  getGroup: () => TO.some({
    id: arbitraryGroupId(),
    homepage: arbitraryUri(),
    avatarPath: arbitraryString(),
    shortDescription: arbitraryString(),
    descriptionPath: arbitraryString(),
    name: arbitraryString(),
  }),
};

describe('hardcoded-ncrc-article', () => {
  it('includes the article id', async () => {
    const articleId = arbitraryDoi();
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => T.of(
        [
          {
            reviewId: arbitraryReviewId(),
            groupId: GroupId.fromValidatedString('316db7d9-88cc-4c26-b386-f067e0f56334'),
            occurredAt: arbitraryDate(),
          },
        ],
      ),
    };
    const docmap = await hardcodedNcrcArticle(ports)(articleId.value, [articleId])();

    expect(docmap).toStrictEqual(E.right(expect.objectContaining({
      id: expect.stringContaining(articleId.value),
    })));
  });

  it('includes the publisher properties', async () => {
    const groupId = arbitraryGroupId();
    const homepage = arbitraryUri();
    const articleId = arbitraryDoi();
    const avatarPath = arbitraryString();
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => T.of(
        [
          {
            reviewId: arbitraryReviewId(),
            groupId,
            occurredAt: arbitraryDate(),
          },
        ],
      ),
      getGroup: () => TO.some({
        id: groupId,
        homepage,
        avatarPath,
        shortDescription: arbitraryString(),
        descriptionPath: arbitraryString(),
        name: arbitraryString(),
      }),
    };
    const docmap = await hardcodedNcrcArticle(ports)(articleId.value, [articleId])();

    expect(docmap).toStrictEqual(E.right(expect.objectContaining({
      publisher: {
        id: homepage,
        logo: expect.stringContaining(avatarPath),
        homepage,
        account: {
          id: expect.stringContaining(groupId),
          service: 'https://sciety.org',
        },
      },
    })));
  });

  it('sets created to the date of the first evaluation', async () => {
    const evaluationDate = arbitraryDate();
    const articleId = arbitraryDoi();
    const ports = {
      ...defaultPorts,
      findReviewsForArticleDoi: () => T.of(
        [
          {
            reviewId: arbitraryReviewId(),
            groupId: arbitraryGroupId(),
            occurredAt: evaluationDate,
          },
        ],
      ),
    };

    const docmap = await hardcodedNcrcArticle(ports)(articleId.value, [articleId])();

    expect(docmap).toStrictEqual(E.right(expect.objectContaining({
      created: evaluationDate.toISOString(),
    })));
  });

  describe('in the first step', () => {
    it('assertions are always empty', async () => {
      const articleId = arbitraryDoi();
      const docmap = await hardcodedNcrcArticle(defaultPorts)(articleId.value, [articleId])();

      expect(docmap).toStrictEqual(E.right(expect.objectContaining({
        steps: expect.objectContaining({
          '_:b0': expect.objectContaining({
            assertions: [],
          }),
        }),
      })));
    });

    describe('the inputs', () => {
      it('include the uri and doi', async () => {
        const articleId = arbitraryDoi();
        const docmap = await hardcodedNcrcArticle(defaultPorts)(articleId.value, [articleId])();

        expect(docmap).toStrictEqual(E.right(expect.objectContaining({
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
        const articleId = arbitraryDoi();
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
        const docmap = await hardcodedNcrcArticle(ports)(articleId.value, [articleId])();

        expect(docmap).toStrictEqual(E.right(expect.objectContaining({
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
      });
    });

    describe('the only action', () => {
      describe('the only participant', () => {
        it('is anonymous', async () => {
          const articleId = arbitraryDoi();
          const docmap = await hardcodedNcrcArticle(defaultPorts)(articleId.value, [articleId])();

          expect(docmap).toStrictEqual(E.right(expect.objectContaining({
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
          const articleId = arbitraryDoi();
          const docmap = await hardcodedNcrcArticle(defaultPorts)(articleId.value, [articleId])();

          expect(docmap).toStrictEqual(E.right(expect.objectContaining({
            steps: expect.objectContaining({
              '_:b0': expect.objectContaining({
                actions: [expect.objectContaining({
                  outputs: [expect.objectContaining({
                    type: 'review-article',
                  })],
                })],
              }),
            }),
          })));
        });

        it('includes the published date of the evaluation', async () => {
          const articleId = arbitraryDoi();
          const evaluationDate = arbitraryDate();
          const ports = {
            ...defaultPorts,
            findReviewsForArticleDoi: () => T.of(
              [
                {
                  reviewId: arbitraryReviewId(),
                  groupId: arbitraryGroupId(),
                  occurredAt: evaluationDate,
                },
              ],
            ),
          };

          const docmap = await hardcodedNcrcArticle(ports)(articleId.value, [articleId])();

          expect(docmap).toStrictEqual(E.right(expect.objectContaining({
            steps: expect.objectContaining({
              '_:b0': expect.objectContaining({
                actions: [expect.objectContaining({
                  outputs: [expect.objectContaining({
                    published: evaluationDate,
                  })],
                })],
              }),
            }),
          })));
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
                  groupId: arbitraryGroupId(),
                  occurredAt: arbitraryDate(),
                },
              ],
            ),
            fetchReview: () => TE.right({ url: new URL(sourceUrl) }),
          };
          const articleId = arbitraryDoi();
          const docmap = await hardcodedNcrcArticle(ports)(articleId.value, [articleId])();

          expect(docmap).toStrictEqual(E.right(expect.objectContaining({
            steps: expect.objectContaining({
              '_:b0': expect.objectContaining({
                actions: [expect.objectContaining({
                  outputs: [expect.objectContaining({
                    content: expect.arrayContaining([{
                      type: 'web-page',
                      url: sourceUrl,
                    }]),
                  })],
                })],
              }),
            }),
          })));
        });

        it('includes the url to the evaluation on sciety', async () => {
          const evaluationId = arbitraryReviewId();
          const ports = {
            ...defaultPorts,
            findReviewsForArticleDoi: () => T.of(
              [
                {
                  reviewId: evaluationId,
                  groupId: arbitraryGroupId(),
                  occurredAt: arbitraryDate(),
                },
              ],
            ),
          };
          const articleId = arbitraryDoi();
          const docmap = await hardcodedNcrcArticle(ports)(articleId.value, [articleId])();

          expect(docmap).toStrictEqual(E.right(expect.objectContaining({
            steps: expect.objectContaining({
              '_:b0': expect.objectContaining({
                actions: [expect.objectContaining({
                  outputs: [expect.objectContaining({
                    content: expect.arrayContaining([{
                      type: 'web-page',
                      url: `https://sciety.org/articles/activity/${articleId.value}#${evaluationId}`,
                    }]),
                  })],
                })],
              }),
            }),
          })));
        });
      });
    });
  });

  describe('when the doi is not in the docmap index', () => {
    it.skip('returns not-found', async () => {
      const index = [];
      const articleId = arbitraryDoi().value;
      const docmap = await hardcodedNcrcArticle(defaultPorts)(articleId, index)();

      expect(docmap).toStrictEqual(E.left(DE.notFound));
    });
  });

  describe('when the group cant be retrieved', () => {
    it.todo('returns 500');
  });

  describe('when the versions cant be retrieved from preprint server', () => {
    it('returns unavailable', async () => {
      const articleId = arbitraryDoi();
      const ports = {
        ...defaultPorts,
        findVersionsForArticleDoi: (): ReturnType<FindVersionsForArticleDoi> => TO.none,
      };
      const docmap = await hardcodedNcrcArticle(ports)(articleId.value, [articleId])();

      expect(docmap).toStrictEqual(E.left(DE.unavailable));
    });
  });
});
