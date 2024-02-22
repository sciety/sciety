import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { ExternalQueries } from '../../third-parties';

const htmlFullText = `
<h1>Stubbed evaluation content</h1>
<p>Experiments:</p>
<ol>
<li><pre><code>If the authors could report the difference in the initial rates of glutathione transport between SLC25A39 KO and control in isolated mitochondria, it would strengthen the conclusion that SLC25A39 is a glutathione transporter. To calculate this acc...
</code></pre></li>
</ol>

<p>SciScore for <i>10.1101/2022.04.21.22274150</i>: (<a href="https://www.sciscore.com/index.html#faqs">What is
this?</a>)</p>
<p>Please note, not all rigor criteria are appropriate for all manuscripts.</p>
<p><b>Table 1: Rigor</b></p><i>NIH rigor criteria are not applicable to paper type.</i>
<p><b>Table 2: Resources</b></p>
<table>
<tbody>
<tr>
<th>Software and Algorithms</th>
</tr>
<tr>
<td><i>Sentences</i></td>
<td><i>Resources</i></td>
</tr>
<tr>
<td>Cost estimates: The cost estimates used in this study were derived using a hybrid method that involved both an
ingredients approach (bottom-up) and a top-down approach.</td>
<td>
<div>
<div><b>Cost</b></div>
<div>suggested: (COST, RRID:<a href="https://scicrunch.org/resources/Any/search?q=SCR_014098">SCR_014098</a>)
</div>
</div>
</td>
</tr>
</tbody>
</table>
<hr>
<p><i>Results from <a href="https://www.biorxiv.org/content/10.1101/2020.05.11.088021v1">OddPub</a></i>: Thank you for
sharing your code and data.</p>
<hr><i>Results from <a href="https://academic.oup.com/jamia/article/25/7/855/4990607">LimitationRecognizer</a></i>: We
detected the following sentences addressing limitations in the study:<blockquote>This underlines the limitations of
using a narrow health system perspective that ignores broader societal costs of health system interventions. This is
even more so for a vaccine deployed in a pandemic that has substantial socio-economic impacts, in addition to health
impacts. These findings mirror cost-effectiveness studies of COVID-19 vaccination done in Turkey and Pakistan that
found that although COVID-19 vaccination strategies were cost-effective from a health system’s perspective, they were
cost-saving from a societal perspective.[39,41] This is in line with arguments from studies that estimate the public
health value and impact of vaccination, which argue the need to broaden the perspectives for cost-effectiveness
analysis of vaccines, as their impact is far-reaching, especially in the context of a pandemic.[42–44] These findings
have implications for COVID-19 vaccination policy in Kenya and other low-and middle-income countries (LMIC) settings
with comparable demographic and COVID-19 epidemiological profiles. First, not unexpectedly, where an outbreak is
imminent efforts to rapidly deploy the vaccine not only avert more cases, hospitalization, and deaths, but are also
more cost-effective. By extension, had Kenya been able to deploy vaccines more rapidly, benefits would have been
greater. Second, COVID-19 vaccination is likely to offer the best value for money when targeted to older age groups
and possibly other vulnerable groups (such as those with risk increasing com...</blockquote>
<hr>
<p><i>Results from <a href="https://github.com/bgcarlisle/PreprintScreening">TrialIdentifier</a></i>: No clinical trial
numbers were referenced.</p>
<hr>
<p><i>Results from <a href="https://github.com/NicoRiedel/barzooka">Barzooka</a></i>: We did not find any issues
relating to the usage of bar graphs.</p>
<hr>
<p><i>Results from <a
href="https://elifesciences.org/labs/c2292989/jetfighter-towards-figure-accuracy-and-accessibility">JetFighter</a></i>:
We did not find any issues relating to colormaps.</p>
<hr><i>Results from <a href="https://www.biorxiv.org/content/10.1101/2020.10.30.361618v1">rtransparent</a></i>: <ul>
<li>Thank you for including a conflict of interest statement. Authors are encouraged to include this statement when
submitting to a journal.</li>
<li>Thank you for including a funding statement. Authors are encouraged to include this statement when submitting to a
journal.</li>
<li>No protocol registration statement was detected.</li>
</ul>
<hr>
<p><i>Results from <a
href="https://medium.com/scite/reference-check-an-easy-way-to-check-the-reliability-of-your-references-b2afcd64abc6">scite
Reference Check</a></i>: We found no unreliable references.</p>
<hr>
<footer>
<p><b>About SciScore</b></p>
<p>SciScore is an automated tool that is designed to assist expert reviewers by finding and presenting formulaic
information scattered throughout a paper in a standard, easy to digest format. SciScore checks for the presence and
correctness of RRIDs (research resource identifiers), and for rigor criteria such as sex and investigator blinding.
For details on the theoretical underpinning of rigor criteria and the tools shown here, including references cited,
please follow <a href="https://scicrunch.org/ASWG/about/References">this link</a>.</p>
</footer>
</div>
`;

export const fetchEvaluation: ExternalQueries['fetchEvaluation'] = () => TE.right({
  url: new URL('http://example.com'),
  fullText: pipe(
    htmlFullText,
    toHtmlFragment,
    sanitise,
  ),
});
