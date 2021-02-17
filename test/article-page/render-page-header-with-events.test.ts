// https://api.biorxiv.org/details/biorxiv/10.1101/641381
// but should also try https://api.biorxiv.org/details/biorxiv/2018-08-21/2018-08-28/45 for bulk ingestion
import sanitizeHtml from "sanitize-html";
import { Doi } from "../../src/types/doi";
import { HtmlFragment } from "../../src/types/html-fragment";

const externalArticleVersionPostedOnBiorxiv1 = {
  "doi": "10.1101/641381",
  "title": "Chromatin structure-dependent histone incorporation revealed by a genome-wide deposition assay",
  "authors": "Tachiwana, H.; Dacher, M.; Maehara, K.; Harada, A.; Ohkawa, Y.; Kimura, H.; Kurumizaka, H.; Saitoh, N.",
  "author_corresponding": "Hiroaki Tachiwana",
  "author_corresponding_institution": "Japanese Foundation for Cancer Research",
  "date": "2019-05-17",
  "version": "1",
  "type": "new results",
  "license": "cc_by_nc_nd",
  "category": "biochemistry",
  "abstract": "In eukaryotes, histone variant distribution within the genome is the key epigenetic feature. To understand how each histone variant is targeted to the genome, we developed a new method, in which epitope-tagged histone complexes are introduced into permeabilized cells and incorporated into their chromatin. We found that the incorporation of histones H2A and H2A.Z mainly occurred at less condensed chromatin (open), suggesting that the condensed chromatin (closed) is a barrier for histone incorporation. To overcome this barrier, H2A, but not H2A.Z, uses a replication-coupled deposition mechanism. This led to the recapitulation of the pre-existing chromatin structure: the genome-wide even distribution of H2A and the exclusion of H2A.Z from the closed chromatin. Intriguingly, an H2A.Z mutant with mutations in the developmentally essential region was incorporated into closed chromatin. Our study revealed that the combination of chromatin structure and DNA replication dictates the differential histone deposition for maintaining the epigenetic chromatin states.",
  "published": "NA",
  "server": "biorxiv"
};

const externalArticleVersionPostedOnBiorxiv2 = {
  "doi": "10.1101/641381",
  "title": "Chromatin structure-dependent histone incorporation revealed by a genome-wide deposition assay",
  "authors": "Tachiwana, H.; Dacher, M.; Maehara, K.; Harada, A.; Ohkawa, Y.; Kimura, H.; Kurumizaka, H.; Saitoh, N.",
  "author_corresponding": "Hiroaki Tachiwana",
  "author_corresponding_institution": "Japanese Foundation for Cancer Research",
  "date": "2019-10-13",
  "version": "2",
  "type": "new results",
  "license": "cc_by_nc_nd",
  "category": "biochemistry",
  "abstract": "In eukaryotes, histone variant distribution within the genome is the key epigenetic feature. To understand how each histone variant is targeted to the genome, we developed a new method, in which epitope-tagged histone complexes are introduced into permeabilized cells and incorporated into their chromatin. We found that the incorporation of histones H2A and H2A.Z mainly occurred at less condensed chromatin (open), suggesting that the condensed chromatin (closed) is a barrier for histone incorporation. To overcome this barrier, H2A, but not H2A.Z, uses a replication-coupled deposition mechanism. This led to the recapitulation of the pre-existing chromatin structure: the genome-wide even distribution of H2A and the exclusion of H2A.Z from the closed chromatin. Intriguingly, an H2A.Z mutant with mutations in the developmentally essential region was incorporated into closed chromatin. Our study revealed that the combination of chromatin structure and DNA replication dictates the differential histone deposition for maintaining the epigenetic chromatin states.",
  "published": "NA",
  "server": "biorxiv"
}

