export type RenderPage = (filename: string) => Promise<string>;

export type GetHtml = (filename: string) => Promise<string>;

export default (
  getHtml: GetHtml,
): RenderPage => async (filename) => `
  <header class="ui basic padded vertical segment">
    <h1>
      About The Hive
    </h1>
  </header>
  <section class="ui basic vertical segment">
    ${await getHtml(filename)}
  </section>
`;
