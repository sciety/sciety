import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { renderAsHtml } from './render-as-html';
import { Queries } from '../../../read-models';
import { ConstructPage } from '../construct-page';
import { renderErrorPage } from '../render-error-page';

export const subscribeToListPage = (dependencies: Queries): ConstructPage => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(renderErrorPage, renderAsHtml),
);
