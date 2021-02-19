import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { EditorialCommunity } from '../types/editorial-community';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderDescription = (editorialCommunity: EditorialCommunity) => TE.TaskEither<never, HtmlFragment>;

export type GetEditorialCommunityDescription = (editorialCommunity: EditorialCommunity) => T.Task<string>;

export const renderDescription = (
  getEditorialCommunityDescription: GetEditorialCommunityDescription,
): RenderDescription => flow(
  getEditorialCommunityDescription,
  T.map((desc) => `
    <section>
      ${desc}
    </section>
  `),
  T.map(toHtmlFragment),
  TE.rightTask,
);
