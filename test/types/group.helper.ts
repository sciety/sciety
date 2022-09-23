import { arbitraryGroupId } from './group-id.helper';
import { DescriptionPath } from '../../src/commands/description-path-codec';
import { Group } from '../../src/types/group';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';

export const arbitraryGroup = (): Group => ({
  id: arbitraryGroupId(),
  name: arbitraryString(),
  avatarPath: arbitraryWord(),
  descriptionPath: arbitraryWord() as DescriptionPath,
  shortDescription: arbitraryString(),
  homepage: arbitraryUri(),
  slug: arbitraryWord(),
});
