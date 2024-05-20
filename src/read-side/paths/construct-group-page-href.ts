import { Group } from '../../types/group';

export const constructGroupPageHref = (group: Group): string => `/groups/${group.slug}`;

export const groupPagePathSpecification = '/groups/:slug';

export const groupSubPagePathSpecification = (subPagePathSegment: string): string => `${groupPagePathSpecification}/${subPagePathSegment}`;
