type RenderFindArticle = () => Promise<string>;

export default (): RenderFindArticle => (
  async () => (`
    <section>
      <form method="get" action="/articles" class="search-form">

        <h3>
          Search bioRxiv content
        </h3>

        <div class="search-form__inputs">
          <input type="text" name="query" placeholder="Keywords, author name, DOI ..." class="search-form__input" required><button type="submit" class="button button--primary search-form__button"><img src="/static/images/search-icon.svg" alt=""></button>
        </div>

      </form>
    </section>
  `)
);
