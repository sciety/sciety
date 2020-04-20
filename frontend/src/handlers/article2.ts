import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article2 from '../data/article2';
import templatePage from '../templates/page';

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export default (): Handler<HTTPVersion.V1> => {
  const page = templatePage(`<main>

  <article>

    <header>

      <ol>
        <li aria-label="Article category">
          ${article2.category}
        </li>
        <li aria-label="Article type">
          ${article2.type}
        </li>
      </ol>

      <h1>
        ${article2.title}
      </h1>

      <ol aria-label="Authors of this article">
        ${article2.authors.reduce((carry: string, name: string): string => `${carry}<li>${name}</li>\n`, '')}
      </ol>

      <ul aria-label="Publication details">
        <li>
          DOI: <a href="https://doi.org/${article2.doi}">${article2.doi}</a>
        </li>
        <li>
          Updated <time datetime="${article2.updatedDate.toISOString().split('T')[0]}">
          ${article2.updatedDate.toLocaleDateString(undefined, dateFormatOptions)}</time>
        </li>
      </ul>

    </header>

    <section role="doc-abstract">

      <h2>
        Abstract
      </h2>

      ${article2.abstract}

    </section>

    <section>

      <h2>
        Review summaries
      </h2>

      <ol>

        <li>

          <article>

            <h3>
              Reviewed by <span id="review-4-author">EMBOpress</span> on <time datetime="2020-04-09">Apr 9, 2020</time>
            </h3>

            <p>
              We thank all the Reviewers for taking the time to evaluate our manuscript and providing us with
              constructive feedback. We are pleased to hear that all Reviewers appreciate the importance and
              significance of our study, commenting that our conclusions are ‘convincing, are supported by the presented
              experimental results’ and that our study ‘will yield novel insights into the regulation and function of
              PALB2 in DNA repair’.
            </p>

            <a href="https://hypothes.is/a/JFxMDnpkEeqyx09LkDotfQ" id="review-4-read-more"
              aria-labelledby="review-4-read-more review-4-author">
              Read the full review
            </a>

          </article>

        </li>

        <li>

          <article>

            <h3>
              Reviewed by <span id="review-3-author">EMBOpress</span> on <time datetime="2020-04-09">Apr 9, 2020</time>
            </h3>

            <p>
              The authors describe a series of experiments examining the consequence of acetylation, within a defined
              motif (Chromatin Association Motif; ChAM), on the cellular roles of the protein PALB2 (Partner and
              Localizer of BRCA2).
            </p>

            <p>
              The key conclusions drawn by the authors are generally convincing and are supported by the presented
              experimental results, which indicate that acetylation of PALB2 by KAT2A/KAT2B modulates its cellular
              behaviour and response to DNA damage.
            </p>

            <a href="https://hypothes.is/a/I-FC6HpkEeqdRav-80EtSA" id="review-3-read-more"
              aria-labelledby="review-3-read-more review-3-author">
              Read the full review
            </a>

          </article>

        </li>

        <li>

          <article>

            <h3>
              Reviewed by <span id="review-2-author">EMBOpress</span> on <time datetime="2020-04-09">Apr 9, 2020</time>
            </h3>

            <p>
              This manuscript reports the control of PALB2 - chromatin interaction by the acetylation of a particular
              lysine-rich domain of the protein called ChAM. This acetylation is shown to be mediated by the
              acetyltransferases KAT2A/B. Following these investigations, the authors made an effort to place their
              findings in the context of DNA replication and DNA repair.
            </p>

            <a href="https://hypothes.is/a/I36NiHpkEeqdZutVpxr6uQ" id="review-2-read-more"
              aria-labelledby="review-2-read-more review-2-author">
              Read the full review
            </a>

          </article>

        </li>

        <li>

          <article>

            <h3>
              Reviewed by <span id="review-1-author">EMBOpress</span> on <time datetime="2020-04-09">Apr 9, 2020</time>
            </h3>

            <p>
              Fournier et al. detect acetylation within the chromatin association motif (ChAM) of PALB2 and demonstrate
              that KAT2 can acetylate these 7 lysine residues within this region. They then generate K to R mutations
              (7R) or K to Q mutations (7Q) at these sites and perform assays of fluorescence recovery after
              photobleaching (FRAP) to measure mobility as a measure of chromatin association, RAD51 foci, PALB2
              recruitment at sites of laser-induced DNA damage, and sensitivity to olaparib. They find increased
              mobility of the 7Q mutant of PALB2 but not 7R in the absence of exogenous DNA damage, as well as defects
              in DNA damage-induced RAD51 foci and resistance to olaparib. On this basis, the authors conclude that
              acetylation is required for the association of PALB2 with undamaged chromatin and that deacetylation
              permits mobilization and association with BRCA1 to enable proper DNA repair. While the manuscript is
              generally well-written, many of the systems are rather elegant, and this study may yield novel insights
              into the regulation and function of PALB2 in DNA repair, there are some missing experiments to be added
              and important contradictions that should be resolved in order to fully establish the new model the authors
              propose.
            </p>

            <a href="https://hypothes.is/a/I0iGrHpkEeqtkxu-1NyIbQ" id="review-1-read-more"
              aria-labelledby="review-1-read-more review-1-author">
              Read the full review
            </a>

          </article>

        </li>

      </ol>

    </section>

    <aside>

      <h2>
        4 peer reviews
      </h2>

      <ol>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/JFxMDnpkEeqyx09LkDotfQ" aria-label="Review by EMBOpress">EMBOpress</a>
            </h3>

            <time datetime="2020-04-09" aria-label="Review date">Apr 9, 2020</time>

          </article>

        </li>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/I-FC6HpkEeqdRav-80EtSA" aria-label="Review by EMBOpress">EMBOpress</a>
            </h3>

            <time datetime="2020-04-09" aria-label="Review date">Apr 9, 2020</time>

          </article>

        </li>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/I36NiHpkEeqdZutVpxr6uQ" aria-label="Review by EMBOpress">EMBOpress</a>
            </h3>

            <time datetime="2020-04-09" aria-label="Review date">Apr 9, 2020</time>

          </article>

        </li>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/I0iGrHpkEeqtkxu-1NyIbQ" aria-label="Review by EMBOpress">EMBOpress</a>
            </h3>

            <time datetime="2020-04-09" aria-label="Review date">Apr 9, 2020</time>

          </article>

        </li>

      </ol>

      <a href="add-review">Add a review</a>

    </aside>

  </article>

</main>`);

  return (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.writeHead(OK);
    response.end(page);
  };
};
