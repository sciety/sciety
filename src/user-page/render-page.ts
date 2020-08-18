type RenderPage = (handle: string) => Promise<string>;

export default (): RenderPage => (
  async (handle) => `<h1>@${handle}</h1>`
);
