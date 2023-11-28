import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';
import { ArticleId } from '../types/article-id';
import { ArticleDetails } from '../third-parties/external-queries';

export type FetchPaperExpression = (doi: ArticleId) => TE.TaskEither<DE.DataError, ArticleDetails>;
