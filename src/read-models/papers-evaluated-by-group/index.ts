import { getExpressionsWithNoAssociatedSnapshot } from './get-expressions-with-no-associated-snapshot';
import { getPapersEvaluatedByGroup } from './get-papers-evaluated-by-group';
import { handleEvent, initialState } from './handle-event';
import { papersEvaluatedByGroupStatus } from './papers-evaluated-by-group-status';
import { Logger } from '../../logger';
import * as GID from '../../types/group-id';

export const queries = {
  getPapersEvaluatedByGroup,
  getExpressionsWithNoAssociatedSnapshot,
  papersEvaluatedByGroupStatus,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
export const constructPapersEvaluatedByGroup = (logger: Logger) => ({
  queries,
  initialState,
  handleEvent: handleEvent([GID.fromValidatedString('4d6a8908-22a9-45c8-bd56-3c7140647709')]),
});

export { byLastEvaluatedAt, byRepresentative } from './get-papers-evaluated-by-group';
