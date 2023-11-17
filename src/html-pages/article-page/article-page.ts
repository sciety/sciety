import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error.js';
import { constructViewModel } from './construct-view-model/index.js';
import { renderAsHtml, toErrorPage } from './render-as-html/index.js';
import { HtmlPage } from '../html-page.js';
import { ErrorPageBodyViewModel } from '../../types/render-page-error.js';
import { Dependencies } from './construct-view-model/dependencies.js';
import { articleIdCodec } from '../../types/article-id.js';
import { userIdCodec } from '../../types/user-id.js';

const articlePageParams = t.type({
  doi: articleIdCodec,
  user: tt.optionFromNullable(t.type({ id: userIdCodec })),
});

type ArticlePage = (dependencies: Dependencies) => (params: unknown) => TE.TaskEither<ErrorPageBodyViewModel, HtmlPage>;

export const articlePage: ArticlePage = (dependencies) => (params) => pipe(
  params,
  articlePageParams.decode,
  TE.fromEither,
  TE.mapLeft(() => DE.notFound),
  TE.chain(constructViewModel(dependencies)),
  TE.bimap(toErrorPage, renderAsHtml),
);
