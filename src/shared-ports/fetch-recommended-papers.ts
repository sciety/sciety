import * as TE from 'fp-ts/TaskEither';
import { Doi } from '../types/doi';
import * as DE from '../types/data-error';

type RecommendedPapers = ReadonlyArray<{
  articleId: Doi,
  title: string,
  authors: ReadonlyArray<{
    name: string,
  }>,
}>;

export type FetchRecommendedPapers = (doi: Doi)
=> TE.TaskEither<DE.DataError, RecommendedPapers>;
