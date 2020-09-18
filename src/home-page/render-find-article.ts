type RenderFindArticle = () => Promise<string>;

export default (): RenderFindArticle => (
  async () => (`
    <form method="get" action="/articles" class="ui basic very padded vertical form segment">
      <fieldset>

        <h3>
          Search bioRxiv content
        </h3>

        <div class="ui action input">
          <input type="text" name="query" placeholder="Keywords, author name, DOI ..." required>
          <button type="submit" class="ui primary icon button">
            <i class="search icon"></i>
          </button>
        </div>

      </fieldset>
    </form>
  `)
);
