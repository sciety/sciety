import { Result } from 'true-myth';

type RenderPage = () => Promise<Result<{content: string}, never>>;

export default (): RenderPage => async () => Result.ok({
  content: `
    <header class="page-header">
      <h1>Privacy notice</h1>
    </header>

    <p>
      This Privacy Notice relates to data held and processed by eLife Sciences Publications, Ltd
      who operate this site. For all queries relating to personal data and privacy, please contact
      us at <a href="mailto:data@elifesciences.org">data@elifesciences.org</a>.
    </p>

    <p>
      Full details of the Privacy Notice can be found at
      <a href="https://elifesciences.org/privacy">elifesciences.org/privacy</a>.
    </p>
    <h2>
      What additional personal information does this site hold?
    </h2>
    <p>
      This site adds the following to the information specified in the privacy notice linked above.
    </p>

    <p>
      When you log in to your Twitter account through our site (for example to store your feed preferences) that interaction is directly with Twitter Inc. We only receive from Twitter a user name and user identifier. Your Twitter user identifier is associated with items that you follow on the site (communities, people, papers and evaluation events) and used to publicly display events that you follow on your user page. In addition, your user name is displayed on the community page of any community that you follow.
    </p>

    <h2>
      Privacy notice changes
    </h2>
    <h3>
      Change log
    </h3>
    <p>
      Although most changes are likely to be minor, eLife may change its Privacy Notice from time to time, and at our sole discretion. We encourage visitors to check this page frequently for any changes to its Privacy Notice. First published October 19, 2020.
    </p>
  `,
});
