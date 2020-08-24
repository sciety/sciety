import createGetFollowedEditorialCommunitiesFromIds, { GetEditorialCommunity } from './get-followed-editorial-communities-from-ids';
import createProjectFollowedEditorialCommunityIds, { GetAllEvents } from './project-followed-editorial-community-ids';
import createRenderFollowToggle, { GetFollowList } from './render-follow-toggle';
import createRenderFollowedEditorialCommunity from './render-followed-editorial-community';
import createRenderPage from './render-page';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { User } from '../types/user';
import userId from '../types/user-id';

type Ports = {
  editorialCommunities: EditorialCommunityRepository,
  getAllEvents: GetAllEvents,
  getFollowList: GetFollowList,
};

interface Params {
  userId?: string;
  user: User;
}

type RenderPage = (params: Params) => Promise<string>;

export default (ports: Ports): RenderPage => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap()
  );

  const renderFollowToggle = createRenderFollowToggle(ports.getFollowList);
  const renderFollowedEditorialCommunity = createRenderFollowedEditorialCommunity(renderFollowToggle);
  const getFollowedEditorialCommunities = createGetFollowedEditorialCommunitiesFromIds(
    createProjectFollowedEditorialCommunityIds(ports.getAllEvents),
    getEditorialCommunity,
  );
  const renderPage = createRenderPage(getFollowedEditorialCommunities, renderFollowedEditorialCommunity);
  return async (params) => renderPage(userId(params.userId ?? ''), params.user.id);
};
