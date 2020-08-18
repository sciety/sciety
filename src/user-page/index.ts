import createRenderFollowToggle from './render-follow-toggle';
import createRenderFollowedEditorialCommunity from './render-followed-editorial-community';
import createRenderPage from './render-page';
import FollowList from '../types/follow-list';

interface Params {
  handle?: string;
  followList: FollowList;
}

type RenderPage = (params: Params) => Promise<string>;

export default (): RenderPage => {
  const renderFollowToggle = createRenderFollowToggle();
  const renderFollowedEditorialCommunity = createRenderFollowedEditorialCommunity(renderFollowToggle);
  const renderPage = createRenderPage(renderFollowedEditorialCommunity);
  return async (params) => renderPage(params.handle ?? '', params.followList);
};
