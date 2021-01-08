import * as T from 'fp-ts/lib/Task';
import { flow } from 'fp-ts/lib/function';
import { EditorialCommunity } from '../types/editorial-community';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderDescription = (editorialCommunity: EditorialCommunity) => T.Task<HtmlFragment>;

export type GetEditorialCommunityDescription = (editorialCommunity: EditorialCommunity) => T.Task<string>;

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
