import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, identity, pipe } from 'fp-ts/function';
import { fetchCrossrefArticle } from '../../../src/third-parties/crossref/fetch-crossref-article';
import * as DE from '../../../src/types/data-error';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';

describe('fetch-crossref-article', () => {
  const doi = arbitraryDoi();

  it('uses the correct url and accept header', async () => {
    const getXml = jest.fn();
    await fetchCrossrefArticle(getXml, dummyLogger, O.none)(doi)();

    expect(getXml).toHaveBeenCalledWith(
      `https://api.crossref.org/works/${doi.value}/transform`,
      expect.objectContaining({
        Accept: 'application/vnd.crossref.unixref+xml',
      }),
    );
  });

  describe('the request fails', () => {
    it('returns an error result', async () => {
      const getXml = async (): Promise<never> => {
        throw new Error('HTTP timeout');
      };
      const result = await pipe(
        doi,
        fetchCrossrefArticle(getXml, dummyLogger, O.none),
        T.map(flow(
          E.matchW(
            identity,
            shouldNotBeCalled,
          ),
          DE.isNotFound,
        )),
      )();

      expect(result).toBe(true);
    });
  });

  describe('when crossref returns an invalid XML document', () => {
    it('throws an error', async () => {
      const getXml = async (): Promise<string> => '';
      const result = await pipe(
        doi,
        fetchCrossrefArticle(getXml, dummyLogger, O.none),
        T.map(flow(
          E.matchW(
            identity,
            shouldNotBeCalled,
          ),
          DE.isUnavailable,
        )),
      )();

      expect(result).toBe(true);
    });
  });

  describe('when crossref returns unusable authors', () => {
    it('returns a Right', async () => {
      const getXml = async (): Promise<string> => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record owner="10.1101" timestamp="2021-11-11 04:35:20">
    <crossref>
      <posted_content type="preprint" language="en" metadata_distribution_opts="any">
        <group_title>Epidemiology</group_title>
        <titles>
          <title>Describing the population experiencing COVID-19 vaccine breakthrough following second vaccination in England: A cohort study from OpenSAFELY</title>
        </titles>
        <posted_date>
          <month>11</month>
          <day>08</day>
          <year>2021</year>
        </posted_date>
        <acceptance_date>
          <month>11</month>
          <day>08</day>
          <year>2021</year>
        </acceptance_date>
        <institution>
          <institution_name>medRxiv</institution_name>
        </institution>
        <item_number item_number_type="pisa">medrxiv;2021.11.08.21265380v1</item_number>
        <abstract>
          <title>Abstract</title>
          <sec>
            <title>Background</title>
            <p>While the vaccines against COVID-19 are considered to be highly effective, COVID-19 vaccine breakthrough is likely and a small number of people will still fall ill, be hospitalised, or die from COVID-19, despite being fully vaccinated. With the continued increase in numbers of positive SARS-CoV-2 tests, describing the characters of individuals who have experienced a COVID-19 vaccine breakthrough could be hugely important in helping to determine who may be at greatest risk.</p>
          </sec>
          <sec>
            <title>Method</title>
            <p>With the approval of NHS England we conducted a retrospective cohort study using routine clinical data from the OpenSAFELY TPP database of fully vaccinated individuals, linked to secondary care and death registry data, and described the characteristics of those experiencing a COVID-19 vaccine breakthrough.</p>
          </sec>
          <sec>
            <title>Results</title>
            <p>
              As of 30
              <sup>th</sup>
              June 2021, a total of 10,782,870 individuals were identified as being fully vaccinated against COVID-19, with a median follow-up time of 43 days (IQR: 23-64). From within this population, a total of 16,815 (0.1%) individuals reported a positive SARS-CoV-2 test. For every 1000 years of patient follow-up time, the corresponding incidence rate was 12.33 (95% CI 12.14-12.51). There were 955 COVID-19 hospital admissions and 145 COVID-19-related deaths; corresponding incidence rates of 0.70 (95% CI 0.65-0.74) and 0.12 (95% CI 0.1-0.14), respectively. When broken down by the initial priority group, higher rates of hospitalisation and death were seen in those in care homes. Comorbidities with the highest rates of breakthrough COVID-19 included renal replacement therapy, organ transplant, haematological malignancy, and immunocompromised.
            </p>
          </sec>
          <sec>
            <title>Conclusion</title>
            <p>The majority of COVID-19 vaccine breakthrough cases in England were mild with relatively few fully vaccinated individuals being hospitalised or dying as a result. However, some concerning differences in rates of breakthrough cases were identified in several clinical and demographic groups. The continued increase in numbers of positive SARS-CoV-2 tests are concerning and, as numbers of fully vaccinated individuals increases and follow-up time lengthens, so too will the number of COVID-19 breakthrough cases. Additional analyses, aimed at identifying individuals at higher risk, are therefore required.</p>
          </sec>
        </abstract>
        <doi_data>
          <doi>10.1101/2021.11.08.21265380</doi>
          <timestamp>2021111101350617000</timestamp>
          <resource>http://medrxiv.org/lookup/doi/10.1101/2021.11.08.21265380</resource>
          <collection property="crawler-based">
            <item crawler="iParadigms">
              <resource>https://syndication.highwire.org/content/doi/10.1101/2021.11.08.21265380</resource>
            </item>
          </collection>
        </doi_data>
        <citation_list>
          <citation key="2021111101350617000_2021.11.08.21265380v1.1">
            <unstructured_citation>Coronavirus (COVID-19) in the UK. In: GOV.UK. https://coronavirus.data.gov.uk/details/vaccinations. Accessed 9 Sep 2021</unstructured_citation>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.2">
            <doi>10.1056/NEJMoa2108891</doi>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.3">
            <doi>10.1136/bmj.n1088</doi>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.4">
            <unstructured_citation>OpenSAFELY. https://www.opensafely.org/. Accessed 20 Oct 2021</unstructured_citation>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.5">
            <unstructured_citation>Emergency use ICD codes for COVID-19 disease outbreak. https://www.who.int/classifications/classification-of-diseases/emergency-use-icd-codes-for-covid-19-disease-outbreak. Accessed 20 Oct 2021</unstructured_citation>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.6">
            <unstructured_citation>UK Health Security Agency (2020) COVID-19: the green book, chapter 14a. https://www.gov.uk/government/publications/covid-19-the-green-book-chapter-14a. Accessed 20 Oct 2021</unstructured_citation>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.7">
            <unstructured_citation>COVID-19 Vaccination Uptake Reporting Specification. PRMIS. https://www.nottingham.ac.uk/primis/covid-19/covid-19.aspx. Accessed 20 Jun 2021</unstructured_citation>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.8">
            <doi provider="crossref">10.1136/annrheumdis-2021-221326</doi>
            <unstructured_citation>Cook C , Patel NJ , D’Silva KM , et al (2021) Clinical characteristics and outcomes of COVID-19 breakthrough infections among vaccinated patients with systemic autoimmune rheumatic diseases. Ann Rheum Dis. https://doi.org/10.1136/annrheumdis-2021-221326</unstructured_citation>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.9">
            <journal_title>N Engl J Med</journal_title>
            <volume>385</volume>
            <first_page>1330</first_page>
            <cYear>2021</cYear>
            <doi provider="crossref">10.1056/NEJMc2112981</doi>
            <article_title>Resurgence of SARS-CoV-2 Infection in a Highly Vaccinated Health System Workforce</article_title>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.10">
            <journal_title>JAMA Netw Open</journal_title>
            <volume>4</volume>
            <first_page>e2125394</first_page>
            <cYear>2021</cYear>
            <doi provider="crossref">10.1001/jamanetworkopen.2021.25394</doi>
            <article_title>Association Between Exposure Characteristics and the Risk for COVID-19 Infection Among Health Care Workers With and Without BNT162b2 Vaccination</article_title>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.11">
            <doi provider="crossref">10.1016/S1473-3099(21)00460-6</doi>
            <unstructured_citation>Antonelli M , Penfold RS , Merino J , et al (2021) Risk factors and disease profile of post-vaccination SARS-CoV-2 infection in UK users of the COVID Symptom Study app: a prospective, community-based, nested, case-control study. Lancet Infect Dis. https://doi.org/10.1016/S1473-3099(21)00460-6</unstructured_citation>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.12">
            <journal_title>BMJ</journal_title>
            <volume>374</volume>
            <first_page>2244</first_page>
            <cYear>2021</cYear>
            <article_title>Risk prediction of covid-19 related death and hospital admission in adults after covid-19 vaccination: national prospective cohort study</article_title>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.13">
            <doi provider="crossref">10.1136/bmj.n783</doi>
            <unstructured_citation>Day M (2021) Covid-19: Stronger warnings are needed to curb socialising after vaccination, say doctors and behavioural scientists. BMJ. https://doi.org/10.1136/bmj.n783</unstructured_citation>
          </citation>
          <citation key="2021111101350617000_2021.11.08.21265380v1.14">
            <doi>10.1056/NEJMoa2034577</doi>
          </citation>
        </citation_list>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
      `;
      const result = await pipe(
        doi,
        fetchCrossrefArticle(getXml, dummyLogger, O.none),
      )();

      expect(E.isRight(result)).toBe(true);
    });
  });
});
