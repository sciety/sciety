import { identity, pipe } from 'fp-ts/function';
import { Json } from 'fp-ts/Json';
import { Queries } from '../../shared-read-models';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const constructViewModel = (queries: Queries) => ({
  groups: {
    total: 23,
  },
});

const renderAsJson = identity;

export const applicationStatus = (queries: Queries): Json => pipe(
  constructViewModel(queries),
  renderAsJson,
);
