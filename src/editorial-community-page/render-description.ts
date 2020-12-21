import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderDescription = (editorialCommunityId: EditorialCommunityId) => T.Task<HtmlFragment>;

export type GetEditorialCommunityDescription = (editorialCommunityId: EditorialCommunityId) => T.Task<string>;

export default (
  getEditorialCommunityDescription: GetEditorialCommunityDescription,
): RenderDescription => flow(
  getEditorialCommunityDescription,
  T.map((desc) => `
    <section>
      ${desc}
    </section>
  `),
  T.map(toHtmlFragment),
);
