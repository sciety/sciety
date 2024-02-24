import * as O from 'fp-ts/Option';
import { arbitraryGroupId } from './group-id.helper.js';
import { Group } from '../../src/types/group.js';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../helpers.js';
import { arbitraryDescriptionPath } from './description-path.helper.js';

export const arbitraryGroup = (): Group => ({
  id: arbitraryGroupId(),
  name: arbitraryString(),
  avatarPath: arbitraryWord(),
  descriptionPath: arbitraryDescriptionPath(),
  shortDescription: arbitraryString(),
  homepage: arbitraryUri(),
  slug: arbitraryWord(),
  largeLogoPath: O.none,
});
