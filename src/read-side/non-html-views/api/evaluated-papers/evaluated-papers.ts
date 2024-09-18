import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import * as GID from '../../../../types/group-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { NonHtmlView } from '../../non-html-view';
import { renderAsJson } from '../render-as-json';

export const evaluatedPapers = (dependencies: DependenciesForViews): NonHtmlView => () => pipe(
  GID.fromValidatedString('4d6a8908-22a9-45c8-bd56-3c7140647709'),
  constructViewModel(dependencies),
  renderAsJson,
  TE.right,
);
