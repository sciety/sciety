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
          <p class="article-feed__item__title">
            <a href="https://elifesciences.org/articles/58925#sa1">
              Accepted
            </a>
            by
            <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
              eLife
            </a>
          </p>
          <p>
            In this manuscript the authors develop a computational approach designed to identify robust genetic interactions that can be used to predict tumor cell genetic vulnerabilities. The authors find that oncogene addiction, as opposed to synthetic lethality, tends to be a more robust predictor of genetic dependencies in tumor cells. They also find that robust genetic interactions in cancer are enriched for gene pairs whose protein products physically interact. Therefore, the latter could be considered a surrogate in target selection for tumors with currently undruggable driver oncogenes.
          </p>
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
          <p class="article-feed__item__title">
            Author responded to
            <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
              Review Commons
            </a>
          </p>
          <h3>Reply to the reviewers</h3>
          <h4>Reviewer #1</h4>
          <p>
            Our response: We thank the reviewer for the positive assessment of our manuscript and have addressed the issue of study bias in response to the specific queries below. ...
          </p>
          <a href="https://hyp.is/GFEW8JXMEeqJQcuc-6NFhQ/www.biorxiv.org/content/10.1101/646810v2" class="article-feed__item__read_more article-call-to-action-link">
              Read the full response
          </a>
        </div>
      </li>

      <li class="article-feed__item">
        <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg" alt="">
        <div>
          <time class="article-feed__item__date" datetime="2020-05-14">May 14, 2020</time>
          <details>
          <summary class="article-feed__item__title">
            Reviewed by
            <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
              Review Commons
            </a>
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
          <details>
          <summary class="article-feed__item__title">
            Reviewed by
            <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">
              Review Commons
            </a>
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
            Read the full review
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
