import createGetHardcodedFollowedEditorialCommunities from './get-hardcoded-followed-editorial-communities';
import createRenderFollowToggle from './render-follow-toggle';
import createRenderFollowedEditorialCommunity from './render-followed-editorial-community';
import createRenderPage from './render-page';
import FollowList from '../types/follow-list';
import userId from '../types/user-id';

interface Params {
  userId?: string;
  followList: FollowList;
}

type RenderPage = (params: Params) => Promise<string>;

export default (): RenderPage => {
  const renderFollowToggle = createRenderFollowToggle();
  const renderFollowedEditorialCommunity = createRenderFollowedEditorialCommunity(renderFollowToggle);
  const getHardcodedFollowedEditorialCommunities = createGetHardcodedFollowedEditorialCommunities();
  const renderPage = createRenderPage(getHardcodedFollowedEditorialCommunities, renderFollowedEditorialCommunity);
  return async (params) => renderPage(userId(params.userId ?? ''), params.followList);
};
