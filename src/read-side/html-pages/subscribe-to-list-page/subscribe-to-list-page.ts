import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { renderAsHtml, toErrorPage } from './render-as-html';
import { ConstructPage } from '../../../html-pages/construct-page';
import { Queries } from '../../../read-models';

export const subscribeToListPage = (dependencies: Queries): ConstructPage => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(toErrorPage, renderAsHtml),
);
