import { Group } from '../../../../types/group';

type ObjectWithGroupSlug = Pick<Group, 'slug'>;

export const publisherAccountId = (group: ObjectWithGroupSlug): string => `https://sciety.org/groups/${group.slug}`;
