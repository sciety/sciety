import createGetHardcodedFollowedEditorialCommunities, { GetEditorialCommunity } from './get-hardcoded-followed-editorial-communities';
import createRenderFollowToggle from './render-follow-toggle';
import createRenderFollowedEditorialCommunity from './render-followed-editorial-community';
import createRenderPage from './render-page';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import FollowList from '../types/follow-list';
import userId from '../types/user-id';

type Ports = {
  editorialCommunities: EditorialCommunityRepository,
};

interface Params {
  userId?: string;
  followList: FollowList;
}

type RenderPage = (params: Params) => Promise<string>;

export default (ports: Ports): RenderPage => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap()
  );

  const renderFollowToggle = createRenderFollowToggle();
  const renderFollowedEditorialCommunity = createRenderFollowedEditorialCommunity(renderFollowToggle);
  const getHardcodedFollowedEditorialCommunities = createGetHardcodedFollowedEditorialCommunities(
    getEditorialCommunity,
  );
  const renderPage = createRenderPage(getHardcodedFollowedEditorialCommunities, renderFollowedEditorialCommunity);
  return async (params) => renderPage(userId(params.userId ?? ''), params.followList);
};
