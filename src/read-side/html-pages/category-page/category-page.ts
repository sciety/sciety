import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { paramsCodec } from './params';
import { renderAsHtml } from './render-as-html/render-as-html';
import { DependenciesForViews } from '../../dependencies-for-views';
import { constructErrorPageViewModel } from '../construct-error-page-view-model';
import { ConstructPage } from '../construct-page';
import { decodePageParams } from '../decode-page-params';

export const categoryPage = (dependencies: DependenciesForViews): ConstructPage => (input) => pipe(
  input,
  decodePageParams(dependencies.logger, paramsCodec),
  TE.fromEither,
  TE.chain(constructViewModel(dependencies)),
  TE.mapLeft(constructErrorPageViewModel),
  TE.map(renderAsHtml),
);
