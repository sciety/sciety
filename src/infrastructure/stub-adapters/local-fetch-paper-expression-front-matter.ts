import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { sanitise } from '../../types/sanitised-html-fragment.js';
import { ExternalQueries } from '../../third-parties/index.js';
import { ArticleId } from '../../types/article-id.js';

export const localFetchPaperExpressionFrontMatter: ExternalQueries['fetchExpressionFrontMatter'] = (paperExpressionLocator) => TE.right({
  abstract: O.some(sanitise(toHtmlFragment(`
    <p>
      Exact mechanisms of heat shock induced lifespan extension, while documented across species, are still not well understood. Here we put forth evidence that fully functional peroxisomes are required for the activation of the canonical heat shock response and heat-induced hormesis in
      <i>C. elegans</i>
      . While during heat shock the HSP-70 chaperone is strongly upregulated in the wild-type (WT) as well as in the absence of peroxisomal catalase (
      <i>Δctl-2</i>
      mutant), the small heat shock proteins display modestly increased expression in the mutant. Nuclear localization of HSF-1 is reduced in the
      <i>Δctl-2</i>
      mutant. In addition, heat-induced lifespan extension, observed in the WT, is absent in the
      <i>Δctl-2</i>
      mutant. Activation of the antioxidant response, the pentose phosphate pathway and increased triglyceride content are the most prominent changes observed during heat shock in the WT worm, but not in the
      <i>Δctl-2</i>
      mutant. Involvement of peroxisomes in the cell-wide response to transient heat shock reported here gives new insight into the role of organelle communication in the organisms stress response.
    </p>
  `))),
  authors: O.some([
    'Marina Musa',
    'Ira Milosevic',
    'Nuno Raimundo',
    'Anita Krisko',
  ]),
  doi: new ArticleId(paperExpressionLocator),
  title: sanitise(toHtmlFragment(`
    Functional peroxisomes are required for heat shock-induced hormesis in
    <i>Caenorhabditis elegans</i>
  `)),
  server: 'biorxiv' as const,
});
