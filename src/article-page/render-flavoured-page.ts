type Flavour = 'a' | 'b';

type RenderFlavouredPage = (flavour: Flavour) => string;

const feed = `
  <section>
    <h2>Feed</h2>

    <ol role="list" class="article-feed">
      <li class="article-feed__item">
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
    <div class="content">
        <time class="article-feed__item__date" datetime="2020-06-30">Jun 30, 2020</time>
        <p class="article-feed__item__title"><a href="https://elifesciences.org/articles/58925">Online version updated</a> by <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">eLife</a></p>
    </div>
  </li>

      <li class="article-feed__item">
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
    <div>
        <time class="article-feed__item__date" datetime="2020-06-11">Jun 11, 2020</time>
        <p class="article-feed__item__title"><a href="https://elifesciences.org/articles/58925v2">Full online version published</a> by <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">eLife</a></p>
    </div>
  </li>

      <li class="article-feed__item">
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
      <div>
        <time class="article-feed__item__date" datetime="2020-05-28">May 28, 2020</time>
        <p class="article-feed__item__title"><a href="https://elifesciences.org/articles/58925v1">Accepted manuscript published as PDF</a> by <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">eLife</a></p>
      </div>
    </li>
    
    <li class="article-feed__item">
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
    <div class="content">
        <time class="article-feed__item__date" datetime="2020-05-18">May 18, 2020</time>
        <p class="article-feed__item__title"><a href="https://elifesciences.org/articles/58925#sa1">Accepted</a> by <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">eLife</a></p>
        <p>
        In this manuscript the authors develop a computational approach designed to identify robust genetic interactions that can be used to predict tumor cell genetic vulnerabilities. The authors find that oncogene addiction, as opposed to synthetic lethality, tends to be a more robust predictor of genetic dependencies in tumor cells. They also find that robust genetic interactions in cancer are enriched for gene pairs whose protein products physically interact. Therefore, the latter could be considered a surrogate in target selection for tumors with currently undruggable driver oncogenes.
        </p>
    </div>
  </li>
    
    <li class="article-feed__item">
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1239550325188710402/7_lY-IyL_200x200.png" alt="">
    <div>
        <time class="article-feed__item__date" datetime="2020-05-15">May 15, 2020</time>
        <p class="article-feed__item__title">Submitted to <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">eLife</a></p>
    </div>
  </li>
  
  <li class="article-feed__item">
    <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg" alt="">
    <div>
        <time class="article-feed__item__date" datetime="2020-05-14">May 14, 2020</time>
    <p class="article-feed__item__title">Author responded to <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">Review Commons</a></p>
    <h3>Reply to the reviewers</h3>
    <h4>Reviewer #1</h4>
    <p>
    Our response: We thank the reviewer for the positive assessment of our manuscript and have addressed the issue of study bias in response to the specific queries below. ...
    </p>
          <a href="https://hyp.is/GFEW8JXMEeqJQcuc-6NFhQ/www.biorxiv.org/content/10.1101/646810v2" class="article-feed__item__read_more">
            Read the full response
          </a>
    </div>
  </li>

  <li class="article-feed__item">
    <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg" alt="">
    <div>
      <time class="article-feed__item__date" datetime="2020-05-14">May 14, 2020</time>
      <p class="article-feed__item__title">Reviewed by <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">Review Commons</a></p>
      <h3>Summary</h3>
      <p>
        Reproducibility of genetic interactions across studies is low. The authors identify reproducible genetic interactions and ask the question of what are properties of robust genetic interactions. They find that 1. oncogene addiction tends to be more robust than synthetic lethality and 2. genetic interactions among physically interacting proteins tend to be more robust. They then use protein-protein interactions (PPIs) to guide the detection of genetic interactions involving passenger gene alterations.
      </p>
      <h3>Major comments</h3>
      <p>
        The claims of the manuscript are clear and well supported by computational analyses. My only concern is the influence of (study) bias on the observed enrichment of physical protein interactions among genetic interactions. 1. Due to higher statistical power the here described approach favors genetic interactions involving frequently altered cancer genes (as acknowledged by the authors). 2. Also some of the libraries in the genetic screens might be biased towards better characterized screens. 3. PPI networks are highly biased towards well studied proteins (in which well studied proteins - in …
      </p>
      <a href="https://hyp.is/F4-xmpXMEeqf3_-2H0r-9Q/www.biorxiv.org/content/10.1101/646810v2" class="article-feed__item__read_more">
        Read the full review
      </a>
    </div>
  </li>

  <li class="article-feed__item">
    <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/1204012644660854784/E8JhkG7__200x200.jpg" alt="">
    <div class="content">
        <time class="article-feed__item__date" datetime="2020-05-14">May 14, 2020</time>
    <p class="article-feed__item__title">Reviewed by <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334">Review Commons</a><p>
    <h3>Summary</h3>
    <p>
    In this manuscript, Lord et al. describe the analysis of loss-of-function (LOF) screens in cancer cell lines to identify robust (i.e., technically reproducible and shared across cell lines) genetic dependencies. The authors integrate data from 4 large-scale LOF studies (DRIVE, AVANA, DEPMAP and SCORE) to estimate the reproducibility of their individual findings and examine their agreement with other types of functional information, such as physical binding. The main conclusions from the analyses are that: a) oncogene-driven cancer cell lines are more sensitive to the inhibition of the oncogene itself than any other gene in the genome; b) robust genetic interactions (i.e., those observed in multiple datasets and cell lines driven by the same oncogene/tumour suppressor) are enriched for gene pairs encoding physically interacting proteins.
    </p>
    <h3>Major comments</h3>
    <p>
    I think this study is well designed, rigorously conducted and clearly explained. The conclusions are consistent with the results and I don't have any major suggestions for improving their support. I do, however, have a few suggestions for clarifying the message.
    
    -Could the authors …
    </p>
          <a href="https://hyp.is/F7e5QpXMEeqnbCM3UE6XLQ/www.biorxiv.org/content/10.1101/646810v2" class="article-feed__item__read_more">
            Read the full review
          </a>
    </div>
  </li>

  <li class="article-feed__item">
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
    <div class="content">
        <time class="article-feed__item__date" datetime="2019-05-24">Jan 11, 2020</time>
        <p class="article-feed__item__title"><a href="https://www.biorxiv.org/content/10.1101/646810v2?versioned=true">Version 2 published on Biorxiv</a></p>
    </div>
  </li>
  
  <li class="article-feed__item">
      <img class="article-feed__item__avatar" src="https://pbs.twimg.com/profile_images/956882186996662272/lwyH1HFe_200x200.jpg" alt="">
    <div class="content">
        <time class="article-feed__item__date" datetime="2019-05-24">May 24, 2019</time>
        <p class="article-feed__item__title"><a href="https://www.biorxiv.org/content/10.1101/646810v1?versioned=true">Version 1 published on Biorxiv</a></p>
    </div>
  </li>

 </ol>
  </section>

`;

