import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { FindVersionsForArticleDoi, hardcodedNcrcArticle } from '../../src/docmaps/hardcoded-ncrc-article';
import * as DE from '../../src/types/data-error';
import * as GroupId from '../../src/types/group-id';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../helpers';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

const defaultPorts = {
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
    const docmap = await hardcodedNcrcArticle(ports)(articleId.value)();

    expect(docmap).toStrictEqual(E.right(expect.objectContaining({
      id: expect.stringContaining(articleId.value),
    })));
  });

  it('includes the publisher properties', async () => {
    const groupId = arbitraryGroupId();
    const homepage = arbitraryUri();
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
    const docmap = await hardcodedNcrcArticle(ports)(arbitraryDoi().value)();

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

  it('includes the uri and doi in the inputs to the first step', async () => {
    const articleId = arbitraryDoi().value;
    const docmap = await hardcodedNcrcArticle(defaultPorts)(articleId)();

    expect(docmap).toStrictEqual(E.right(expect.objectContaining({
      steps: expect.objectContaining({
        '_:b0': expect.objectContaining({
          inputs: [expect.objectContaining(
            {
              doi: articleId,
              url: expect.stringContaining(articleId),
            },
          )],
        }),
      }),
    })));
  });

  it('includes the article publication date in the inputs to the first step', async () => {
    const articleId = arbitraryDoi().value;
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
    const docmap = await hardcodedNcrcArticle(ports)(articleId)();

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

  it('includes the published date of the evaluation in the outputs of the actions of the first step', async () => {
    const articleId = arbitraryDoi().value;
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

    const docmap = await hardcodedNcrcArticle(ports)(articleId)();

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

  describe('when the group cant be retrieved', () => {
    it('returns not-found', async () => {
      const articleId = arbitraryDoi().value;
      const ports = {
        ...defaultPorts,
        getGroup: () => TO.none,
      };
      const docmap = await hardcodedNcrcArticle(ports)(articleId)();

      expect(docmap).toStrictEqual(E.left(DE.notFound));
    });
  });
});
