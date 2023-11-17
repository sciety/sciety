import { identity, pipe } from 'fp-ts/function';
import { Json } from 'fp-ts/Json';
import { Queries } from '../../read-models/index.js';
import { constructViewModel } from './construct-view-model.js';

const renderAsJson = identity;

export const applicationStatus = (queries: Queries): Json => pipe(
  constructViewModel(queries),
  renderAsJson,
);