const renderFlavourA = (): string => `
<article class="hive-grid hive-grid--article">
  <div class="main-content">
    
      <header class="ui basic padded vertical segment">
        <h1>Integrative analysis of large-scale loss-of-function screens identifies robust cancer-associated genetic interactions</h1>

        <ol aria-label="Authors of this article" class="ui comma separated horizontal list" role="list">
          <li class="item">Christopher J. Lord</li>
<li class="item">Niall Quinn</li>
<li class="item">Colm J. Ryan</li>

        </ol>

        <ul aria-label="Publication details" class="ui list">
          <li class="item">
            DOI <a href="https://doi.org/10.1101/646810">10.1101/646810</a>
          </li>
          <li class="item">
            Posted <time datetime="2019-05-24">May 24, 2019</time>
          </li>
        </ul>

      </header>
    

    
      <section role="doc-abstract">
        <h2>
          Abstract
        </h2>
          
          
          <p>Genetic interactions, such as synthetic lethal effects, can now be systematically identified in cancer cell lines using high-throughput genetic perturbation screens. Despite this advance, few genetic interactions have been reproduced across multiple studies and many appear highly context-specific. Understanding which genetic interactions are robust in the face of the molecular heterogeneity observed in tumours and what factors influence this robustness could streamline the identification of therapeutic targets. Here, we develop a computational approach to identify robust genetic interactions that can be reproduced across independent experiments and across non-overlapping cell line panels. We used this approach to evaluate >140,000 potential genetic interactions involving cancer driver genes and identified 1,520 that are significant in at least one study but only 220 that reproduce across multiple studies. Analysis of these interactions demonstrated that: (i) oncogene addiction effects are more robust than oncogene-related synthetic lethal effects; and (ii) robust genetic interactions in cancer are enriched for gene pairs whose protein products physically interact. This suggests that protein-protein interactions can be used not only to understand the mechanistic basis of genetic interaction effects, but also to prioritise robust targets for further development. To explore the utility of this approach, we used a protein-protein interaction network to guide the search for robust synthetic lethal interactions associated with passenger gene alterations and validated two novel robust synthetic lethalities.</p>
        
          <a href="https://doi.org/10.1101/646810" class="ui basic secondary button">
            Read the full article
            <i class="right chevron icon"></i>
          </a>
      </section>
      <div class="ui hidden clearing section divider"></div>
    
      ${feed}
      
  </div>
</article>
`;

