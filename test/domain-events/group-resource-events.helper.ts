import { arbitraryString, arbitraryUri } from '../helpers';
import { EventOfType, constructEvent } from '../../src/domain-events';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryDescriptionPath } from '../types/description-path.helper';

export const arbitraryGroupJoinedEvent = (): EventOfType<'GroupJoined'> => constructEvent('GroupJoined')(
  {
    groupId: arbitraryGroupId(),
    name: arbitraryString(),
    avatarPath: arbitraryUri(),
    descriptionPath: arbitraryDescriptionPath(),
    shortDescription: arbitraryString(),
    homepage: arbitraryString(),
    slug: arbitraryString(),
    largeLogoPath: arbitraryString(),
  },
);

export const arbitraryGroupDetailsUpdatedEvent = (): EventOfType<'GroupDetailsUpdated'> => constructEvent('GroupDetailsUpdated')({
  groupId: arbitraryGroupId(),
  name: undefined,
  avatarPath: undefined,
  descriptionPath: undefined,
  largeLogoPath: undefined,
  shortDescription: undefined,
  homepage: undefined,
  slug: undefined,
});