// curl -v https://api.crossref.org/works/10.1101/641381/transform -H "Accept: application/vnd.crossref.unixref+xml"
// seems the record has been updated on 2021-01-05, despite no new versions being added on biorxiv; possibly citations-related
// hence there can be many instanced of this event appearing across time
const externalArticleIndexedByCrossref = `
  <doi_record owner="10.1101" timestamp="2021-01-05 21:55:09">
  ...
  <contributors>
    <person_name contributor_role="author" sequence="first">
      <given_name>Hiroaki</given_name>
      <surname>Tachiwana</surname>
      <ORCID>http://orcid.org/0000-0001-9227-7653</ORCID>
    </person_name>
    ...
    <person_name contributor_role="author" sequence="additional">
      <given_name>Noriko</given_name>
      <surname>Saitoh</surname>
    </person_name>
  </contributors>
  <titles>
    <title>Chromatin structure-dependent histone incorporation revealed by a genome-wide deposition assay</title>
  </titles>
  <posted_date>
    <month>05</month>
    <day>17</day>
    <year>2019</year>
  </posted_date>
  ...
  <abstract>
      <title>Abstract</title>
      <p>In eukaryotes, histone variant distribution within the genome is the key epigenetic feature. To understand how each histone variant is targeted to the genome, we developed a new method, in which epitope-tagged histone complexes are introduced into permeabilized cells and incorporated into their chromatin. We found that the incorporation of histones H2A and H2A.Z mainly occurred at less condensed chromatin (open), suggesting that the condensed chromatin (closed) is a barrier for histone incorporation. To overcome this barrier, H2A, but not H2A.Z, uses a replication-coupled deposition mechanism. This led to the recapitulation of the pre-existing chromatin structure: the genome-wide even distribution of H2A and the exclusion of H2A.Z from the closed chromatin. Intriguingly, an H2A.Z mutant with mutations in the developmentally essential region was incorporated into closed chromatin. Our study revealed that the combination of chromatin structure and DNA replication dictates the differential histone deposition for maintaining the epigenetic chromatin states.</p>
  </abstract>
  <citation_list>
    <citation key="2021010511093039000_641381v2.1">
      <doi>10.1083/jcb.111.3.807</doi>
    </citation>
    ...
`;

// using PRC-terminology here, and trying to break off from the bioRxiv and Crossref Ubiquitous Languages
// the Sensor produces minimal internal Domain Events from the external Domain Events
const relevantDomainEvents = [
  {
    date: new Date(externalArticleVersionPostedOnBiorxiv1.date),
    type: 'ArticlePublished',
    articleId: new Doi(externalArticleVersionPostedOnBiorxiv1.doi),
    title: sanitizeHtml(externalArticleVersionPostedOnBiorxiv1.title),
    authors: externalArticleVersionPostedOnBiorxiv1.authors.split(';').map((author) => author.trim()),
  },
  {
    date: new Date('2019-05-18'), // estimated 1 day later than the previous event, due to Crossref indexing delay
    type: 'ArticleDetailsUpdated', // terrible name for a CRUD-oriented event
    articleId: new Doi(externalArticleVersionPostedOnBiorxiv1.doi),
    authors: [
      'Hiroaki Tachiwana',
      'Mariko Dacher',
      'Kazumitsu Maehara',
      'Akihito Harada',
      'Yasuyuki Ohkawa',
      'Hiroshi Kimura',
      'Hitoshi Kurumizaka',
      'Noriko Saitoh',
    ],
    // no title to update
  },
  // not really necessary for the page header
  //{
  //  type: 'ArticleNewVersionPublished',
  //  date: new Date(externalArticleVersionPostedOnBiorxiv2.date),
  //  version: 2,
  //},
];

console.log(relevantDomainEvents);

type PageHeaderViewModel = {
  id: Doi,
  title: HtmlFragment,
  authors: Array<string>,
}

// a projection can now build this without external calls
const pageHeaderViewModelExample: PageHeaderViewModel = {
  id: relevantDomainEvents[0].articleId, 
  title: relevantDomainEvents[0].title as HtmlFragment, // ignore unnecessary cast because of the type inference on relevantDomainEvents
  authors: relevantDomainEvents[1].authors,
}

describe('render-page-header-with-events', () => {
  it.todo('renders inside an header tag');
  it.todo('renders the title for an article');
  it.todo('renders the article DOI according to CrossRef display guidelines');
  it.todo('renders the article authors');
});

// consequences:
// 1. articles can appear several days earlier than Crossref indexing (or we can decide not to include them on some condition like lack of evaluations)
// 2. articles authors change their form in the first few days from `Tachiwana, H.` to `Hiroaki Tachiwana` (if we want)
// 3. articles authors and title can still change over time and versions (if we are worried about it)
// 4. search page can have the same authors as article page
// 5. in general pages show always the same title, no temporary `an article` title stand-in
// 6. no external calls to cache (but data may still be missing for the projection)
// 7. exercise: what happens if a user adds an article to a list, and the title changes due to a new version?