const renderFlavourB = (): string => `
<article class="hive-grid hive-grid--article">
  <div class="main-content">
    
      <header class="ui basic padded vertical segment">
        <h1>Integrative analysis of large-scale loss-of-function screens identifies robust cancer-associated genetic interactions</h1>

        <ol aria-label="Authors of this article" class="ui comma separated horizontal list" role="list">
          <li class="item">Christopher J. Lord</li>
<li class="item">Niall Quinn</li>
<li class="item">Colm J. Ryan</li>

        </ol>

        <ul aria-label="Publication details" class="ui list">
          <li class="item">
            DOI <a href="https://doi.org/10.1101/646810">10.1101/646810</a>
          </li>
          <li class="item">
            Posted <time datetime="2019-05-24">May 24, 2019</time>
          </li>
        </ul>

        
      <a href="#reviews" data-test-id="reviewsLink">
        <div class="ui label">
          Reviews
          <span class="detail">3</span>
        </div>
      </a>
    
        
        
        <div class="ui label">
          Endorsed by
          <span class="detail">eLife</span>
        </div>
      
      </header>
    

    
      <section role="doc-abstract">
        <h2>
          Abstract
        </h2>
          
          
          <p>Genetic interactions, such as synthetic lethal effects, can now be systematically identified in cancer cell lines using high-throughput genetic perturbation screens. Despite this advance, few genetic interactions have been reproduced across multiple studies and many appear highly context-specific. Understanding which genetic interactions are robust in the face of the molecular heterogeneity observed in tumours and what factors influence this robustness could streamline the identification of therapeutic targets. Here, we develop a computational approach to identify robust genetic interactions that can be reproduced across independent experiments and across non-overlapping cell line panels. We used this approach to evaluate >140,000 potential genetic interactions involving cancer driver genes and identified 1,520 that are significant in at least one study but only 220 that reproduce across multiple studies. Analysis of these interactions demonstrated that: (i) oncogene addiction effects are more robust than oncogene-related synthetic lethal effects; and (ii) robust genetic interactions in cancer are enriched for gene pairs whose protein products physically interact. This suggests that protein-protein interactions can be used not only to understand the mechanistic basis of genetic interaction effects, but also to prioritise robust targets for further development. To explore the utility of this approach, we used a protein-protein interaction network to guide the search for robust synthetic lethal interactions associated with passenger gene alterations and validated two novel robust synthetic lethalities.</p>
        
          <a href="https://doi.org/10.1101/646810" class="ui basic secondary button">
            Read the full article
            <i class="right chevron icon"></i>
          </a>
      </section>
      <div class="ui hidden clearing section divider"></div>
    
    
      <section id="endorsements">
        
      </section>
    
    
    
      <section id="reviews">
        <h2>
          Reviews
        </h2>
        <ol role="list" class="ui very relaxed divided items list">
          <li class="item">
      <article class="content">

        <h3>
          Reviewed by
          <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334" id="review-0-editorial-community">
            Review Commons
          </a>
        </h3>

        <div class="meta" data-test-id="reviewPublicationDate"><time datetime="2020-05-14">May 14, 2020</time></div>

        <div class="description" data-test-id="reviewSummary"><p><strong>Note:</strong> This preprint has been reviewed by subject experts for <em>Review Commons</em>. Content has not been altered except for formatting.</p>
<p>Learn more at <a href="https://reviewcommons.org">Review Commons</a></p>
<hr />
<h3>Referee #1</h3>
<h4>Evidence, reproducibility and clarity</h4>
<p><strong>Summary:</strong></p>
<p>Reproducibility of genetic interactions across studies is low. The authors identify reproducible genetic interactions and ask the question of what are properties of robust genetic interactions. They find that 1. oncogene addiction tends to be more robust than synthetic lethality and 2. genetic interactions among physically interacting proteins tend to be more robust. They then use protein-protein interactions (PPIs) to guide the detection of genetic interactions involving passenger gene alterations.</p>
<p><strong>Major comments:</strong></p>
<p>The claims of the manuscript are clear and well supported by computational analyses. My only concern is the influence of (study) bias on the observed enrichment of physical protein interactions among genetic interactions. 1. Due to higher statistical power the here described approach favors genetic interactions involving frequently altered cancer genes (as acknowledged by the authors). 2. Also some of the libraries in the genetic screens might be biased towards better characterized screens. 3. PPI networks are highly biased towards well studied proteins (in which well studied proteins - in …</div>

        <div class="extra">
          <a href="https://hyp.is/F4-xmpXMEeqf3_-2H0r-9Q/www.biorxiv.org/content/10.1101/646810v2" class="ui basic secondary button" id="review-0-read-more"
            aria-labelledby="review-0-read-more review-0-editorial-community">
            Read the full review
            <i class="right chevron icon"></i>
          </a>
        </div>

      </article>
    </li>
<li class="item">
      <article class="content">

        <h3>
          Reviewed by
          <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334" id="review-1-editorial-community">
            Review Commons
          </a>
        </h3>

        <div class="meta" data-test-id="reviewPublicationDate"><time datetime="2020-05-14">May 14, 2020</time></div>

        <div class="description" data-test-id="reviewSummary"><p><strong>Note:</strong> This preprint has been reviewed by subject experts for <em>Review Commons</em>. Content has not been altered except for formatting.</p>
<p>Learn more at <a href="https://reviewcommons.org">Review Commons</a></p>
<hr />
<h3>Referee #2</h3>
<h4>Evidence, reproducibility and clarity</h4>
<p>In this manuscript, Lord et al. describe the analysis of loss-of-function (LOF) screens in cancer cell lines to identify robust (i.e., technically reproducible and shared across cell lines) genetic dependencies. The authors integrate data from 4 large-scale LOF studies (DRIVE, AVANA, DEPMAP and SCORE) to estimate the reproducibility of their individual findings and examine their agreement with other types of functional information, such as physical binding. The main conclusions from the analyses are that: a) oncogene-driven cancer cell lines are more sensitive to the inhibition of the oncogene itself than any other gene in the genome; b) robust genetic interactions (i.e., those observed in multiple datasets and cell lines driven by the same oncogene/tumour suppressor) are enriched for gene pairs encoding physically interacting proteins.</p>
<p><strong>Main comments:</strong></p>
<p>I think this study is well designed, rigorously conducted and clearly explained. The conclusions are consistent with the results and I don't have any major suggestions for improving their support. I do, however, have a few suggestions for clarifying the message.</p>
<p>-Could the authors …</div>

        <div class="extra">
          <a href="https://hyp.is/F7e5QpXMEeqnbCM3UE6XLQ/www.biorxiv.org/content/10.1101/646810v2" class="ui basic secondary button" id="review-1-read-more"
            aria-labelledby="review-1-read-more review-1-editorial-community">
            Read the full review
            <i class="right chevron icon"></i>
          </a>
        </div>

      </article>
    </li>
<li class="item">
      <article class="content">

        <h3>
          Reviewed by
          <a href="/editorial-communities/316db7d9-88cc-4c26-b386-f067e0f56334" id="review-2-editorial-community">
            Review Commons
          </a>
        </h3>

        <div class="meta" data-test-id="reviewPublicationDate"><time datetime="2020-05-14">May 14, 2020</time></div>

        <div class="description" data-test-id="reviewSummary"><p><strong>Note:</strong> This rebuttal was posted by the corresponding author to <em>Review Commons</em>. Content has not been altered except for formatting.</p>
<p>Learn more at <a href="https://reviewcommons.org">Review Commons</a></p>
<hr />
<h3>Reply to the reviewers</h3>
<blockquote>
  <p><strong>Reviewer #1</strong> (Evidence, reproducibility and clarity (Required)):</p>
  <p>***Summary:**</p>
  <p>Reproducibility of genetic interactions across studies is low. The authors identify reproducible genetic interactions and ask the question of what are properties of robust genetic interactions. They find that 1. oncogene addiction tends to be more robust than synthetic lethality and 2. genetic interactions among physically interacting proteins tend to be more robust. They then use protein-protein interactions (PPIs) to guide the detection of genetic interactions involving passenger gene alterations.</p>
  <p>**Major comments:**</p>
  <p>The claims of the manuscript are clear and well supported by computational analyses. My only concern is the influence of (study) bias on the observed enrichment of physical protein interactions among genetic interactions. 1. Due to higher statistical power the here described approach favors genetic interactions involving frequently altered cancer genes (as acknowledged by the authors). 2. Also some of the libraries in the genetic screens might be biased towards better characterized screens. 3. PPI networks are highly biased towards well …</div>

        <div class="extra">
          <a href="https://hyp.is/GFEW8JXMEeqJQcuc-6NFhQ/www.biorxiv.org/content/10.1101/646810v2" class="ui basic secondary button" id="review-2-read-more"
            aria-labelledby="review-2-read-more review-2-editorial-community">
            Read the full review
            <i class="right chevron icon"></i>
          </a>
        </div>

      </article>
    </li>

        </ol>
      </section>
    
  </div>
</article>
`;

export default (): RenderFlavouredPage => (
  (flavour) => {
    switch (flavour) {
      case 'a': return renderFlavourA();
      case 'b': return renderFlavourB();
    }
  }
);
