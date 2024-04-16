import { Json } from 'fp-ts/Json';
import { identity, pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { Queries } from '../../../read-models';

const renderAsJson = identity;

export const statusGroups = (queries: Queries): Json => pipe(
  constructViewModel(queries),
  renderAsJson,
);
