type RenderPageHeader = () => Promise<string>;

export default (): RenderPageHeader => (
  async () => (`
    <header class="home-page-header">

      <h1>
        The Hive
      </h1>

      <p>
        Where research is evaluated and curated by the communities you trust.<br><a href="/about">Learn more about the platform.</a>
      </p>

    </header>
  `)
);
