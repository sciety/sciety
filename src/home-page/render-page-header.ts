type RenderPageHeader = () => Promise<string>;

export default (): RenderPageHeader => (
  async () => (`
    <header class="ui basic padded center aligned container segment">

      <h1 class="ui header">
        Untitled Publish Review Curate Platform
      </h1>

      <p>
        An experimental platform for multiple communities to provide post-publication peer review of scientific
        research.<br><a href="/about">Learn more about the platform.</a>
      </p>

    </header>
  `)
);
