import { identity, pipe } from 'fp-ts/function';
import { Json } from 'fp-ts/Json';
import { Queries } from '../../../read-models';
import { constructViewModel } from './construct-view-model';

const renderAsJson = identity;

export const statusGroups = (queries: Queries): Json => pipe(
  constructViewModel(queries),
  renderAsJson,
);
