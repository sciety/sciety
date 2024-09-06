import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { ArticleId } from '../../../../types/article-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { NonHtmlView } from '../../non-html-view';
import { NonHtmlViewRepresentation, toNonHtmlViewRepresentation } from '../../non-html-view-representation';

const replacer = (_key: string, value: unknown): unknown => {
  if (value instanceof Set) {
    return Array.from(value.values());
  }
  if (value instanceof ArticleId) {
    return value.value;
  }
  return value;
};

const renderAsJson = (viewModel: unknown): NonHtmlViewRepresentation => pipe(
  viewModel,
  (object) => JSON.stringify(object, replacer),
  (representation) => toNonHtmlViewRepresentation(representation, 'application/json'),
);

export const applicationStatus = (dependencies: DependenciesForViews): NonHtmlView => () => pipe(
  constructViewModel(dependencies),
  renderAsJson,
  TE.right,
);
