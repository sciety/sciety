import createRenderFollowToggle from './render-follow-toggle';
import createRenderPage from './render-page';
import FollowList from '../types/follow-list';

interface Params {
  handle?: string;
  followList: FollowList;
}

type RenderPage = (params: Params) => Promise<string>;

export default (): RenderPage => {
  const renderFollowToggle = createRenderFollowToggle();
  const renderPage = createRenderPage(renderFollowToggle);
  return async (params) => renderPage(params.handle ?? '', params.followList);
};
