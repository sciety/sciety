import { Result } from 'true-myth';

export type RenderPage = (filename: string) => Promise<Result<string, never>>;

export type GetHtml = (filename: string) => Promise<string>;

export default (
  getHtml: GetHtml,
): RenderPage => async (filename) => Result.ok(`
  <header class="page-header">
    <h1>
      About The Hive
    </h1>
  </header>
  ${await getHtml(filename)}
`);
