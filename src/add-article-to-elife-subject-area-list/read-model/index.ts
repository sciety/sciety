import { handleEvent, initialState } from './handle-event';
import { queries } from './queries';

export { elifeGroupId } from './data';
export { getArticleIdsByState } from './get-article-ids-by-state';
export { ReadModel, initialState, handleEvent } from './handle-event';
export { getCorrespondingListId } from './get-corresponding-list-id';
export { queries, Queries } from './queries';

export const readmodel = {
  initialState,
  handleEvent,
  queries,
};
