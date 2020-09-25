const feed = `
  <section>
    <h2>Feed</h2>

    <ol role="list" class="article-feed">
    
      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-06-30">Jun 30, 2020</time>
          <p class="article-feed__item__title">
            <a href="https://elifesciences.org/articles/58925">
              Online version updated</a> by <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">eLife
            </a>
          </p>
        </div>
      </li>

      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-06-11">Jun 11, 2020</time>
          <p class="article-feed__item__title">
            <a href="https://elifesciences.org/articles/58925v2">
              Full online version published</a> by <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">eLife
            </a>
          </p>
        </div>
      </li>

      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-05-28">May 28, 2020</time>
          <p class="article-feed__item__title">
            <a href="https://elifesciences.org/articles/58925v1">
              Accepted manuscript published as PDF
            </a>
            by
            <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
              eLife
            </a>
          </p>
        </div>
      </li>
    
      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-05-18">May 18, 2020</time>
          <div class="article-feed__item__title">
            Accepted by
              <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
                eLife
              </a>
          </div>
          <details>
            <summary>
              <p>In this manuscript the authors develop a computational approach designed to identify robust genetic interactions that can be used to predict tumor cell genetic vulnerabilities. The authors find that oncogene addiction, as opposed to synthetic lethality, tends to be a more robust predictor of genetic dependencies in tumor cells. They also find that robust...</p>
            </summary>
           <p>genetic interactions in cancer are enriched for gene pairs whose protein products physically interact. Therefore, the latter could be considered a surrogate in target selection for tumors with currently undruggable driver oncogenes.</p>
           <a href="https://doi.org/10.7554/eLife.58925.sa1" class="article-feed__item__read_more article-call-to-action-link">
             Read the original source
           </a>
          </details>
        </div>
      </li>
    
      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-05-15">May 15, 2020</time>
          <p class="article-feed__item__title">
            Submitted to
            <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
              eLife
            </a>
          </p>
        </div>
      </li>
  
      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-05-14">May 14, 2020</time>
          <div class="article-feed__item__title">
                      Author responded to
            <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
              Review Commons
            </a>
            </div>
          <details>
          <summary>
            <blockquote>
              <p><strong>Reviewer #1</strong> (Evidence, reproducibility and clarity (Required)):</p>
              <p>***Summary:**</p>
              <p>Reproducibility of genetic interactions across studies is low. The authors identify reproducible genetic interactions and ask the question of what are properties of robust genetic interactions. They find that 1. oncogene addiction tends to be more robust than synthetic lethality and 2. ...</p>
            </blockquote>
          </summary>
            <blockquote>
              <p>genetic interactions among physically interacting proteins tend to be more robust. They then use protein-protein interactions (PPIs) to guide the detection of genetic interactions involving passenger gene alterations.</p>
              <p>**Major comments:**</p>
              <p>The claims of the manuscript are clear and well supported by computational analyses. My only concern is the influence of (study) bias on the observed enrichment of physical protein interactions among genetic interactions. 1. Due to higher statistical power the here described approach favors genetic interactions involving frequently altered cancer genes (as acknowledged by the authors). 2. Also some of the libraries in the genetic screens might be biased towards better characterized screens. 3. PPI networks are highly biased towards well studied proteins (in which well studied proteins - in particular cancer-related proteins - are more likely to interact). The following tests would help to clarify if and to which extend these biases contribute to the described observations:*</p>
            </blockquote>
            <p><strong>Our response:</strong> We thank the reviewer for the positive assessment of our manuscript and have addressed the issue of study bias in response to the specific queries below.</p>
            <p>*<br>
             1 . The authors should demonstrate that the PPI enrichment in reproducible vs non-reproducible genetic interactions is not solely due to the biased nature of PPI networks. One simple way of doing so would be to do the same analysis with a PPI network derived from a single screen (eg PMID: 25416956). I assume that due to the much lower coverage the effect will be largely reduced but it would be reconfirming to see a similar trend in addition to the networks on which the authors are already testing. Another way would be to use a randomized network (with the same degree distribution as the networks the authors are using and then picking degree matched random nodes) in which the observed effect should vanish.</p>
            <p>*</p>
            <p><strong>Our response:</strong> We appreciate the reviewer’s point and have now assessed both of the suggested approaches.</p>
            <p>The overlap with unbiased yeast two-hybrid (y2h) screens, even the recent HuRI dataset (Luck et al, Nature 2020), was too small in scale to draw any conclusions. Among the ~140,000 interactions tested for genetic interactions, only 51 overlap with y2h interactions. Two of the discovered genetic interactions were supported by a y2h interaction, while one of the robust genetic interactions was supported by a y2h interaction. While this is actually more than would be expected based on the overlap of interactions in the test space the numbers are not especially convincing.</p>
            <p>We therefore focused on two alternative assessments. We first compared our results with the network derived from the systematic AP-MS mapping of protein interactions in HEK293 cells (BioPlex 3.0, Huttlin et al, Biorxiv 2020). We restricted our analysis of genetic interactions to gene pairs that could conceivably be observed in the BioPlex dataset (i.e. between baits screened and preys expressed in HEK293T). We found that although the numbers were small, the same pattern of enrichment was observed:</p>
            <p>This analysis has now been added to the revised manuscript as Supplementary Table S4 and Figure S3E (shown below):</p>
            <p>We next compared the results we observed with the real STRING protein-protein interaction network to 100 degree-matched randomisations of this network. We observed that the number of discovered and validated genetic interactions observed using the real STRING interaction network was greater than that observed using the randomised networks. With this in mind, we have now revised the manuscript to state:</p>
            <p>‘Previous work has demonstrated that the protein-protein interaction networks aggregated in databases are subject to significant ascertainment bias – some genes are more widely studied than others and this can result in them having more reported protein-protein interaction partners than other genes(Rolland et al., 2014). As cancer driver genes are studied more widely than most genes, they may be especially subject to this bias. To ensure the observed enrichment of protein-protein interactions among genetically interacting pairs was not simply due to this ascertainment bias, we compared the results observed for the real STRING protein-protein interaction network with 100 degree-matched randomised networks and again found that there was a higher than expected overlap between protein-protein interactions and both discovered and validated genetic interactions (Supplemental Fig. S4).’</p>
            <p>__Supplemental Figure S4. Genetic interactions are more enriched in real protein-protein interaction networks than randomised networks. __Histograms showing the overlap between 100 degree matched randomisations of the STRING medium confidence protein-protein interaction and discovered (a and b) and validated (c and d) genetic interactions. The observed overlap with the real STRING protein interaction are highlighted with the orange lines.</p>
            <p>*<br>
             2 . What's the expected number of robust genetic interactions involving passenger gene alterations? Is it surprising to identify 11 interactions? This question could be addressed with some sort of randomization test: When selecting (multiple times) 47,781 non-interacting random pairs between the 2,972 passenger genes and 2,149 selectively lethal genes, how many of those pairs form robust genetic interactions?</p>
            <p>*</p>
            <p><strong>Our response:</strong> We have now addressed this as follows:</p>
            <p>“At an FDR of 20% we found 11 robust genetic interactions involving passenger gene alterations (Supplemental Table S6). To assess whether this is more than would be expected by chance we randomly sampled 47,781 gene pairs from the same search space 100 times. The median number of robust genetic interactions identified amongst these randomly sampled gene pairs was 1 (mean 1.27, min 0, max 6) suggesting that the 11 robust genetic interactions observed among protein-protein interacting pairs was more than would be expected by chance.”</p>
            <p>*<br>
             **Minor comments:**</p>
            <p>Two additional analyses would add in my opinion value to the manuscript:</p>
            <p>-The authors state that reasons for irreproducibility of genetic interactions are of technical or biological nature. Is it possible to disentangle the contribution of the two factors given the available data? Eg how many genetic interactions are reproducible in two different screening platforms using the same cell line vs how similar are results of screens from two different cell lines in the same study?</p>
            <p>*</p>
            <p>__Our response: __We are also very interested in this question, but with the available data, we are not confident that we could draw solid conclusions.</p>
            <p>*<br>
             -The authors state that "some of the robust genetic dependencies could be readily interpreted using known pathway structures" and argue that they recover for example MAPK or Rb pathway relationships. Is this a general trend? Do genes forming a robust genetic interactions have a higher tendency to be in the same pathway as opposed to different pathways? *</p>
            <p>__Our response: __We have now systematically tested the robust genetic interactions for each driver gene for enrichment in specific pathways. Relevant text is as follows:</p>
            <p>‘To test if this enrichment of pathway members among the robust dependencies associated with specific driver genes was a common phenomenon, for each driver gene with at least three dependencies we asked if these dependencies were enriched in specific signalling pathways (see Methods). Of the twelve driver genes tested, we found that five of these were enriched in specific pathways and in all five cases found that the driver gene itself was also annotated as a member of the most enriched pathway (Table SX). As expected* RB*1 (most enriched pathway ‘G1 Phase’) and *BRAF *(most enriched pathway ‘Negative feedback regulation of MAPK pathway’) were among the five driver genes, alongside *PTEN *(‘PI3K/AKT activation’), *CDKN2A *(‘Cell cycle’), and *NRAS *(‘Ras signaling pathway’).’</p>
            <p>Details in the methods are as follows:</p>
            <p>‘Pathway enrichment was assessed using gProfiler (Raudvere et al., 2019) with KEGG (Kanehisa et al., 2017) and Reactome (Jassal et al., 2020) as annotation databases and the selectively lethal genes as the background list.’</p>
            <p><em>I think the pathway topic could be in general better exploited: eg does pathway (relative) position play a role?</em>*</p>
            <p>*</p>
            <p>__Our response: __We agree that pathway position, especially distance from driver gene in an ordered pathway, would be very interesting to tease out but we don’t think that current pathway annotations are reliable enough nor the set of robust genetic interactions large enough to analyse this properly.</p>
            <p><em>Reviewer #1 (Significance (Required)):</em>*</p>
            <p>Personalized cancer medicine aims at the identification of patient-specific vulnerabilites which allow to target cancer cells in the context of a specific genotype. Many oncogenic mutations cannot be targeted with drugs directly. The identification of genetic interactions is therefore of crucial importance. Unfortunately, genetic interactions show little reproducibility accross studies. The authors make an important contribution to understanding which factors contribute to this reproducibility and thereby providing means to also identify more reliable genetic interactions with high potential for clinical exploitation or involving passenger gene alterations (which are otherwise harder to detect for statistical reasons).</p>
            <p>REFEREES CROSS COMMENTING</p>
            <p>Reviewer 2 raises a few valid points, which if addressed would certainly increase the clarity of the paper. In particular addressing the first point (the self interactions of tumor suppressors) seems important to me. From what I can see all of reviewer 2's comments can be addressed easily.</p>
            <p>*</p>
            <p><strong>End of Reviewer 1 comments</strong></p>
            <p><em>_
             _</em></p>
            <p><strong>Reviewer #2</strong> (Evidence, reproducibility and clarity (Required)):</p>
            <p>*In this manuscript, Lord et al. describe the analysis of loss-of-function (LOF) screens in cancer cell lines to identify robust (i.e., technically reproducible and shared across cell lines) genetic dependencies. The authors integrate data from 4 large-scale LOF studies (DRIVE, AVANA, DEPMAP and SCORE) to estimate the reproducibility of their individual findings and examine their agreement with other types of functional information, such as physical binding. The main conclusions from the analyses are that: a) oncogene-driven cancer cell lines are more sensitive to the inhibition of the oncogene itself than any other gene in the genome; b) robust genetic interactions (i.e., those observed in multiple datasets and cell lines driven by the same oncogene/tumour suppressor) are enriched for gene pairs encoding physically interacting proteins.</p>
            <p>**Main comments:**</p>
            <p>I think this study is well designed, rigorously conducted and clearly explained. The conclusions are consistent with the results and I don't have any major suggestions for improving their support. I do, however, have a few suggestions for clarifying the message.</p>
            <p>*</p>
            <p><strong>Our response:</strong> We thank the reviewer for this positive assessment of our manuscript and have addressed the requests for clarity below.</p>
            <p><em>-Could the authors provide some intuitive explanation (or speculation) about the 2 observed cases of tumour suppressor "addiction" (TP53 and CDKN2A)? While the oncogene addiction cases are relatively easy to interpret, the same effects on tumour suppressors are less clear. Is it basically an epistatic effect, which looks like a relative disadvantage? For example, if we measure fitness: TP53-wt = 1, TP53-wt + CRISPR-TP53 = 1.5, TP53-mut = 1.5, TP53-mut + CRISPR-TP53 = 1.5. That is, inhibiting TP53 in TP53 mutant cells appears to be disadvantageous (relative to WT) only because inhibiting TP53 in wild-type cells is advantageous?</em></p>
            <p>__Our response: __The reviewer is correct – the <em>TP53</em> / <em>TP53</em> dependency is similar to an epistatic effect. In a <em>TP53</em> mutant background targeting <em>TP53</em> with shRNA or CRISPR has a neutral effect, while in a TP53 wild type background targeting TP53 with shRNA or CRISPR often causes an increase in cell growth. We have clarified this in the text below (new text in bold)</p>
            <p>‘We also identified two (2/9) examples of ‘self <em>vs.</em> self’ dependencies involving tumour suppressors -*TP53 *(aka p53) and <em>CDKN2A</em> (aka p16/p14arf) (Supplemental Fig. S2c). This type of relationship has previously been reported for <em>TP53</em>: *TP53 *inhibition appears to offer a growth advantage to <em>TP53</em> wild type cells but not to *TP53 *mutant cells(Giacomelli et al., 2018). <strong>Inhibiting <em>TP53</em> in <em>TP53</em> mutant cells has a largely neutral effect, while on average inhibiting <em>TP53</em> in <em>TP53</em> wild type cells actually increases fitness growth. __Consequently, we observed an association between <em>TP53</em> status and sensitivity to TP53 inhibition. __A similar effect was observed for <em>CDKN2A,</em> although the growth increase resulting from inhibiting <em>CDKN2A</em> in wild-type cells is much lower than that seen for <em>TP53</em></strong> (Supplemental Fig. S2c).;</p>
            <p>*-In the analysis of overlap between genetic and physical interactions, the result should be presented more precisely. Currently, the text reads "when considering the set of all gene pairs tested, gene pairs whose protein products physically interact were more likely to be identified as significant genetic interactors". However, the referenced figure (Fig. 5a) shows an orthogonal perspective: relative to all gene pairs tested, those that have a significant genetic interaction are more likely to have a physical interaction as well. In other words, in the text, we are comparing the relative abundance of genetic interactions in 2 sets: tested and physically interacting. However, in the figure, we are comparing the relative abundance of protein interactions in 2 sets -- tested and genetically interacting. The odds ratio and the p-values stay the same but the result would be more clear if the figure matched the description in the text.</p>
            <p>*</p>
            <p>__Our response: __Due to the fact that genetic interactions are rare (~1% of all gene pairs tested have a discovered genetic interaction, ~0.1% have a validated genetic interaction) it’s hard to convey the enrichment effectively. This is demonstrated in the below figure – it’s clear that there are more discovered / validated genetic interaction pairs among the protein-protein interaction pairs but the scale is hard to appreciate:</p>
            <p>Focusing only on the discovered/validated genetic interactions makes the picture a little clearer but does not effectively show that the discovered pairs themselves are enriched among protein-protein interaction pairs</p>
            <p>As we feel the original figures convey the main message most effectively, we have altered the text rather than the images as follows:</p>
            <p>“We found that, when considering the set of all gene pairs tested, gene pairs identified as significant genetic interactors in at least one dataset are more likely to encode proteins that physically interact (Fig. 5a)”</p>
            <p>***Minor comments:**</p>
            <p>There're a few places where the more explicit explanation would improve the readability of the manuscript.</p>
            <p>-Page 5: The multiple regression model used to identify genetic interactions is briefly mentioned in the text (and described more extensively in the methods). I think it would be better to explicitly describe the dependent and independent variables of the model in the text, so that the reader can intuitively understand what is being estimated*.</p>
            <p><strong>Our response:</strong> We have added additional information to the main text as follows:</p>
            <p>‘This model included tissue type, microsatellite instability and driver gene status as independent variables and gene sensitivity score as the dependent variable (Methods). Microsatellite instability was included as a covariate as it has previously been shown to be associated with non-driver gene specific dependencies (Behan et al., 2019), while tissue type was included to avoid confounding by tissue type.’*</p>
            <p>-Page 5: "Using this approach, we tested 142,477 potential genetic dependencies…" -- could the authors provide a better explanation of where that number is coming from? E.g., 142,477 = … driver genes x 2470 selectively lethal genes?*</p>
            <p><strong>Our response:</strong> Because not every selectively lethal gene is tested in every dataset (e.g. DRIVE only screened ~8,000 genes instead of the whole genome) the 142,477 number does not correspond to a simple multiplication of number of driver genes times number of selectively lethal gene. However, we have added additional information in bold as follows:</p>
            <p>‘Using this approach, we tested 142,477 potential genetic dependencies <strong>between 61 driver genes and 2,421 selectively lethal genes</strong>. We identified 1,530 dependencies that were significant in at least one discovery screen (Fig. 2a, Supplemental Fig. S1). <strong>All 61 driver genes had at least one dependency that was significant in at least one discovery screen while less than half of the selectively lethal genes (1,141 / 2,421) had a significant association with a driver gene</strong>. Of the 1,530 dependencies that were significant in at least one discovery screen, only 229 could be validated in a second screen (Supplemental Table S3, Fig. 2a). For example, in the AVANA dataset <em>TP53</em> mutation was associated with resistance to inhibition of both <em>MDM4</em> and <em>CENPF</em>, but only the association with <em>MDM4</em> could be validated in a second dataset (Fig. 2b, 2c). Similarly, in the DEPMAP dataset *NRAS *mutation was associated with increased sensitivity to the inhibition of both <em>NRAS</em> itself and <em>ERP44</em>, but only the sensitivity to inhibition of <em>NRAS</em> could be validated in a second dataset (Fig. 2b, 2c).</p>
            <p><strong>The 229 reproducible dependencies involved 31 driver genes and 204 selectively lethal genes</strong>.’</p>
            <p><em>-Page 5: Repeating the number of findings of each type would help understanding the landscape of the genetic dependencies (suggested numbers in brackets): "Of the (229?) reproducible genetic dependencies nine were 'self vs self' associations". "The majority (7/9?) of these … were oncogene addiction effects". "We also identified 2 (2/9?) examples of 'self vs self' dependencies involving tumour suppressors".</em></p>
            <p>__Our response: __We have taken the reviewer’s advice and added these figures to the main text for clarity</p>
            <p>*<br>
             -Page 12: "Three of these interactions involve genes frequently deleted with the tumour suppressor CDKN2A (CDKN2B and MTAP) and mirror known associations with CDKN2A". It is not clear what "mirror" means -- do they recapitulate known interactions?</p>
            <p>*</p>
            <p><strong>Our response:</strong> Yes, we meant to indicate that they recapitulate known CDKN2A interactions and have now replaced ‘mirror’ with ‘recapitulate’.</p>
            <p>*<br>
             -Page 15: "Although we have not tested them here, other features predictive of between-species conservation may also be predictive of robustness to genetic heterogeneity" -- could the authors explicitly list the features?*</p>
            <p>__Our response: __We have now explicitly listed these features as follows:</p>
            <p>“Previous work has also shown that genetic interactions between gene pairs involved in the same biological process, as indicated by annotation to the same gene ontology term, are more highly conserved across species (Ryan et al., 2012; Srivas et al., 2016). Similarly, genetic interactions that are stable across experimental conditions (e.g. that can be observed in the presence and absence of different DNA damaging agents) are more likely to be conserved across species (Srivas et al., 2016). Although we have not tested them here, these additional features predictive of between-species conservation may also be predictive of robustness to genetic heterogeneity.”</p>
            <p>*Reviewer #2 (Significance (Required)):</p>
            <p>The identification of a significant overlap between genetic and physical interactions in cancer cell lines is an interesting and promising observation that will help understanding known genetic dependencies and predicting new ones. However, similar observations have been made in other organisms and biological systems. These past studies should be referenced to provide a historical perspective and help define further analyses in the cancer context. In particular, studies in yeast S. cerevisiae have shown that, not only there is a general overlap between genetic interactions (both positive and negative) and physical interactions, but at least 2 additional features are informative about the relationship: a) the relative strength of genetic interactions and b) the relative density of physical interactions (i.e., isolated interaction vs protein complexes). Here's a sample of relevant studies: 1) von Mering et al., Nature, 2002; 2) Kelley &amp; Ideker, Nat Biotechnol, 2005; 3) Bandyopadhyay et al., PLOS Comput Biol, 2008; 4) Ulitsky et al., Mol Syst Biol, 2008; 5) Baryshnikova et al., Nat Methods, 2010; 6) Costanzo et al., Science, 2010; 7) Costanzo et al., Science, 2016.</p>
            <p>Similar observations have also been made in mammalian systems: e.g., in mouse fibroblasts (Roguev et al., Nat Methods, 2013) and K562 leukemia cells (Han et al., Nat Biotech, 2017). I don't think that past observations negate the novelty of this manuscript. The analysis presented here is more focused and more comprehensive as it is based on a large integrated dataset and is driven by a series of specific hypotheses. However, a reference to previous publications should be made.</p>
            <p>As a frame of reference: my expertise is in high-throughput genetics of model organisms, including mapping and analyzing genetic interactions.</p>
            <p>*</p>
            <p>__Our response: __We thank the reviewer for highlighting this point.</p>
            <p>We have attempted to provide better context for our work in the discussion as follows:</p>
            <p>‘In budding and fission yeast, multiple studies have shown that genetic interactions are enriched among protein-protein interaction pairs and <em>vice-versa</em> (Costanzo et al., 2010; Kelley and Ideker, 2005; Michaut et al., 2011; Roguev et al., 2008). Pairwise genetic interaction screens in individual mammalian cell lines have also revealed an enrichment of genetic interactions among protein-protein interaction pairs (Han et al., 2017; Roguev et al., 2013). Our observation that discovered genetic interactions are enriched in protein-protein interaction pairs is consistent with these studies. However, these studies have not revealed what factors influence the conservation of genetic interactions across distinct genetic backgrounds, i.e. what predicts the robustness of a genetic interaction. In yeast, the genetic interaction mapping approach relies on mating gene deletion mutants and consequently the vast majority of reported genetic interactions are observed in a single genetic background (Tong et al., 2001). In mammalian cells, pairwise genetic interaction screens across multiple cell lines have revealed differences across cell lines but not identified what factors influence the conservation of genetic interactions across cell lines(Shen et al., 2017). While variation of genetic interactions across different strains or different genetic backgrounds has been poorly studied, previous work has analysed the conservation of genetic interactions across <em>species</em> and shown that genetic interactions between gene pairs whose protein products physically interact are more highly conserved (Roguev et al., 2008; Ryan et al., 2012; Srivas et al., 2016). Our analysis here suggests that the same principles may be used to identify genetic interactions conserved across genetically heterogeneous tumour cell lines.’</p>
          <a href="https://hyp.is/GFEW8JXMEeqJQcuc-6NFhQ/www.biorxiv.org/content/10.1101/646810v2" class="article-feed__item__read_more article-call-to-action-link">
            Read the original source
          </a>
          </details>
        </div>
      </li>

      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-05-14">May 14, 2020</time>
          <div class="article-feed__item__title">
            Reviewed by
            <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
              Review Commons
            </a>
          </div>
          <details>
          <summary>
            <h3>Summary</h3>
            <p>
              Reproducibility of genetic interactions across studies is low. The authors identify reproducible genetic interactions and ask the question of what are properties of robust genetic interactions. They find that 1. oncogene addiction tends to be more robust than synthetic lethality and 2. genetic interactions among physically interacting proteins tend to be more ...
            </p>
          </summary>
          <p>
            robust. They then use protein-protein interactions (PPIs) to guide the detection of genetic interactions involving passenger gene alterations.
          </p>
          <h3>Major comments</h3>
           <p>The claims of the manuscript are clear and well supported by computational analyses. My only concern is the influence of (study) bias on the observed enrichment of physical protein interactions among genetic interactions. 1. Due to higher statistical power the here described approach favors genetic interactions involving frequently altered cancer genes (as acknowledged by the authors). 2. Also some of the libraries in the genetic screens might be biased towards better characterized screens. 3. PPI networks are highly biased towards well studied proteins (in which well studied proteins - in particular cancer-related proteins - are more likely to interact). The following tests would help to clarify if and to which extend these biases contribute to the described observations:  <br>
              1 . The authors should demonstrate that the PPI enrichment in reproducible vs non-reproducible genetic interactions is not solely due to the biased nature of PPI networks. One simple way of doing so would be to do the same analysis with a PPI network derived from a single screen (eg PMID: 25416956). I assume that due to the much lower coverage the effect will be largely reduced but it would be reconfirming to see a similar trend in addition to the networks on which the authors are already testing. Another way would be to use a randomized network (with the same degree distribution as the networks the authors are using and then picking degree matched random nodes) in which the observed effect should vanish.</p>
          <p>2 . What's the expected number of robust genetic interactions involving passenger gene alterations? Is it surprising to identify 11 interactions? This question could be addressed with some sort of randomization test: When selecting (multiple times) 47,781 non-interacting random pairs between the 2,972 passenger genes and 2,149 selectively lethal genes, how many of those pairs form robust genetic interactions?</p>
          <p><strong>Minor comments:</strong></p>
          <p>Two additional analyses would add in my opinion value to the manuscript:</p>
          <p>-The authors state that reasons for irreproducibility of genetic interactions are of technical or biological nature. Is it possible to disentangle the contribution of the two factors given the available data? Eg how many genetic interactions are reproducible in two different screening platforms using the same cell line vs how similar are results of screens from two different cell lines in the same study? </p>
          <p>-The authors state that "some of the robust genetic dependencies could be readily interpreted using known pathway structures" and argue that they recover for example MAPK or Rb pathway relationships. Is this a general trend? Do genes forming a robust genetic interactions have a higher tendency to be in the same pathway as opposed to different pathways? I think the pathway topic could be in general better exploited: eg does pathway (relative) position play a role?</p>
          <h6>Significance</h6>
          <p>Personalized cancer medicine aims at the identification of patient-specific vulnerabilites which allow to target cancer cells in the context of a specific genotype. Many oncogenic mutations cannot be targeted with drugs directly. The identification of genetic interactions is therefore of crucial importance. Unfortunately, genetic interactions show little reproducibility accross studies. The authors make an important contribution to understanding which factors contribute to this reproducibility and thereby providing means to also identify more reliable genetic interactions with high potential for clinical exploitation or involving passenger gene alterations (which are otherwise harder to detect for statistical reasons).</p>
          <p>REFEREES CROSS COMMENTING</p>
          <p>Reviewer 2 raises a few valid points, which if addressed would certainly increase the clarity of the paper. In particular addressing the first point (the self interactions of tumor suppressors) seems important to me. From what I can see all of reviewer 2's comments can be addressed easily.</p>
          <a href="https://hyp.is/F4-xmpXMEeqf3_-2H0r-9Q/www.biorxiv.org/content/10.1101/646810v2" class="article-feed__item__read_more article-call-to-action-link">
            Read the original source
          </a>
          </details>
        </div>
      </li>

      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-05-14">May 14, 2020</time>
          <div class="article-feed__item__title">
                      Reviewed by
            <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
              Review Commons
            </a>

        </div>
          <details>
          <summary>
                          <h3>Referee #2</h3><h4>Evidence, reproducibility and clarity</h4><p>In this manuscript, Lord et al. describe the analysis of loss-of-function (LOF) screens in cancer cell lines to identify robust (i.e., technically reproducible and shared across cell lines) genetic dependencies. The authors integrate data from 4 large-scale LOF studies (DRIVE, AVANA, DEPMAP and SCORE) to estimate the ...</p>
          </summary>

<p>reproducibility of their individual findings and examine their agreement with other types of functional information, such as physical binding. The main conclusions from the analyses are that: a) oncogene-driven cancer cell lines are more sensitive to the inhibition of the oncogene itself than any other gene in the genome; b) robust genetic interactions (i.e., those observed in multiple datasets and cell lines driven by the same oncogene/tumour suppressor) are enriched for gene pairs encoding physically interacting proteins.</p>
<p><strong>Main comments:</strong></p>
<p>I think this study is well designed, rigorously conducted and clearly explained. The conclusions are consistent with the results and I don't have any major suggestions for improving their support. I do, however, have a few suggestions for clarifying the message.</p>
<p>-Could the authors provide some intuitive explanation (or speculation) about the 2 observed cases of tumour suppressor "addiction" (TP53 and CDKN2A)? While the oncogene addiction cases are relatively easy to interpret, the same effects on tumour suppressors are less clear. Is it basically an epistatic effect, which looks like a relative disadvantage? For example, if we measure fitness: TP53-wt = 1, TP53-wt + CRISPR-TP53 = 1.5, TP53-mut = 1.5, TP53-mut + CRISPR-TP53 = 1.5. That is, inhibiting TP53 in TP53 mutant cells appears to be disadvantageous (relative to WT) only because inhibiting TP53 in wild-type cells is advantageous?</p>
<p>-In the analysis of overlap between genetic and physical interactions, the result should be presented more precisely. Currently, the text reads "when considering the set of all gene pairs tested, gene pairs whose protein products physically interact were more likely to be identified as significant genetic interactors". However, the referenced figure (Fig. 5a) shows an orthogonal perspective: relative to all gene pairs tested, those that have a significant genetic interaction are more likely to  have a physical interaction as well. In other words, in the text, we are comparing the relative abundance of genetic interactions in 2 sets: tested and physically interacting. However, in the figure, we are comparing the relative abundance of protein interactions in 2 sets -- tested and genetically interacting. The odds ratio and the p-values stay the same but the result would be more clear if the figure matched the description in the text.</p>
<p><strong>Minor comments:</strong></p>
<p>There're a few places where the more explicit explanation would improve the readability of the manuscript.</p>
<p>-Page 5: The multiple regression model used to identify genetic interactions is briefly mentioned in the text (and described more extensively in the methods). I think it would be better to explicitly describe the dependent and independent variables of the model in the text, so that the reader can intuitively understand what is being estimated.</p>
<p>-Page 5: "Using this approach, we tested 142,477 potential genetic dependencies…" -- could the authors provide a better explanation of where that number is coming from? E.g., 142,477 = … driver genes x 2470 selectively lethal genes?</p>
<p>-Page 5: Repeating the number of findings of each type would help understanding the landscape of the genetic dependencies (suggested numbers in brackets): "Of the (229?) reproducible genetic dependencies nine were 'self vs self' associations". "The majority (7/9?) of these … were oncogene addiction effects". "We also identified 2 (2/9?) examples of 'self vs self' dependencies involving tumour suppressors".</p>
<p>-Page 12: "Three of these interactions involve genes frequently deleted with the tumour suppressor CDKN2A (CDKN2B and MTAP) and mirror known associations with CDKN2A". It is not clear what "mirror" means -- do they recapitulate known interactions?</p>
<p>-Page 15: "Although we have not tested them here, other features predictive of between-species conservation may also be predictive of robustness to genetic heterogeneity" -- could the authors explicitly list the features?</p>
<h4>Significance</h4>
<p>The identification of a significant overlap between genetic and physical interactions in cancer cell lines is an interesting and promising observation that will help understanding known genetic dependencies and predicting new ones. However, similar observations have been made in other organisms and biological systems. These past studies should be referenced to provide a historical perspective and help define further analyses in the cancer context. In particular, studies in yeast S. cerevisiae have shown that, not only there is a general overlap between genetic interactions (both positive and negative) and physical interactions, but at least 2 additional features are informative about the relationship: a) the relative strength of genetic interactions and b) the relative density of physical interactions (i.e., isolated interaction vs protein complexes). Here's a sample of relevant studies: 1) von Mering et al., Nature, 2002; 2) Kelley &amp; Ideker, Nat Biotechnol, 2005; 3) Bandyopadhyay et al., PLOS Comput Biol, 2008; 4) Ulitsky et al., Mol Syst Biol, 2008; 5) Baryshnikova et al., Nat Methods, 2010; 6) Costanzo et al., Science, 2010; 7) Costanzo et al., Science, 2016. </p>
<p>Similar observations have also been made in mammalian systems: e.g., in mouse fibroblasts (Roguev et al., Nat Methods, 2013) and K562 leukemia cells (Han et al., Nat Biotech, 2017). I don't think that past observations negate the novelty of this manuscript. The analysis presented here is more focused and more comprehensive as it is based on a large integrated dataset and is driven by a series of specific hypotheses. However, a reference to previous publications should be made.</p>
<p>As a frame of reference: my expertise is in high-throughput genetics of model organisms, including mapping and analyzing genetic interactions.</p>
<p>REFEREES CROSS COMMENTING</p>
<p>I agree with the questions raised by reviewer #1. And I think the authors should be able to address them (either through analyses or reasoning) within 1-3 months.</p>

          <a href="https://hyp.is/F7e5QpXMEeqnbCM3UE6XLQ/www.biorxiv.org/content/10.1101/646810v2" class="article-feed__item__read_more article-call-to-action-link">
            Read the original source
          </a>
          </details>
        </div>
      </li>

      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-01-11">Jan 11, 2020</time>
          <p class="article-feed__item__title">
            <a href="https://www.biorxiv.org/content/10.1101/646810v2?versioned=true">
              Version 2 published on bioRxiv
            </a>
          </p>
        </div>
      </li>
  
      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2019-05-24">May 24, 2019</time>
          <p class="article-feed__item__title">
            <a href="https://www.biorxiv.org/content/10.1101/646810v1?versioned=true">
              Version 1 published on bioRxiv
            </a>
          </p>
        </div>
      </li>

    </ol>
  </section>

`;

