import * as O from 'fp-ts/Option';
import { arbitraryDescriptionPath } from './description-path.helper';
import { arbitraryGroupId } from './group-id.helper';
import { Group } from '../../src/types/group';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers';

export const arbitraryGroup = (): Group => ({
  id: arbitraryGroupId(),
  name: arbitraryString(),
  avatarPath: arbitraryWord(),
  descriptionPath: arbitraryDescriptionPath(),
  shortDescription: arbitraryString(),
  homepage: arbitraryUri(),
  slug: arbitraryWord(),
  largeLogoPath: O.some(arbitraryString()),
});
