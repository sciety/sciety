import { Result } from 'true-myth';
import Doi from '../types/doi';

type RenderRecommendations = (doi: Doi) => Promise<Result<string, never>>;

export default (): RenderRecommendations => (
  async (doi) => {
    let recommendations = '';
    if (doi.value === '10.1101/2020.06.03.20119925') {
      recommendations = `<section id="recommendations">
        <article class="content">
          <h3>
          Recommended by
          <a href="/editorial-communities/19b7464a-edbe-42e8-b7cc-04d1eb1f7332" id="review-0-editorial-community">
            Peer Community in Evolutionary Biology
          </a>
          </h3>
          <p>
          Sequencing and analyzing SARS-Cov-2 genomes in nearly real time has the potential
          to quickly confirm (and inform) our knowledge of, and response to, the current pandemic 
          [1,2]. In this manuscript [3], Danesh and colleagues use the earliest set of
          available SARS-Cov-2 genome sequences available from France to make inferences
          about the timing of the major epidemic wave, the duration of infections,
           and the efficacy of lockdown measures. Their phylodynamic estimates -- based on
          fitting genomic data to molecular clock and transmission models -- are reassuringly 
          close to estimates based on 'traditional' epidemiological methods: the French 
          epidemic likely began in mid-January or early February 2020, and spread relatively 
          rapidly (doubling every 3-5 days), with people remaining infectious for a median 
          of 5 days [4,5]. These transmission parameters are broadly in line with estimates 
          from China [6,7], but are currently unknown in France (in the absence of contact 
          tracing data). By estimating the temporal reproductive number (Rt), the authors 
          detected a slowing down of the epidemic in the most recent period of the study, 
          after mid-March, supporting the efficacy of lockdown measures. 
          </p>
        </article>
      </section>
      `;
    }
    return Result.ok(recommendations);
  }
);
