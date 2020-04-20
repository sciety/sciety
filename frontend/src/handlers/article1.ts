import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article1 from '../data/article1';
import templateDate from '../templates/date';
import templateListItems from '../templates/list-items';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const page = templatePage(`<main>

  <article>

    <header>

      <ol>
        <li aria-label="Article category">
          ${article1.category}
        </li>
        <li aria-label="Article type">
          ${article1.type}
        </li>
      </ol>

      <h1>
        ${article1.title}
      </h1>

      <ol aria-label="Authors of this article">
        ${templateListItems(article1.authors)}
      </ol>

      <ul aria-label="Publication details">
        <li>
          DOI: <a href="https://doi.org/${article1.doi}">${article1.doi}</a>
        </li>
        <li>
          Posted ${templateDate(article1.publicationDate)}
        </li>
      </ul>

    </header>

    <section role="doc-abstract">

      <h2>
        Abstract
      </h2>

      ${article1.abstract}

    </section>

    <section>

      <h2>
        Review summaries
      </h2>

      <ol>

        <li>

          <article>

            <h3>
              Reviewed by <span id="review-3-author">eLife</span> on <time datetime="2020-04-08">Apr 8, 2020</time>
            </h3>

            <p>
              Heissenberger et al. study how NSUN-1 impacts rRNA methylation and health in nematodes. Eukaryotic
              ribosomal RNAs undergo several modifications. Among these, there are two known m<sup>5</sup>C, located in
              highly conserved target sequences. Previous work from the authors characterised the mechanism underlying
              one of these modifications in worms (C2381), as well as its functional consequences on cellular and
              organismal homeostasis. The current work focuses on the second m<sup>5</sup>C, at position C2982, and
              identifies NSUN-1 as the putative rRNA methylase. This is a novel and potentially exciting finding.
            </p>

            <a href="https://hypothes.is/a/1D0WaHpUEeqL3B9UdsGZjw" id="review-3-read-more"
              aria-labelledby="review-3-read-more review-3-author">
              Read the full review
            </a>

          </article>

        </li>

        <li>

          <article>

            <h3>
              Reviewed by <span id="review-2-author">PLOS Biology</span> on <time datetime="2019-12-22">Dec 22,
              2019</time>
            </h3>

            <p>
              Using RNAi in two worm strains, the authors show that knocking down NSUN-1 expression, the specific C2982
              m<sup>5</sup>C level is in part (not entirely) reduced. This assay proves sufficiency (but not necessity)
              of NSUN-1 to reduce m<sup>5</sup>C levels at C2982. While it is not clear why the authors do not use a
              complete knock out for NSUN-1 (is it lethal?), follow-up work using RNAi explores the phenotypic effects
              of lowered NSUN-1 levels.
            </p>

            <a href="https://hypothes.is/a/1D0WaHpUEeqL3B9UdsGZjw" id="review-2-read-more"
              aria-labelledby="review-2-read-more review-2-author">
              Read the full review
            </a>

          </article>

        </li>

        <li>

          <article>

            <h3>
              Reviewed by <span id="review-1-author">${article1.reviews[0].author}</span> on
              ${templateDate(article1.reviews[0].publicationDate)}
            </h3>

            <p>
              ${article1.reviews[0].summary}
            </p>

            <a href="${article1.reviews[0].url}" id="review-1-read-more"
              aria-labelledby="review-1-read-more review-1-author">
              Read the full review
            </a>

          </article>

        </li>

      </ol>

    </section>

    <aside>

      <h2>
        3 peer reviews
      </h2>

      <ol>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/1D0WaHpUEeqL3B9UdsGZjw" aria-label="Review by eLife">eLife</a>
            </h3>

            <time datetime="2020-04-08" aria-label="Review date">Apr 8, 2020</time>

          </article>

        </li>

        <li>

          <article>

            <h3>
              <a href="https://hypothes.is/a/1D0WaHpUEeqL3B9UdsGZjw" aria-label="Review by PLOS Biology">PLOS
                Biology</a>
            </h3>

            <time datetime="2019-12-22" aria-label="Review date">Dec 22, 2019</time>

          </article>

        </li>

        <li>

          <article>

            <h3>
              <a href="${article1.reviews[0].url}"
                aria-label="Review by ${article1.reviews[0].author}">${article1.reviews[0].author}</a>
            </h3>

            ${templateDate(article1.reviews[0].publicationDate)}

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
