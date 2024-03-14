import { AddGroupCommand } from '../../../src/write-side/commands';
import { arbitraryString, arbitraryWord } from '../../helpers';
import { arbitraryDescriptionPath } from '../../types/description-path.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

export const arbitraryAddGroupCommand = (): AddGroupCommand => ({
  groupId: arbitraryGroupId(),
  name: arbitraryString(),
  shortDescription: arbitraryString(),
  homepage: arbitraryString(),
  avatarPath: arbitraryString(),
  descriptionPath: arbitraryDescriptionPath(),
  slug: arbitraryWord(),
  largeLogoPath: arbitraryString(),
});
