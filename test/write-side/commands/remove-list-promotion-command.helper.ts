import { RemoveListPromotionCommand } from '../../../src/write-side/commands';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';

export const arbitraryRemoveListPromotionCommand = (): RemoveListPromotionCommand => ({
  forGroup: arbitraryGroupId(),
  listId: arbitraryListId(),
});
