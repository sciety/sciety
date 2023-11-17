import { AddGroupCommand } from '../../../src/write-side/commands/index.js';
import { arbitraryString, arbitraryWord } from '../../helpers.js';
import { arbitraryDescriptionPath } from '../../types/description-path.helper.js';
import { arbitraryGroupId } from '../../types/group-id.helper.js';

export const arbitraryAddGroupCommand = (): AddGroupCommand => ({
  groupId: arbitraryGroupId(),
  name: arbitraryString(),
  shortDescription: arbitraryString(),
  homepage: arbitraryString(),
  avatarPath: arbitraryString(),
  descriptionPath: arbitraryDescriptionPath(),
  slug: arbitraryWord(),
});
