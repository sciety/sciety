import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Doi } from '../../../types/doi';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../../types/html-fragment';
import { DoiFromString } from '../../../types/codecs/DoiFromString';

const relatedArticlesCodec = t.array(t.type({
  articleId: DoiFromString,
  title: t.string,
  authors: t.array(t.string),
}));

type RelatedArticles = t.TypeOf<typeof relatedArticlesCodec>;

const hardcodedRelatedArticles: RelatedArticles = [
  {
    articleId: new Doi('10.1101/2023.03.24.534097'),
    title: 'Replication fork plasticity upon replication stress requires rapid nuclear actin polymerization',
    authors: ['Maria Dilia Palumbieri', 'C. Merigliano'],
  },
  {
    articleId: new Doi('10.1101/2023.03.21.533689'),
    title: 'An endocytic myosin essential for plasma membrane invagination powers motility against resistance',
    authors: ['Ross T A Pedersen', 'Aaron Snoberger'],
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const constructRelatedArticles = (doi: Doi) => pipe(
  hardcodedRelatedArticles,
  RA.map((relatedArticle) => ({
    articleId: relatedArticle.articleId,
    title: sanitise(toHtmlFragment(relatedArticle.title)),
    authors: O.some(relatedArticle.authors),
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  })),
);
