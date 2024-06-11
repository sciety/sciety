import { Group } from '../../types/group';

export const constructGroupPageHref = (group: Group): string => `/groups/${group.slug}`;

const constructGroupSubPageHref = (subPagePathSegment: string) => (group: Group): string => `/groups/${group.slug}/${subPagePathSegment}`;

export const groupPagePathSpecification = '/groups/:slug';

export const groupSubPagePathSpecification = (subPagePathSegment: string): string => `${groupPagePathSpecification}/${subPagePathSegment}`;

export const constructGroupPagePath = {
  about: {
    spec: groupSubPagePathSpecification('about'),
    href: constructGroupSubPageHref('about'),
  },
  management: {
    spec: groupSubPagePathSpecification('management'),
    href: constructGroupSubPageHref('management'),
  },
  followers: {
    spec: groupSubPagePathSpecification('followers'),
    href: constructGroupSubPageHref('followers'),
  },
};
