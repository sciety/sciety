import { EditorialCommunity } from '../types/editorial-community';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (): EditorialCommunityRepository => {
  const editorialCommunities: Array<EditorialCommunity> = [
    {
      id: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
      name: 'eLife',
      logo: '<img src="https://cdn.elifesciences.org/style-guide-images/elife-logo-lg_3x.png" alt="eLife" style="width: 10rem" />',
      description: `<h2 id="summary">Summary</h2>
      <p>eLife is a non-profit organisation created by funders and led by researchers. Our mission
        is to accelerate discovery by operating a platform for research communication that
        encourages and recognises the most responsible behaviours.</p>
      <h2 id="peer-review-model">Peer review model</h2>
      <p>eLife works to improve the process of peer review so that it more effectively conveys the
        assessment of expert reviewers to authors, readers and other interested parties. This
        ambition is reflected in the transparency of our current process, where anyone can read the
        peer review reports and editors&#39; assessment for all published eLife papers. In the
        future we envision a system in which the outputs of peer review are the primary way research
        is assessed, rather than journal title.</p>
      <p>The main features of the current eLife peer-review process are:
      <ul>
        <li>all decisions are made by editors who are active researchers in the life and
              biomedical sciences.</li>
        <li>editors and reviewers discuss their reviews with each other before reaching a
              decision on a manuscript; extra experiments are only requested if they are essential
              and can be completed within about two months.</li>
      </ul>
      </p>
      <p>The overall aim is to make peer review faster (by reducing rounds of revision and only
        requesting extra experiments when they are essential), fairer and more open. eLife does not
        support the Impact Factor and is a co-founder of the Declaration on Research Assessment
        (DORA).</p>
      <h2 id="people">People</h2>
      <p><a href="https://elifesciences.org/about/people">https://elifesciences.org/about/people</a></p>`,
    },
    {
      id: '10360d97-bf52-4aef-b2fa-2f60d319edd7',
      name: 'PREreview Community',
      logo: undefined,
      description: `<h2 id="summary">Summary</h2>
      <p>PREreview's mission is to bring more diversity to scholarly peer review by supporting and empowering 
      community of researchers, particularly those at early stages of their career (ECRs) to review preprints.</p>
      <p>We envision a system in which any researcher, regardless of their prior engagement with journal-organized
       peer review, career level, geographical location, institutional affiliation, research field, gender, sexual 
       orientation, and ability is invited to share openly constructive feedback on early version of research 
       manuscripts shared as preprints on any web server.</p>
      </p>
      <h2 id="peer-review-model">Peer review model</h2>
      <p>At PREreview we believe all researchers should be allowed to help others by reviewing the work of their 
       peers, as long as it is done constructively.</p>
      <p>In the interest of fostering an open and welcoming environment we, as contributors and maintainers, 
       pledge to making participation in our project and our community a harassment-free experience for everyone,
       regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience,
       nationality, personal appearance, race, religion, or sexual identity and orientation.</p>
      <p>We believe it is our duty as scientists at any level of our career to contribute to scientific evaluation 
       in the form of peer review. PREreview provides a space for any researcher, independently of their career level,
       to provide feedback to emerging scientific output.</p>
      <p>At PREreview we ask all contributors to disclose any competing interest (CI) that may exist between a rapid
       review author (or affiliated  organization) and the author(s) (or affiliated organization) of the reviewed 
       preprint.</p>
      <h2 id="people">People</h2>
      <p><a href="https://content.prereview.org/about/#toc-anchor_4">https://content.prereview.org/about/#toc-anchor_4</a></p>`,
    },
    {
      id: '53ed5364-a016-11ea-bb37-0242ac130002',
      name: 'PeerJ',
      logo: undefined,
      description: `<h2 id="summary">Summary</h2>
      <p><a href="https://peerj.org/">PeerJ</a> is an open access publisher of 7 peer-reviewed journals, and an editorial 
      community of over 2000 Academic Editors and Advisors, and tens of thousands of authors and reviewers.</p>
      <h2 id="peer-review-model">Peer review model</h2>
      <p>PeerJ's editorial model is based on post-publication peer review history transparency, with peer review 
       history dates and formal decisions made available on publication. When a manuscript is accepted for publication,
       reviewers have the option to sign their review, and authors have the option to publish the full peer review 
       history alongside their paper. More than 80% of authors make their peer review publicly available, and around
       40% of reviewers choose to sign their review.</p>
      <p>Launched in 2013, PeerJ Preprints published over 5000 preprints. The rise in popularity of bioRxiv and other 
       preprints servers meant the academic community was well-served with alternative preprint venue options, and led 
       to the decision to cease accepting new submissions to PeerJ Preprints at the end of 2019. All preprints remain 
       readable and downloadable at <a href="https://peerj.com/preprints">peerj.com/preprints</a>. PeerJ continues 
       to work with preprint servers to facilitate direct submissions to our journals, as well as continuing to encourage,
       via our <a href="https://peerj.com/about/FAQ/academic-contribution/">Contributions</a> system, uptake of open 
       review and open Q&A on our articles. 
      </p>
      <h2 id="people">People</h2>
      <p><a href="https://peerj.com/academic-boards/editors/peerj/">https://peerj.com/academic-boards/editors/peerj/</a></p>`,
    },
  ];

  const result: EditorialCommunityRepository = {
    all: () => editorialCommunities,
    lookup: (id) => {
      const candidate = editorialCommunities.find((ec) => ec.id === id);
      return candidate ?? {
        id,
        name: 'Unknown',
        logo: undefined,
        description: 'Unknown',
      };
    },
  };
  return result;
};
