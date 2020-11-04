import { URL } from 'url';
import { Maybe } from 'true-myth';
import createGetFollowedEditorialCommunitiesFromIds, { GetEditorialCommunity } from './get-followed-editorial-communities-from-ids';
import createProjectFollowedEditorialCommunityIds, { GetAllEvents } from './project-followed-editorial-community-ids';
import createRenderFollowList from './render-follow-list';
import createRenderFollowToggle, { Follows } from './render-follow-toggle';
import createRenderFollowedEditorialCommunity from './render-followed-editorial-community';
import createRenderHeader, { GetUserDetails } from './render-header';
import createRenderPage, { RenderPage } from './render-page';
import EditorialCommunityId from '../types/editorial-community-id';
import { User } from '../types/user';
import toUserId from '../types/user-id';

type FetchEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
  avatar: URL;
}>>;

type Ports = {
  getEditorialCommunity: FetchEditorialCommunity,
  getAllEvents: GetAllEvents,
  follows: Follows,
  getUserDetails: GetUserDetails,
};

interface Params {
  id?: string;
  user: Maybe<User>;
}

type UserPage = (params: Params) => ReturnType<RenderPage>;

export default (ports: Ports): UserPage => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap()
  );

  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  const renderFollowedEditorialCommunity = createRenderFollowedEditorialCommunity(renderFollowToggle);
  const getFollowedEditorialCommunities = createGetFollowedEditorialCommunitiesFromIds(
    createProjectFollowedEditorialCommunityIds(ports.getAllEvents),
    getEditorialCommunity,
  );
  const renderHeader = createRenderHeader(ports.getUserDetails);
  const renderFollowList = createRenderFollowList(
    getFollowedEditorialCommunities,
    renderFollowedEditorialCommunity,
  );
  const renderPage = createRenderPage(
    renderHeader,
    renderFollowList,
  );

  return async (params) => {
    const userId = toUserId(params.id ?? '');
    const viewingUserId = params.user.map((value) => value.id);

    return renderPage(userId, viewingUserId);
  };
};
