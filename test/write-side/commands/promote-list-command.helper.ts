import { PromoteListCommand } from '../../../src/write-side/commands';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';

export const arbitraryPromoteListCommand = (): PromoteListCommand => ({
  forGroup: arbitraryGroupId(),
  listId: arbitraryListId(),
});
