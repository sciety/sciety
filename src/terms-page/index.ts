import { Result } from 'true-myth';

type RenderPage = () => Promise<Result<{content: string}, never>>;

export default (): RenderPage => async () => Result.ok({
  content: `
    <header class="page-header">
      <h1>Terms and conditions</h1>
    </header>
    <p>
      This website is operated by eLife Sciences Publications, Ltd under their terms and conditions as
      set out at <a href="https://elifesciences.org/terms">elifesciences.org/terms</a> unless otherwise stated through amendments below.
    </p>
    <h2>
      Exceptions to Ownership
    </h2>
    <p>
      Unless otherwise indicated the Editorial Community names, logos and trademarks are owned by
      their respective owners and not by eLife or its licensors.
      The article content is created by the authors stated on the article page and is not owned by
      eLife or its licensors, and is subject to the licence terms shown against it.
      Evaluation content is created by the Editorial Community named alongside the evaluation content
      and is not owned by eLife or its licensors, and is subject to the licence terms shown on the Editorial Community's page.
    </p>
  `,
});
