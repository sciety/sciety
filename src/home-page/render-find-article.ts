type RenderFindArticle = () => Promise<string>;

export default (): RenderFindArticle => (
  async () => (`
    <form method="get" action="/articles" class="find-reviews compact-form">
    <fieldset>

      <legend class="compact-form__title">
        Find a bioRxiv article
      </legend>

      <div class="compact-form__row">

        <label>
          <span class="visually-hidden">Find a bioRxiv article</span>
          <input
            type="text"
            name="doi"
            class="compact-form__article-doi"
            required>
        </label>

        <button type="submit" class="compact-form__submit">
          <span class="visually-hidden">Find a bioRxiv article</span>
        </button>

      </div>

    </fieldset>
    </form>
  `)
);
