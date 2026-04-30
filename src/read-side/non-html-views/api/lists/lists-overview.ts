import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { NonHtmlView } from '../../non-html-view';
import { renderAsJson } from '../render-as-json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const listsOverview = (dependencies: DependenciesForViews): NonHtmlView => () => pipe(
  {
    tbd: 0,
  },
  renderAsJson,
  TE.right,
);
