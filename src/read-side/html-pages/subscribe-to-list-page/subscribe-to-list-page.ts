import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { renderAsHtml } from './render-as-html';
import { Queries } from '../../../read-models';
import { constructErrorPageViewModel } from '../construct-error-page-view-model';
import { ConstructPage } from '../construct-page';

export const subscribeToListPage = (dependencies: Queries): ConstructPage => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(constructErrorPageViewModel, renderAsHtml),
);
