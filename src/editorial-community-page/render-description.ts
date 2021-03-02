import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { Group } from '../types/group';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderDescription = (group: Group) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;

type GetEditorialCommunityDescription = (group: Group) => TE.TaskEither<'not-found' | 'unavailable', string>;

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
