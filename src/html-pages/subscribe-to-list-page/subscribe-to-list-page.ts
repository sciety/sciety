import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { renderAsHtml, toErrorPage } from './render-as-html';
import { Queries } from '../../read-models';
import { constructViewModel } from './construct-view-model';
import { ConstructPage } from '../construct-page';

export const subscribeToListPage = (dependencies: Queries): ConstructPage => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(toErrorPage, renderAsHtml),
);
