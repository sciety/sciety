import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { pipe } from 'fp-ts/function';
import * as DE from '../../types/data-error';
import { constructViewModel } from './construct-view-model';
import { renderAsHtml, toErrorPage } from './render-as-html';
import { HtmlPage } from '../html-page';
import { ErrorPageBodyViewModel } from '../../types/render-page-error';
import { Dependencies } from './construct-view-model/dependencies';
import { DoiFromString } from '../../types/article-id';
import { userIdCodec } from '../../types/user-id';

const articlePageParams = t.type({
  doi: DoiFromString,
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
