import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { google, sheets_v4 } from 'googleapis';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import * as NcrcId from '../types/ncrc-id';
import Sheets = sheets_v4.Sheets;

const hardcodedNCRCReview = toHtmlFragment(`
  <h3>Our take</h3>
  <p>
    This study provides convincing rationale to explore administering only one dose of mRNA vaccine to individuals who possess pre-existing SARS-CoV-2 immunity from previous infection. Antibody testing could be performed prior to vaccination for individuals whose infection history is unknown. This strategy could free up a vast number of vaccine doses, as well as limit discomfort from reactogenicity in those who have pre-existing immunity.
  </p>
  <h3>Study design</h3>
  <p>
    Other
  </p>
  <h3>Study population and setting</h3>
  <p>
    This study investigated individuals who had been vaccinated with either Pfizer or Moderna’s mRNA vaccine in 2020. Antibody responses were studied in 109 participants with and without documented pre-existing SARS-CoV-2 antibody responses (68 seronegative, 41 seropositive). The frequency of local, injection site-related and systemic reactions after first dose of vaccination in 231 participants (149 seronegative, 83 seropositive) was also investigated.
  </p>
  <h3>Summary of main findings</h3>
  <p>
    While seronegative participants mounted low SARS-CoV-2 IgG antibody responses 9-12 days after their first vaccination, seropositive individuals developed antibody titers 10-12 times higher within only days of their first vaccination. Futher, seropositive participants’ antibody titers following their first vaccination were over 10-fold higher than titers measured in seronegative individuals after their second vaccine. Next, mild, local reactions did not differ based on serostatus. However, seropositive individuals had a significantly higher frequency of systemic side effects (ex. fever, chills, fatigue, muscle and joint pains, headache) compared to seronegative individuals. Reactogenicity for seropositive individuals after first dose seemed to resemble reactions of seronegative individuals after their second dose, as reported in phase 3 trials.
  </p>
  <h3>Study strengths</h3>
  <p>
    This study employed a mixture of participants who received either the Pfizer or Moderna mRNA vaccines, which are the two vaccines that have been approved for use by the FDA in the US. Also, they were able to obtain a decent sample size for a first look into this question.
  </p>
  <h3>Limitations</h3>
  <p>
    More seronegative participants were included in this study than seropositive individuals and the groups were not paired in a case-control format.
  </p>
  <h3>Value added</h3>
  <p>
    First concrete rationale for administering only one vaccine dose to those who already have some level of pre-existing SARS-CoV-2 immunity from previous infection.
  </p>
`);

type NcrcReview = {
  title: string,
  ourTake: string,
};

type FoundReview = {
  fullText: HtmlFragment,
  url: URL,
};

type FetchNcrcReview = (id: NcrcId.NcrcId) => TE.TaskEither<'unavailable' | 'not-found', FoundReview>;

type GetNcrcReview = (id: NcrcId.NcrcId) => TE.TaskEither<'unavailable' | 'not-found', NcrcReview>;

const getSheets = (): Sheets => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '/var/run/secrets/.gcp-ncrc-key.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  google.options({
    auth,
  });

  return google.sheets('v4');
};

const getNcrcReview: GetNcrcReview = () => pipe(
  getSheets(),
  TE.right,
  TE.chain((sheets) => TE.tryCatch(
    async () => sheets.spreadsheets.values.get({
      spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
      range: 'Sheet1!A370:AF370',
    }),
    constant('unavailable' as const),
  )),
  T.map(E.chain(flow(
    (res) => res?.data?.values,
    O.fromNullable,
    O.chain(RA.lookup(0)),
    // TODO: ensure that these are strings (codec?)
    O.chain(flow(
      (row) => ({
        title: RA.lookup(2)(row),
        ourTake: RA.lookup(8)(row),
      }),
      sequenceS(O.option),
    )),
    E.fromOption(constant('unavailable' as const)),
  ))),
);

const slugify = (value: string): string => value.toLowerCase().replace(/\s/g, '-');

const constructFullText = (): HtmlFragment => hardcodedNCRCReview;

export const constructNcrcReview = (review: NcrcReview): FoundReview => ({
  url: new URL(`https://ncrc.jhsph.edu/research/${slugify(review.title)}/`),
  fullText: constructFullText(),
});

export const fetchNcrcReview: FetchNcrcReview = flow(
  TE.right,
  TE.filterOrElse(
    (id) => NcrcId.eqNcrcId.equals(id, NcrcId.fromString('0c88338d-a401-40f9-8bf8-ef0a43be4548')),
    constant('not-found' as const),
  ),
  TE.chain(getNcrcReview),
  TE.map(constructNcrcReview),
);
