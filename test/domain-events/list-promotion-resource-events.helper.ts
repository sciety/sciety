import { EventOfType, constructEvent } from '../../src/domain-events';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

export const arbitraryListPromotionCreatedEvent = (): EventOfType<'ListPromotionCreated'> => constructEvent('ListPromotionCreated')({
  byGroup: arbitraryGroupId(),
  listId: arbitraryListId(),
});
