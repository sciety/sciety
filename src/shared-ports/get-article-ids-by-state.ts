import * as IO from 'fp-ts/IO';
import { ArticleIdsByState } from '../add-article-to-elife-subject-area-list';

export type GetArticleIdsByState = (myqueryparameter: string) => IO.IO<ArticleIdsByState>;
