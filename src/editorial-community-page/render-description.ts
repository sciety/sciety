import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { EditorialCommunity } from '../types/editorial-community';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderDescription = (editorialCommunity: EditorialCommunity) => T.Task<HtmlFragment>;

export type GetEditorialCommunityDescription = (editorialCommunity: EditorialCommunity) => T.Task<string>;

export const createRenderDescription = (
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