const renderFlavourA = (): string => `
<article class="hive-grid hive-grid--article">
  <div class="main-content">
    
      <header>
        <h1>Integrative analysis of large-scale loss-of-function screens identifies robust cancer-associated genetic interactions</h1>

        <ol aria-label="Authors of this article" role="list" class="article-author-list">
          <li>Christopher J. Lord</li>
          <li >Niall Quinn</li>
          <li>Colm J. Ryan</li>
        </ol>

        <ul aria-label="Publication details" class="article-meta-data-list" role="list">
          <li>
            DOI <a href="https://doi.org/10.1101/646810">10.1101/646810</a>
          </li>
          <li>
            Posted <time datetime="2019-05-24">May 24, 2019</time>
          </li>
        </ul>

      </header>
    

    
      <section role="doc-abstract">
        <h2>
          Abstract
        </h2>
          
          
          <p>Genetic interactions, such as synthetic lethal effects, can now be systematically identified in cancer cell lines using high-throughput genetic perturbation screens. Despite this advance, few genetic interactions have been reproduced across multiple studies and many appear highly context-specific. Understanding which genetic interactions are robust in the face of the molecular heterogeneity observed in tumours and what factors influence this robustness could streamline the identification of therapeutic targets. Here, we develop a computational approach to identify robust genetic interactions that can be reproduced across independent experiments and across non-overlapping cell line panels. We used this approach to evaluate >140,000 potential genetic interactions involving cancer driver genes and identified 1,520 that are significant in at least one study but only 220 that reproduce across multiple studies. Analysis of these interactions demonstrated that: (i) oncogene addiction effects are more robust than oncogene-related synthetic lethal effects; and (ii) robust genetic interactions in cancer are enriched for gene pairs whose protein products physically interact. This suggests that protein-protein interactions can be used not only to understand the mechanistic basis of genetic interaction effects, but also to prioritise robust targets for further development. To explore the utility of this approach, we used a protein-protein interaction network to guide the search for robust synthetic lethal interactions associated with passenger gene alterations and validated two novel robust synthetic lethalities.</p>
        
          <a href="https://doi.org/10.1101/646810" class="article-call-to-action-link">
            Read the full article
          </a>
      </section>

    
      ${feed}
      
  </div>
</article>
`;

export default (): string => renderFlavourA();
