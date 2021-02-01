import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { isHttpError } from 'http-errors';
import { NOT_FOUND } from 'http-status-codes';
import { EditorialCommunity } from '../types/editorial-community';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

export type RenderPage = (
  editorialCommunity: EditorialCommunity,
  userId: O.Option<UserId>
) => TE.TaskEither<RenderPageError, {
  title: string,
  content: HtmlFragment,
}>;

type RenderPageHeader = (editorialCommunity: EditorialCommunity) => HtmlFragment;

type RenderDescription = (editorialCommunity: EditorialCommunity) => T.Task<HtmlFragment>;

type RenderFeed = (editorialCommunity: EditorialCommunity, userId: O.Option<UserId>) => T.Task<HtmlFragment>;

type Components = {
  header: HtmlFragment,
  description: HtmlFragment,
  feed: string,
  followers: HtmlFragment,
};

const render = (components: Components): string => `
  <div class="sciety-grid sciety-grid--editorial-community">
    ${components.header}
    <div class="editorial-community-page-description">
    ${components.description}
    </div>
    <div class="editorial-community-page-side-bar">
      ${components.followers}
      ${components.feed}
    </div>
  </div>
`;

export const createRenderPage = (
  renderPageHeader: RenderPageHeader,
  renderDescription: RenderDescription,
  renderFeed: RenderFeed,
  renderFollowers: (editorialCommunityId: EditorialCommunityId) => T.Task<HtmlFragment>,
): RenderPage => (
  (editorialCommunity, userId) => {
    try {
      return pipe(
        {
          header: T.of(renderPageHeader(editorialCommunity)),
          description: renderDescription(editorialCommunity),
          followers: renderFollowers(editorialCommunity.id),
          feed: renderFeed(editorialCommunity, userId),
        },
        sequenceS(T.task),
        T.map((components) => ({
          title: editorialCommunity.name,
          content: pipe(components, render, toHtmlFragment),
        })),
        TE.rightTask,
      );
    // TODO: push Results further down
    } catch (error: unknown) {
      if (isHttpError(error) && error.status === NOT_FOUND) {
        return TE.left({
          type: 'not-found',
          message: toHtmlFragment(`Editorial community id '${editorialCommunity.id.value}' not found`),
        });
      }

      return TE.left({
        type: 'unavailable',
        message: toHtmlFragment(`Editorial community id '${editorialCommunity.id.value}' unavailable`),
      });
    }
  }
);
