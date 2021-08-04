import { arbitraryGroupId } from './group-id.helper';
import { Group } from '../../src/types/group';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';

export const arbitraryGroup = (): Group => ({
  id: arbitraryGroupId(),
  name: arbitraryString(),
  avatarPath: arbitraryWord(),
  descriptionPath: arbitraryWord(),
  shortDescription: arbitraryString(),
  homepage: arbitraryUri(),
});
