import { Group } from '../../types/group';

const constructGroupSubPageHref = (subPagePathSegment: string) => (group: Pick<Group, 'slug'>): string => `/groups/${group.slug}${subPagePathSegment}`;

export const groupSubPagePathSpecification = (subPagePathSegment: string): string => `/groups/:slug${subPagePathSegment}`;

export const constructGroupPagePath = {
  home: {
    spec: groupSubPagePathSpecification(''),
    href: constructGroupSubPageHref(''),
  },
  about: {
    spec: groupSubPagePathSpecification('/about'),
    href: constructGroupSubPageHref('/about'),
  },
  management: {
    spec: groupSubPagePathSpecification('/management'),
    href: constructGroupSubPageHref('/management'),
  },
  followers: {
    spec: groupSubPagePathSpecification('/followers'),
    href: constructGroupSubPageHref('/followers'),
  },
  lists: {
    spec: groupSubPagePathSpecification('/lists'),
    href: constructGroupSubPageHref('/lists'),
  },
};
