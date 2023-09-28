import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { ArticleDetails } from '../third-parties/external-queries';

export type FetchArticle = (doi: Doi) => TE.TaskEither<DE.DataError, ArticleDetails>;
