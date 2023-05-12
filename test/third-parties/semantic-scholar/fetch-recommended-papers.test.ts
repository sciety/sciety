import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { RelatedArticles } from '../../../src/shared-ports/fetch-related-articles';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryWord } from '../../helpers';
import {
  Ports,
  fetchRecommendedPapers,
} from '../../../src/third-parties/semantic-scholar/fetch-recommended-papers';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { Doi } from '../../../src/types/doi';

const articleTitle = arbitrarySanitisedHtmlFragment();
const articleAuthors = [arbitraryString(), arbitraryString()];

const arbitraryRecommendedPaper = (articleId: Doi) => ({
  externalIds: {
    DOI: articleId.value,
  },
  title: articleTitle.toString(),
  authors: [
    {
      name: articleAuthors[0],
    },
    {
      name: articleAuthors[1],
    },
  ],
});

describe('fetch-recommended-papers', () => {
  describe.each([
    ['biorxiv or medrxiv', new Doi('10.1101/2023.01.15.524119')],
    ['biorxiv or medrxiv', new Doi('10.1101/452326')],
    ['research square', new Doi('10.21203/rs.3.rs-2200020/v3')],
    ['scielo preprints', new Doi('10.1590/SciELOPreprints.3429')],
    // ['osf', new Doi('10.31234/osf.io/td68z')],
  ])('when a response contains a supported article (%s %s)', (_, supportedArticleId) => {
    it('translates to RelatedArticles type', async () => {
      const ports: Ports = {
        logger: dummyLogger,
        getJson: async () => ({
          recommendedPapers: [
            arbitraryRecommendedPaper(supportedArticleId),
          ],
        }),
      };
      const result = await pipe(
        arbitraryArticleId(),
        fetchRecommendedPapers(ports),
        TE.getOrElseW(shouldNotBeCalled),
      )();
      const expected: RelatedArticles = [{
        articleId: supportedArticleId,
        title: articleTitle,
        authors: O.some(articleAuthors),
      }];

      expect(result).toStrictEqual(expected);
    });
  });

  describe.each([
    ['10.26434/not-a-supported-doi'],
    ['10.1590/2176-9451.19.4.027-029.ebo'],
    ['10.1101/cshperspect.a041248'],
    ['10.1101/gad.314351.118'],
    ['10.1101/gr.277335.122'],
    ['10.1101/lm.045724.117'],
  ])('when a response contains an unsupported article (%s)', (unsupportedArticleId) => {
    const supportedBiorxivArticleId = new Doi('10.1101/123');

    it('removes the unsupported article', async () => {
      const ports: Ports = {
        logger: dummyLogger,
        getJson: async () => ({
          recommendedPapers: [
            {
              externalIds: {
                DOI: supportedBiorxivArticleId.value,
              },
              title: articleTitle.toString(),
              authors: [
                {
                  name: articleAuthors[0],
                },
                {
                  name: articleAuthors[1],
                },
              ],
            },
            {
              externalIds: {
                DOI: unsupportedArticleId,
              },
              title: arbitraryString(),
              authors: [
                {
                  name: arbitraryWord(),
                },
              ],
            },
          ],
        }),
      };
      const result = await pipe(
        arbitraryArticleId(),
        fetchRecommendedPapers(ports),
        TE.getOrElseW(shouldNotBeCalled),
      )();
      const expected: RelatedArticles = [expect.objectContaining({
        articleId: supportedBiorxivArticleId,
      })];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('when we cannot access Semantic Scholar', () => {
    it.todo('returns a left');
  });

  describe('when we cannot decode the response', () => {
    it.todo('returns a left');
  });

  describe('when the response contains an article with no DOI', () => {
    const response = {
      recommendedPapers: [
        {
          externalIds: {},
          title: articleTitle.toString(),
          authors: [
            {
              name: articleAuthors[0],
            },
            {
              name: articleAuthors[1],
            },
          ],
        },
      ],
    };

    const ports: Ports = {
      logger: dummyLogger,
      getJson: async () => (response),
    };

    it('ignores such articles', async () => {
      const result = await pipe(
        arbitraryArticleId(),
        fetchRecommendedPapers(ports),
        TE.getOrElseW(shouldNotBeCalled),
      )();

      expect(result).toStrictEqual([]);
    });
  });
});
