/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArticleActivity } from '../types/article-activity';
import { Doi } from '../types/doi';

export type GetActivityForDois = (articleIds: ReadonlyArray<Doi>) => ReadonlyArray<ArticleActivity>;
