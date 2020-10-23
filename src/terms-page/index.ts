type RenderPage = () => Promise<string>;

export default (): RenderPage => async () => `
    <header class="page-header">
      <h1>Terms and conditions</h1>
    </header>
    <p>
      This website is operated by eLife Sciences Publications, Ltd under their terms
      and conditions as set out at <a href="https://elifesciences.org/terms">elifesciences.org/terms</a>.
    </p>
  `;
