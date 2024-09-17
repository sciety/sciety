import { getExpressionsWithNoAssociatedSnapshot } from './get-expressions-with-no-associated-snapshot';
import { getPapersEvaluatedByGroup } from './get-papers-evaluated-by-group';
import { handleEvent, initialState } from './handle-event';
import { papersEvaluatedByGroupStatus } from './papers-evaluated-by-group-status';
import * as GID from '../../types/group-id';

export const papersEvaluatedByGroup = {
  queries: {
    getPapersEvaluatedByGroup,
    getExpressionsWithNoAssociatedSnapshot,
    papersEvaluatedByGroupStatus,
  },
  initialState,
  handleEvent: handleEvent([GID.fromValidatedString('4d6a8908-22a9-45c8-bd56-3c7140647709')]),
};

export { byLastEvaluatedAt } from './get-papers-evaluated-by-group';
