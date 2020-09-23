export default (): string => `
<article class="hive-grid hive-grid--article">
  <div class="main-content">
    
    <header>
      <h1>Human Prostate Cancer-Associated Macrophage Subtypes with Prognostic Potential Revealed by Single-cell Transcriptomics</h1>

      <ol aria-label="Authors of this article" role="list" class="article-author-list">
        <li>Joseph C Siefert</li>
        <li>Bianca Cioni</li>
        <li>Mauro J Muraro</li>
        <li>Mohammed Alshalalfa</li>
        <li>Judith Vivié</li>
        <li>Henk van der Poel</li>
        <li>Felix Y Feng</li>
        <li>Lodewyk Wessels</li>
        <li>Wilbert Zwart</li>
        <li>Andries M Bergman</li>
      </ol>

      <ul aria-label="Publication details" class="article-meta-data-list" role="list">
        <li>
          DOI <a href="https://doi.org/10.1101/2020.06.19.160770">10.1101/2020.06.19.160770</a>
        </li>
        <li>
          Posted <time datetime="2020-06-20">Jun 20, 2020</time>
        </li>
      </ul>

    </header>
    
    <section role="doc-abstract">
      <h2>
        Abstract
      </h2>
          
          
      <p>Macrophages in the tumor microenvironment are causally linked with prostate cancer development and progression, yet little is known about their composition in neoplastic human tissue. By performing single cell transcriptomic analysis of human prostate cancer resident macrophages, three distinct populations were identified in the diseased prostate. Unexpectedly, macrophages isolated from the tumor-adjacent site of the prostatectomy specimen were identical to those from the tumorous site. Markers associated with canonical M1 and M2 macrophage phenotypes were identifiable, however these were not the main factors defining unique subtypes. The genes selectively associated with each macrophage cluster were used to develop a gene signature which was highly associated with both recurrence-free and metastasis-free survival. These results highlight the relevance of tissue-specific macrophage subtypes in the tumour microenvironment for prostate cancer progression and demonstrates the utility of profiling single-cell transcriptomics in human tumor samples as a strategy to design gene classifiers for patient prognostication.</p>
      
      <a href="https://doi.org/10.1101/2020.06.19.160770">
        Read the full article
      </a>
    </section>
    
    <section>
      <h2>
        Evaluations
      </h2>
      <section class="evaluation-section">
        <h3> 
          <a href="/editorial-communities/b560187e-f2fb-4ff9-a861-a204f3fc0fb0" class="evaluation-section__community_link">
            <img class="evaluation-section__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
            <span>eLife</span>
          </a>
        </h3>
        <ol role="list" class="evaluation-section__summary_list">
          <li>  
            <article>          
              <h4>
                Summary of reviews
              </h4>
              <time datetime="2020-09-15" class="evaluation-section__summary_date">Sep 15, 2020</time>
              <p>
                    While we all considered the value of the dataset as a useful resource for the community, providing a
                    transcriptional landscape of prostatic monocytic cells, we all agreed that the study remains too
                    descriptive and primarily empirical correlations at this stage, with very limited mechanistic implications
                    and validation. In addition, the lack of healthy control, an incomplete bioinformatical analysis (batch
                    effects, other MPS cell clusters like cDCs), missing validation, and a limited number of cells/patients
                    dampened the enthusiasm of all the reviewers.
              </p>
              <p>
                    This review applies only to version 1 of the manuscript.
              </p>
      
    
              <section class="evaluation-section__reviews">
                <h5>
                  Reviews
                </h5>
                <ol role="list" class="evaluation-section__review_list">
                  <li>
                    <article>
                      <header class="evaluation-section__review_list__header">
                        <time datetime="2020-09-15">Sep 15, 2020</time>
                        <div>Reviewer #1:</div>
                      </header>
                      <p>In this manuscript Siefert et al., profile human prostate cancer-associated macrophage subtypes by single-cell RNA-seq. This analysis identified three major sub-population of macrophage (cluster-0, 1, and 2) in human prostate cancer and adjacent normal tissue. Next, the authors investigate the association of macrophage subtypes with recurrence and metastasis in independent prostate cancer cohorts. This leads to the identification of CSF1R+ (cluster-0) macrophage as a cell type associated with early recurrence and metastasis in prostate cancer. Overall this is an interesting study, however, in the absence of specific presence and/or enrichment of cluster-0 in tumor tissue it is not clear why these macrophages lead to early relapse or metastasis in prostate cancer. Moreover, the absence of any validation and/or functional analysis further diminish the broader implication of this observation.</p>
                      <p>1) Overall, the authors have employed very good QC parameters to filter superior quality cells. However, they detected batch effects in data (patient-specific clustering) and therefore employed batch correction methods. Unfortunately, after batch correction, they fail to detect tumor-specific macrophage populations in prostate cancer. The authors' reason that this could be due to the broader effect of 'tumor' on the adjacent normal ecosystem. However, in the absence of a comparison between macrophages from normal prostate and prostate tumor, it's difficult to conclude that tumors influence the macrophage in adjacent normal tissue. Given the well established phenomenon of tumor-associated macrophage this observation is surprising and an alternative explanation could be possible artifacts induced during the batch correction (i.e. integration) leading to the removal of subtle differences between tumor vs adjacent normal macrophages.</p>
                      <p>2) This study identifies three major sub-population of macrophages in prostate cancer. Authors discuss the limitation of M1/M2 nomenclature to define macrophage spectrum, which is evident from their analysis as well. However, they also don't provide a marker-based nomenclature of these macrophage clusters. It will be beneficial for the community to know the specific markers of these macrophage sub-populations which will be important for flow-cytometer or imaging-based validation of these populations. It is really important to validate the identity of single-cell RNA-seq clusters by flow or imaging analysis. However, the lack of validation remains one of the major limitations of this study. Not sure given the COVID situation it is possible but it will be very beneficial for the community.</p>
                      <p>3) It's not clear how cluster-0 macrophage leads to early relapse or metastasis. Given the higher expression of TNFa and IFN-g in cluster-0, it will be beneficial if authors can provide some discussion on this. Moreover, since cluster-0 is not unique to the tumor, does the frequency of these cells changes in the tumor ecosystem when compared to adjacent normal tissue? This quantification will be important to understand the possible implication of these cells in early relapse or metastasis.</p>
                      <p>4) A recent study by Huang et al., (Cell Death and Disease 2020) demonstrates the role of CCL5+ TAMs in promoting prostate cancer stem cells and metastatic phenotype. Do cluster-0 macrophages express CCL5 or any other marker which may facilitate replacement and metastasis.</p>
                    </article>
                  </li>
                  <li>
                    <article>
                      <header class="evaluation-section__review_list__header">
                        <time datetime="2020-09-15">Sep 15, 2020</time>
                        <div>Reviewer #2:</div>
                      </header>

                      <p>The manuscript is a single-cell RNA-seq approach to macrophages (CD3- and CD14/CD11b+) from prostatic adenocarcinoma tissue as well as adjacent non-tumorous prostate tissue. The authors find that three RNA-seq-defined macrophage subset clusters were found in both tumour and adjacent prostate in varying proportions in their patient series. These clusters show only weak associations of expression of genes related to the 'M1' and 'M2' macrophage activation status. They also show no differential association of expression of genes involved in T cell response regulation. One cluster appears to show evidence of NF-kappaB and WNT signalling but little interferon signalling, while another shows strong interferon signalling but poor WNT signalling, and the third cluster ('cluster 1') appears likely to consist of cells in cycle. These are intriguing populations for further work.</p>
                      <p>The authors then derive a differentially expressed gene signature, and show that it correlates with clinically relevant parameters in publicly available data sets. These correlations are very interesting from a translational perspective.</p>
                      <p>The data are substantive, and provide a valuable resource database for the transcriptional landscape of prostatic monocytic cells. However, the findings remain primarily empirical correlations at this stage, with very limited mechanistic implications.</p>
                      <p>1) The patient numbers analysed are very small. There are only four clinical samples (with three biopsies each) from which both tumour and non-tumour tissue has been used. There are no prostate samples without tumours similarly analysed to provide any indications about the 'normal' (and perhaps true 'tissue-resident') macrophage populations of the human prostate. It is thus difficult to interpret the monocytic cells analysed as blood-derived or of tissue-resident origin, limiting mechanistic speculation. It is also not clear if the observed patterns of monocytic lineage subsets are generated in patients prior to or after initiation of malignancy.</p>
                      <p>2) The cell numbers analysed are quite small as well. From four patient samples analysed, a total of 641 cells have been used for the RNA-seq-based analysis. This means an average of about 160 cells per patient sample, including both tumour and non-tumour tissue (an average of eighty cells from each location, perhaps). This seems a relatively thin basis for major interpretations.</p>
                      <p>3) Further to the above concern, there is no indication of the immune cell infiltrate density, especially monocytic cell density, in the various individual tumour samples, nor any analysis of the landscape of the immune cell infiltrate, for correlation with the monocytic lineage transcriptional groups for further mechanistic speculations. This is, again, compounded by the availability of only four patient samples.</p>
                      <p>4) There is no independent validation that there are indeed three monocytic subsets in prostatic tumours with clustered differential protein expression of interferon, WNT and cell cycle pathways, leaving the functional assumptions without rigorous support.</p>
                      <p>5) There is no clarity regarding the macrophage gene signature derived from the integrated dataset. As a result, while there is translational value to its associations with clinically relevant parameters, the biological interpretation remains unclear, since it is not clear that these genes are not expressed in non-monocytic cells in prostatic tumour biopsies, especially given that the differential expression consists of genes in the NF-kappaB, WNT and interferon pathways.</p>
                    </article>
                  </li>
                  <li>
                    <article>
                      <header class="evaluation-section__review_list__header">
                        <time datetime="2020-09-15">Sep 15, 2020</time>
                        <div>Reviewer #3:</div>
                      </header>

                      <p>The work by the group of Andries Bergman investigates the heterogeneity of macrophages in prostate cancer. They identified three macrophage subsets in tumorigenic tissue, which were also present in adjacent areas. All three subpopulations were clearly distinct on the molecular level, however, none of these subsets had a clear M1 or M2 phenotype. Accordingly a gene signature could be extracted that correlates with metastasis-free survival of patients and might have prognostic value.</p>
                      <p>Even though the manuscript is interesting, well written and the finding that no clear difference in macrophage composition is evident between adjacent and tumorigenic areas is surprising and new, the paper is not sufficient in its current form to fully support the presented messages.</p>
                      <p>Main points:</p>
                      <p>1) The authors state that they identified three distinct populations of tissue resident macrophages in prostate tissue, independent of the localisation. This finding is surprising, since an accumulation of monocyte-derived tumor(-associated) macrophages can be observed in almost all tumors. According to the material and methods section, the authors did not digest their tissue. What is the impact of digestion vs. non-digestion on macrophage recovery from human prostate tissue? Is it possible that especially tissue-resident macrophage subsets embedded in the parenchyma were missed? A detailed flow cytometry experiment needs to be performed in order to identify the most sensitive but at the same time most efficient isolation procedure that captures all possible macrophage subsets. Advanced flow cytometry with a broader antibody spectrum (e.g. CX3CR1, CD11c, CD14, CD16….) needs to be used to characterise the myeloid composition in more detail. Maybe even more sophisticated methods like CyTOF are advisable and recommended (See et al., 2017).</p>
                      <p>2) The authors call the identified cells "tissue resident macrophages". However, a closer examination of the genes in the identified clusters suggest, that cluster 0 might refer to (monocyte-derived) macrophages (identified by Cx3cr1, Ms4a7, Trem2, C1q; Chakarov et al., 2019), cluster 1 to cDC1 dendritic cells (identified by Flt3, Cd207, Fcer1a, Clec10a; Heger et al., 2018; Dutertre et al., 2019) and cluster 2 likely to extravasated monocytes (high levels of S100A genes, Ifi30 and Lyz; Kapellos et al., 2019). Therefore, maybe only cluster 0 reflects true (interstitial?) tissue resident macrophages. Accordingly, the bioinformatic analysis has to be strongly intensified and the data needs to be compared to other recently published work in order to identify for instance the signatures of tissue-resident macrophages, interstitial macrophages, monocyte-derived cells and monocytes. The authors have to familiarise themselves with the common nomenclature and the state-of-the-art identification of human mononuclear phagocytes (including cDCs) based on their transcriptomic signatures.</p>
                      <p>3) The authors speculate in the discussion part that the tumor influences distant macrophages through tumorigenic factors, which might be of prognostic value. In order to make such a statement, the authors have to show the transcriptome signature of macrophages isolated from tumor-free patients. Only a direct comparison between 'healthy' and 'tumorigenic' tissue can uncover tumor-dependent effects on macrophage transcriptomes and composition.</p>
                      <p>4) Close histological examination with subset specific markers needs to be performed to show that indeed no cellular difference exists between the localisation of macrophages in adjacent and tumorigenic areas. This should be compared to 'healthy' tissue (see previous point).</p>
                    </article>
                  </li>
                </ol>
              </section>

            </article>
          </li>
        </ol>
      </section>
    </section>
    
    <section>
      <h2>Version timeline</h2>
      <ol>
        <li>
          <time datetime="2020-06-20">Jun 20, 2020</time>: <a href="https://www.biorxiv.org/content/10.1101/2020.06.19.160770v1">
            Version 1 on Biorxiv
          </a>
        </li>
      </ol>
    </section>
  </div>
</article>
`;
