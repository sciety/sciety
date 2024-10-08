import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { Group } from '../../types/group';

const constructGroupSubPageHref = (subPagePathSegment: string) => (group: Pick<Group, 'slug'>): string => `/groups/${group.slug}${subPagePathSegment}`;

const groupSubPagePathSpecification = (subPagePathSegment: string): string => `/groups/:slug${subPagePathSegment}`;

const pageSuffixes: Record<string, string> = {
  home: '',
  about: '/about',
  management: '/management',
  followers: '/followers',
  lists: '/lists',
  /** @deprecated */
  feed: '/feed',
};

export const constructGroupPagePath = pipe(
  pageSuffixes,
  R.map((suffix) => ({
    spec: groupSubPagePathSpecification(suffix),
    href: constructGroupSubPageHref(suffix),
  })),
);
