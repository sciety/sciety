import { Json } from 'fp-ts/Json';
import { identity, pipe } from 'fp-ts/function';
import { constructViewModel } from './construct-view-model';
import { Queries } from '../../../../read-models';

const renderAsJson = identity;

export const groups = (queries: Queries): Json => pipe(
  constructViewModel(queries),
  renderAsJson,
);
