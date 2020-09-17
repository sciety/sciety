import { URL } from 'url';
import axios from 'axios';
import { GetRecommendationContent } from './get-hardcoded-recommendations';
import { Logger } from '../infrastructure/logger';

export default (logger: Logger): GetRecommendationContent => (
  async (url: URL) => {
    const { data: html } = await axios.get<string>(url.toString(), { headers: { Accept: 'text/html' } });

    logger('debug', 'Fetched PCI page', { html });

    return `
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
    `;
  }
);
