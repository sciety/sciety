import createRenderPage from './render-page';

interface Params {
  handle?: string;
}

type RenderPage = (params: Params) => Promise<string>;

export default (): RenderPage => {
  const renderPage = createRenderPage();
  return async (params) => renderPage(params.handle ?? '');
};
