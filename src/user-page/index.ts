interface Params {
  handle?: string;
}

type RenderPage = (params: Params) => Promise<string>;

export default (): RenderPage => (
  async (params) => params.handle ?? ''
);
