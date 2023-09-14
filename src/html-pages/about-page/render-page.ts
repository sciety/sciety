import { pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const content = `
<p>Sciety was created by eLife to help scientists and researchers focus their attention on preprints that have been peer reviewed by groups that they trust.</p>

<p>As more and more research is posted as preprints it can be difficult to trust the accuracy of the claims in the research without peer review, or narrow them down to the most interesting or impactful.</p>

<figure>
<img src="/static/images/about-page/preprints-in-europe-pmc.png" style="width: 100%" alt="graph of preprints in Europe PMC showing massive growth">
<figcaption style="text-align: center">Preprints in Europe PMC</figcaption>
</figure>

<p>Societies, journals and other groups of scientists are helping by highlighting the preprints that they think are the most important and providing public review and curation to share with their peers. Sciety brings the review and curation of preprints from multiple groups into one place to make them easier to find.</p>

<figure>
<img src="/static/images/about-page/number-of-evaluations-on-sciety.png" style="width: 100%" alt="graph showing increasing amount of evaluations on Sciety">
<figcaption style="text-align: center">Number of evaluations on Sciety</figcaption>
</figure>

<figure>
<img src="/static/images/about-page/number-of-evaluated-articles-on-sciety.png" style="width: 100%" alt="graph showing increasing amount of evaluated articles on Sciety">
<figcaption style="text-align: center">Number of evaluated articles on Sciety</figcaption>
</figure>

<p>Sciety also enables scientists to share the evaluated preprints that they think are interesting or relevant to their work, which in turn helps their fellow researchers discover the latest and best new research.</p>

<p><a href="/search" class="about-page-call-to-action">Find evaluated preprints today</a></p>

<p><a href="https://blog.sciety.org/what-is-public-preprint-evaluation/">What are evaluations and where do they come from?</a></p>

<p><a href="https://blog.sciety.org/more-about-sciety/)">More about how Sciety was created</a></p>

<p><a href="https://blog.sciety.org/join-as-a-group-on-sciety/">How to join Sciety as a group that provides preprint review and curation</a></p>
`;

const addPageWrapper = (html: string) => `
  <header class="page-header">
    <h1>
      About Sciety
    </h1>
  </header>
  <div>
    ${html}
  </div>  
`;

export const renderPage = (): HtmlFragment => pipe(
  content,
  addPageWrapper,
  toHtmlFragment,
);
