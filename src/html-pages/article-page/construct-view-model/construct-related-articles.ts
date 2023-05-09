import { formatValidationErrors } from 'io-ts-reporters';
import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../../../types/doi';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../../types/html-fragment';
import { DoiFromString } from '../../../types/codecs/DoiFromString';
import { ArticleViewModel } from '../../../shared-components/article-card';
import { Logger } from '../../../shared-ports';

type Ports = {
  logger: Logger,
};

const semanticScholarRecommendedPapersResponseCodec = t.type({
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SemanticScholarRecommendedPapersResponse = t.TypeOf<typeof semanticScholarRecommendedPapersResponseCodec>;

const hardcodedResponse: unknown = {
  recommendedPapers: [
    {
      externalIds: {
        DOI: '10.1101/2023.03.24.534097',
      },
      title: 'Replication fork plasticity upon replication stress requires rapid nuclear actin polymerization',
      authors: [{ name: 'Maria Dilia Palumbieri' }, { name: 'C. Merigliano' }],
    },
    {
      externalIds: {
        DOI: '10.1101/2023.03.21.533689',
      },
      title: 'An endocytic myosin essential for plasma membrane invagination powers motility against resistance',
      authors: [{ name: 'Ross T A Pedersen' }, { name: 'Aaron Snoberger' }],
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchRecommendedPapers = (doi: Doi, ports: Ports) => pipe(
  hardcodedResponse,
  semanticScholarRecommendedPapersResponseCodec.decode,
  TE.fromEither,
  TE.mapLeft((errors) => {
    ports.logger(
      'error',
      'Failed to decode Semantic scholar response',
      { errors: formatValidationErrors(errors) },
    );
    return errors;
  }),
);

export const constructRelatedArticles = (
  doi: Doi, ports: Ports,
): TO.TaskOption<ReadonlyArray<ArticleViewModel>> => pipe(
  fetchRecommendedPapers(doi, ports),
  TE.map((response) => response.recommendedPapers),
  TE.map(RA.map((recommendedPaper) => ({
    articleId: recommendedPaper.externalIds.DOI,
    title: sanitise(toHtmlFragment(recommendedPaper.title)),
    authors: pipe(
      recommendedPaper.authors,
      RA.map((author) => author.name),
      O.some,
    ),
    latestVersionDate: O.none,
    latestActivityAt: O.none,
    evaluationCount: 0,
    listMembershipCount: 0,
  }))),
  TO.fromTaskEither,
);
