import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error.js';
import { ArticleId } from '../types/article-id.js';
import { ArticleDetails } from '../third-parties/external-queries.js';

export type FetchArticle = (doi: ArticleId) => TE.TaskEither<DE.DataError, ArticleDetails>;
