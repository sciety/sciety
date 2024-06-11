import { Group } from '../../types/group';

export const constructGroupPageHref = (group: Group): string => `/groups/${group.slug}`;

const constructGroupManagementPageHref = (group: Group): string => `/groups/${group.slug}/management`;

const constructGroupAboutPageHref = (group: Group): string => `/groups/${group.slug}/about`;

export const groupPagePathSpecification = '/groups/:slug';

export const groupSubPagePathSpecification = (subPagePathSegment: string): string => `${groupPagePathSpecification}/${subPagePathSegment}`;

export const constructGroupPagePath = {
  about: {
    spec: groupSubPagePathSpecification('about'),
    href: constructGroupAboutPageHref,
  },
  management: {
    spec: groupSubPagePathSpecification('management'),
    href: constructGroupManagementPageHref,
  },
};
