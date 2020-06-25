import HypothesisAnnotationId from '../data/hypothesis-annotation-id';
import { Review } from '../types/review';

export type FetchHypothesisAnnotation = (id: HypothesisAnnotationId) => Promise<Review>;

export default (): FetchHypothesisAnnotation => async (id) => {
  if (id.value === 'fhAtGNVDEemkyCM-sRPpVQ') {
    return {
      publicationDate: new Date('2019-09-12T09:55:46.146050+00:00'),
      summary: `
**[Note: this preprint has been peer reviewed by eLife. The decision letter after peer review, based on three reviews,
follows. The decision was sent on 17 June 2019.]**\\n\\n**Summary**\\n\\nNatural Killer (NK) and the ILC1 subset of
innate lymphoid cells share related functions in host defense but have been argued to arise from distinct pathways. Park
et al present new evidence challenging this concept. They show that murine *Toxoplasma gondii* infection promotes the
differentiation of NK cells into an ILC1-like cell population which is stable and long-lasting, even after the infection
has been cleared. These *T. gondii* induced cells, unlike Eomes+CD49a- NK cells, are Eomes-CD49a+T-bet+ and therefore
resemble ILC1 cells. The authors additionally show that their differentiation involves Eomes down regulation and is
STAT-4 dependent, However, in common with NK cells and distinct from ILC1 the *T. gondii* induced \\"ILC-like\\"
population circulates to blood and lungs. Finally, the authors employ single cell RNAseq to examine the heterogeneity of
the major *T. gondii* induced innate lymphocyte populations and their NK vs ILC relatedness as assessed by gene
expression. Together, their observations establish a previously unappreciated developmental link between NK and
ILC1cells in the context of infection. \\n\\nThe 3 reviewers and editor agree that this is an important contribution
that sheds new light on the developmental relationship of NK and ILC1 cells, a scientific issue that has received
considerable attention in the innate immunity field. Although extensive, most of the criticisms raised can be addressed
by revisions to the manuscript. One additional experiment is requested to provide a missing control. \\n\\n**Essential
Revisions**\\n\\nAll reviewers had a major concern about how this new population of *T. gondii* induced innate cells
should be referred to in the manuscript. Based on the single cell RNAseq data, these cells (cluster 10) are still closer
to NK cells than to ILC1s (Figure 5f and Suppl Fig 4e) despite their loss in Eomes expression and acquisition of CD49a
expression. Thus, one could easily think of them as \\"Eomes negative NK\\" or \\"ex-NK\\" cells rather than ILC1s, and
to simply refer to them as Eomes-CD49a+ ILC1 cells may be misleading . For this reason, the authors should modify the
title of the paper and change their designation throughout the manuscript. We suggest \\"ILC1-like\\" as a good
descriptor. In addition, although it is clear that the \\"Eomes negative NK\\" cells that are generated during *T.
gondii* infection are transcriptionally and epigenetically distinct from the NK cells in the steady state and NK cells
after infection (Figure 7 and suppl Figure 6), these \\"Eomes negative NK\\" cells referred to as \\"*T. gondii*-induced
ILC1s\\" were not directly compared with classical ILC1s. Based on the single cell RNAseq data, these cells may not
express many of the ILC1-related signature genes. Therefore, again, the authors need to be cautious in referring to them
as ILC1 cells. \\n\\nA second concern was that the NK 1.1 depletion shown in Supplemental figure 1 was performed with a
PBS rather than isotope matched immunoglobulin control which is considered unacceptable. The authors should repeat at
least once with proper control Ig to make sure this is not issue. It is not necessary to repeat entire survival curve
just experiments shown in A and B and initial survival to make sure there is no death in controls vs. antibody treated.
`,
      url: new URL('https://hyp.is/fhAtGNVDEemkyCM-sRPpVQ/www.biorxiv.org/content/10.1101/642017v1'),
    };
  }
  throw new Error(`${id} is not a DOI`);
};
