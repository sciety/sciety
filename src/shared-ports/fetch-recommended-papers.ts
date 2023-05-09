import * as t from 'io-ts';
import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../types/doi';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as DE from '../types/data-error';

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

type SemanticScholarRecommendedPapersResponse = t.TypeOf<typeof semanticScholarRecommendedPapersResponseCodec>;

export type FetchRecommendedPapers = (doi: Doi)
=> TE.TaskEither<DE.DataError, SemanticScholarRecommendedPapersResponse>;
