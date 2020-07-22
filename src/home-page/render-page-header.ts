type RenderPageHeader = () => Promise<string>;

export default (): RenderPageHeader => (
  async () => (`
    <header class="ui basic padded center aligned vertical segment">

      <h1 class="ui header">
        The Hive
      </h1>

      <p>
        Where research is evaluated and curated by the communities you trust.<br><a href="/about">Learn more about the platform.</a>
      </p>

    </header>
  `)
);
