import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as GID from '../../../types/group-id';
import { Doi } from '../../../types/doi';
import { LanguageCode } from '../../../shared-components/lang-attribute';
import { CurationStatementViewmodel } from '../view-model';
import { Dependencies } from './dependencies';

type CurationStatement = {
  groupId: GID.GroupId,
  groupLogo: string,
  statement: string,
  statementLanguageCode: O.Option<LanguageCode>,
};

const curationStatements: ReadonlyArray<CurationStatement> = [
  {
    groupId: GID.fromValidatedString('gordonsalive'),
    groupLogo: '/static/images/article-page/elife-logo-sm.svg',
    statement: `
      <p><strong>eLife assessment</strong></p>
      <p>This fundamental study presents solid evidence for T1r (sweet /umami) taste receptors as chloride (Cl-) receptors, based on a combination of state-of-the-art techniques to demonstrate that T1r receptors from Medaka fish bind chloride and that this binding induces a conformational change in the heteromeric receptor. This conformational change leads to low-concentration chloride-specific action potential firing in nerves from neurons containing these receptors in mice, results that represent an important advance in our understanding of the logic of taste perception.</p>
    `,
    statementLanguageCode: O.some('en'),
  },
  {
    groupId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2'),
    groupLogo: '/static/images/home-page/biophysics-colab.png',
    statement: `
      <p><strong>Endorsement statement (17 November 2022)</strong></p>
      <p>The preprint by Atsumi <em>et al</em>. describes how chloride binding to sweet- and umami-sensing proteins (T1R taste receptors) can evoke taste sensation. The authors use an elegant combination of structural, biophysical and electrophysiological approaches to locate a chloride binding site in the ligand-binding domain of medaka fish T1r2a/3 receptors. They convincingly show that low mM concentrations of chloride induce conformational changes and, using single fiber recordings, establish that mouse chorda tympani nerves are activated by chloride in a T1R-dependent manner. This suggests that chloride binding to sweet receptors could mediate the commonly reported sweet taste sensation following ingestion of low concentrations of table salt. The findings will be of broad relevance to those studying taste sensation and ligand recognition in GPCRs.</p>
      <p><em>(This endorsement by Biophysics Colab refers to version 2 of this preprint, which has been revised in response to peer review of version 1.)</em></p>
    `,
    statementLanguageCode: O.some('en'),
  },
];

type ConstructCurationStatements = (dependencies: Dependencies)
=> (doi: Doi)
=> ReadonlyArray<CurationStatementViewmodel>;

export const constructCurationStatements: ConstructCurationStatements = (dependencies) => (doi) => pipe(
  (doi.value === '10.1101/2022.02.23.481615') ? curationStatements : [],
  RA.map((statement) => pipe(
    statement.groupId,
    dependencies.getGroup,
    E.fromOption(() => {
      dependencies.logger('error', 'Group not found in read model', { statement });
    }),
    E.map((group) => ({
      ...statement,
      groupName: group.name,
      groupSlug: group.slug,
    })),
  )),
  RA.rights,
);
