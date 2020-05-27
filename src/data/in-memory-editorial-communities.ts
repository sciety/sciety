import { EditorialCommunity } from '../types/editorial-community';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (): EditorialCommunityRepository => {
  const editorialCommunities: Array<EditorialCommunity> = [
    {
      id: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
      name: 'eLife',
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
      <p></p>
      <p>The main features of the current eLife peer-review process are:</p>
      <p></p>
      <ul>
        <li>
          <blockquote>
            <p>all decisions are made by editors who are active researchers in the life and
              biomedical sciences.</p>
          </blockquote>
        </li>
        <li>
          <blockquote>
            <p>editors and reviewers discuss their reviews with each other before reaching a
              decision on a manuscript; extra experiments are only requested if they are essential
              and can be completed within about two months.</p>
          </blockquote>
        </li>
      </ul>
      <p></p>
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
      description: `<p>PREreview's mission is to bring more diversity to scholarly peer review by supporting and
      empowering community of researchers, particularly those at early stages of their career (ECRs) to review
      preprints.</p>`,
    },
    {
      id: '53ed5364-a016-11ea-bb37-0242ac130002',
      name: 'PeerJ',
      description: '<p>This is a placeholder text for the PeerJ editorial community.</p>',
    },
  ];

  const result: EditorialCommunityRepository = {
    all: () => editorialCommunities,
    lookup: (id) => {
      const candidate = editorialCommunities.find((ec) => ec.id === id);
      return candidate ?? {
        id,
        name: 'Unknown',
        description: 'Unknown',
      };
    },
  };
  return result;
};
