export type RenderPage = (filename: string) => Promise<string>;

export type GetHtml = (filename: string) => Promise<string>;

export default (
  getHtml: GetHtml,
): RenderPage => async (filename) => `
  <header class="page-header">
    <h1>
      About The Hive
    </h1>
  </header>
  ${await getHtml(filename)}
`;
