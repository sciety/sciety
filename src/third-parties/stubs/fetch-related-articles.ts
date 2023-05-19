import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { ExternalQueries } from '../../types/external-queries';

const hardcodedResponse = [
  {
    articleId: new Doi('10.1101/2023.03.24.534097'),
    title: sanitise(toHtmlFragment('Replication fork plasticity upon replication stress requires rapid nuclear actin polymerization')),
    authors: O.some(['Maria Dilia Palumbieri', 'C. Merigliano']),
  },
  {
    articleId: new Doi('10.1101/2023.03.21.533689'),
    title: sanitise(toHtmlFragment('An endocytic myosin essential for plasma membrane invagination powers motility against resistance')),
    authors: O.some(['Ross T A Pedersen', 'Aaron Snoberger']),
  },
];

export const fetchRelatedArticles: ExternalQueries['fetchRelatedArticles'] = () => TE.right(hardcodedResponse);
