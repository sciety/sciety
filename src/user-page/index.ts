import { Maybe, Result } from 'true-myth';
import createGetFollowedEditorialCommunitiesFromIds, { GetEditorialCommunity } from './get-followed-editorial-communities-from-ids';
import createProjectFollowedEditorialCommunityIds, { GetAllEvents } from './project-followed-editorial-community-ids';
import createRenderFollowToggle, { Follows } from './render-follow-toggle';
import createRenderFollowedEditorialCommunity from './render-followed-editorial-community';
import createRenderHeader, { GetUserDetails } from './render-header';
import createRenderPage, { RenderPageError } from './render-page';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import { User } from '../types/user';
import toUserId from '../types/user-id';

type Ports = {
  editorialCommunities: EditorialCommunityRepository,
  getAllEvents: GetAllEvents,
  follows: Follows,
  getUserDetails: GetUserDetails,
};

interface Params {
  id?: string;
  user: Maybe<User>;
}

type RenderPage = (params: Params) => Promise<Result<string, RenderPageError>>;

export default (ports: Ports): RenderPage => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap()
  );

  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  const renderFollowedEditorialCommunity = createRenderFollowedEditorialCommunity(renderFollowToggle);
  const getFollowedEditorialCommunities = createGetFollowedEditorialCommunitiesFromIds(
    createProjectFollowedEditorialCommunityIds(ports.getAllEvents),
    getEditorialCommunity,
  );
  const renderHeader = createRenderHeader(ports.getUserDetails);

  const renderPage = createRenderPage(
    getFollowedEditorialCommunities,
    renderFollowedEditorialCommunity,
    renderHeader,
  );

  return async (params) => {
    const userId = toUserId(params.id ?? '');
    const viewingUserId = params.user.map((value) => value.id);

    return renderPage(userId, viewingUserId);
  };
};
