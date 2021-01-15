import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Remarkable } from 'remarkable';
import { Maybe } from 'true-myth';
import createGetMostRecentEvents, { GetAllEvents } from './get-most-recent-events';
import createProjectFollowerIds from './project-follower-ids';
import createRenderDescription, { GetEditorialCommunityDescription, RenderDescription } from './render-description';
import createRenderFeed, { RenderFeed } from './render-feed';
import createRenderFollowToggle, { Follows } from './render-follow-toggle';
import createRenderFollowers from './render-followers';
import createRenderPage, { RenderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import createRenderSummaryFeedItem, { GetActor } from '../shared-components/render-summary-feed-item';
import createRenderSummaryFeedList from '../shared-components/render-summary-feed-list';
import { EditorialCommunity } from '../types/editorial-community';
import EditorialCommunityId from '../types/editorial-community-id';
import { FetchExternalArticle } from '../types/fetch-external-article';
import { toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

type FetchStaticFile = (filename: string) => T.Task<string>;

type FetchEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<Maybe<EditorialCommunity>>;

interface Ports {
  fetchArticle: FetchExternalArticle;
  fetchStaticFile: FetchStaticFile;
  getEditorialCommunity: FetchEditorialCommunity;
  getAllEvents: GetAllEvents;
  follows: Follows,
}

const buildRenderDescription = (ports: Ports): RenderDescription => {
  const converter = new Remarkable({ html: true });
  const getEditorialCommunityDescription: GetEditorialCommunityDescription = (editorialCommunity) => async () => {
    const markdown = await ports.fetchStaticFile(`editorial-communities/${editorialCommunity.descriptionPath}`)();
    return converter.render(markdown);
  };
  return createRenderDescription(getEditorialCommunityDescription);
};

const buildRenderFeed = (ports: Ports): RenderFeed => {
  const getActorAdapter: GetActor = (id) => async () => {
    const editorialCommunity = (await ports.getEditorialCommunity(id)()).unsafelyUnwrap();
    return {
      name: editorialCommunity.name,
      imageUrl: editorialCommunity.avatar.toString(),
      url: `/editorial-communities/${id.value}`,
    };
  };
  const getEventsAdapter = createGetMostRecentEvents(ports.getAllEvents, 20);
  const renderSummaryFeedItem = createRenderSummaryFeedItem(getActorAdapter, ports.fetchArticle);
  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  return createRenderFeed(
    getEventsAdapter,
    createRenderSummaryFeedList(renderSummaryFeedItem),
    renderFollowToggle,
  );
};

export interface Params {
  id?: string;
  user: O.Option<User>;
}

type EditorialCommunityPage = (params: Params) => ReturnType<RenderPage>;

export default (ports: Ports): EditorialCommunityPage => {
  const renderDescription = buildRenderDescription(ports);
  const renderFeed = buildRenderFeed(ports);
  const renderFollowers = createRenderFollowers(createProjectFollowerIds(ports.getAllEvents));

  const renderPage = createRenderPage(
    renderPageHeader,
    renderDescription,
    renderFeed,
    renderFollowers,
  );
  return (params) => {
    const editorialCommunityId = new EditorialCommunityId(params.id ?? '');
    const userId = pipe(
      params.user,
      O.map((user) => user.id),
    );

    return pipe(
      editorialCommunityId,
      ports.getEditorialCommunity,
      T.chain((editorialCommunityMaybe) => (
        editorialCommunityMaybe.mapOrElse(() => TE.left({
          type: 'not-found',
          message: toHtmlFragment(`Editorial community id '${editorialCommunityId.value}' not found`),
        }),
        (editorialCommunity) => renderPage(editorialCommunity, userId))
      )),
    );
  };
};
