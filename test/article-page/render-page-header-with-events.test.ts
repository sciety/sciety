// https://api.biorxiv.org/details/biorxiv/10.1101/641381

import { Doi } from "../../src/types/doi";
import { SanitisedHtmlFragment } from "../../src/types/sanitised-html-fragment";

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



type PageHeaderViewModel = {
  doi: Doi,
  title: SanitisedHtmlFragment,
  authors: Array<string>,
}

describe('render-page-header-with-events', () => {
  it.todo('renders inside an header tag');
  it.todo('renders the title for an article');
  it.todo('renders the article DOI according to CrossRef display guidelines');
  it.todo('renders the article authors');
});
