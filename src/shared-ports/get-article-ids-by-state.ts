import * as IO from 'fp-ts/IO';
import { ArticleIdsByState } from '../add-article-to-elife-subject-area-list';

export type GetArticleIdsByState = () => IO.IO<ArticleIdsByState>;
