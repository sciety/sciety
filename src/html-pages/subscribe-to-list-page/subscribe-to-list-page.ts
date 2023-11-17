import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { renderAsHtml, toErrorPage } from './render-as-html/index.js';
import { Queries } from '../../read-models/index.js';
import { constructViewModel } from './construct-view-model/index.js';
import { ConstructPage } from '../construct-page.js';

export const subscribeToListPage = (dependencies: Queries): ConstructPage => (params) => pipe(
  params,
  constructViewModel(dependencies),
  TE.bimap(toErrorPage, renderAsHtml),
);
