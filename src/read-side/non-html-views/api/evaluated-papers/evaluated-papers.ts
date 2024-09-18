import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { constructViewModel } from './construct-view-model';
import { GroupIdFromStringCodec } from '../../../../types/group-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { NonHtmlView } from '../../non-html-view';
import { toNonHtmlViewError } from '../../non-html-view-error';
import { renderAsJson } from '../render-as-json';

const paramsCodec = t.strict({
  groupId: GroupIdFromStringCodec,
});

export const evaluatedPapers = (dependencies: DependenciesForViews): NonHtmlView => (params) => pipe(
  params,
  paramsCodec.decode,
  E.map(({ groupId }) => groupId),
  E.map(constructViewModel(dependencies)),
  E.map(renderAsJson),
  E.mapLeft(() => toNonHtmlViewError('Cannot understand the params')),
  T.of,
);
