import { Group } from '../../types/group';

export const publisherAccountId = (group: Group): string => `https://sciety.org/groups/${group.slug}`;
