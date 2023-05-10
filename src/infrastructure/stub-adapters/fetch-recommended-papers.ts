import * as TE from 'fp-ts/TaskEither';
import { FetchRecommendedPapers } from '../../shared-ports/fetch-recommended-papers';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';

const hardcodedResponse = [
  {
    articleId: new Doi('10.1101/2023.03.24.534097'),
    title: sanitise(toHtmlFragment('Replication fork plasticity upon replication stress requires rapid nuclear actin polymerization')),
    authors: [{ name: 'Maria Dilia Palumbieri' }, { name: 'C. Merigliano' }],
  },
  {
    articleId: new Doi('10.1101/2023.03.21.533689'),
    title: sanitise(toHtmlFragment('An endocytic myosin essential for plasma membrane invagination powers motility against resistance')),
    authors: [{ name: 'Ross T A Pedersen' }, { name: 'Aaron Snoberger' }],
  },
];

export const fetchRecommendedPapers: FetchRecommendedPapers = () => TE.right(hardcodedResponse);
