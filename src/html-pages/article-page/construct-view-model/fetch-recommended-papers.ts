import { formatValidationErrors } from 'io-ts-reporters';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../../../types/doi';
import { DoiFromString } from '../../../types/codecs/DoiFromString';
import { Logger } from '../../../shared-ports';

export type Ports = {
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
export const fetchRecommendedPapers = (ports: Ports) => (doi: Doi) => pipe(
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
