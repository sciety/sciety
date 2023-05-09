import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Doi } from '../../../types/doi';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../../types/html-fragment';
import { DoiFromString } from '../../../types/codecs/DoiFromString';

const semanticScholarRecommendedPapersCodec = t.type({
  recommendedPapers: t.array(t.type({
    externalIds: t.type({
      DOI: DoiFromString,
    }),
    title: t.string,
    authors: t.array(t.type({
      name: t.string,
    })),
  })),
});

type RelatedArticles = t.TypeOf<typeof semanticScholarRecommendedPapersCodec>;

const hardcodedRelatedArticles: RelatedArticles = {
  recommendedPapers: [
    {
      externalIds: {
        DOI: new Doi('10.1101/2023.03.24.534097'),
      },
      title: 'Replication fork plasticity upon replication stress requires rapid nuclear actin polymerization',
      authors: [{ name: 'Maria Dilia Palumbieri' }, { name: 'C. Merigliano' }],
    },
    {
      externalIds: {
        DOI: new Doi('10.1101/2023.03.21.533689'),
      },
      title: 'An endocytic myosin essential for plasma membrane invagination powers motility against resistance',
      authors: [{ name: 'Ross T A Pedersen' }, { name: 'Aaron Snoberger' }],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructRelatedArticles = (doi: Doi) => pipe(
  hardcodedRelatedArticles,
  (response) => response.recommendedPapers,
  RA.map((relatedArticle) => ({
    articleId: relatedArticle.externalIds.DOI,
    title: sanitise(toHtmlFragment(relatedArticle.title)),
    authors: pipe(
      relatedArticle.authors,
      RA.map((author) => author.name),
      O.some,
    ),
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  })),
);
