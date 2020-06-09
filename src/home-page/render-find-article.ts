type RenderFindArticle = () => Promise<string>;

export default (): RenderFindArticle => (
  async () => (`
    <form method="get" action="#" class="ui basic very padded center aligned form container segment">
      <fieldset>
                                                          
        <legend class="ui center aligned header">
          Find a bioRxiv article
        </legend>

        <div class="ui action input">
          <input type="text" name="query" required>
          <button type="submit" class="ui primary icon button">
            <i class="search icon"></i>
          </button>
        </div>

      </fieldset>
    </form>
  `)
);
