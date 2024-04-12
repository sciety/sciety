import { Group } from '../types/group';

export const groupPageHref = (group: Group): string => `/groups/${group.slug}`;

export const groupPagePathSpecification = '/groups/:slug';
