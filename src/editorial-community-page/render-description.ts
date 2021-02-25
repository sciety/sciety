import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { EditorialCommunity } from '../types/editorial-community';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderDescription = (editorialCommunity: EditorialCommunity) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;

type GetEditorialCommunityDescription = (editorialCommunity: EditorialCommunity) => TE.TaskEither<'not-found' | 'unavailable', string>;

export const renderDescription = (
  getEditorialCommunityDescription: GetEditorialCommunityDescription,
): RenderDescription => flow(
  getEditorialCommunityDescription,
  TE.map(flow(
    (desc) => `
      <section>
        ${desc}
      </section>
    `,
    toHtmlFragment,
  )),
);
