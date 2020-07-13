The Publish, Review, Curate (PRC) model has been [advocated by funders](https://doi.org/10.1371/journal.pbio.3000116) and [researchers](https://elifesciences.org/inside-elife/e9091cea/peer-review-new-initiatives-to-enhance-the-value-of-elife-s-process) as a way of improving the quality and availability of published research. [Stern BM, O’Shea EK (2019)](#stern-oshea) recommend several long-term changes over three areas:

> To drive scientific publishing forward, we propose several long-term changes. Although these changes could be implemented independently, together they promise to significantly increase transparency and efficiency.
>
>1.  Change peer review to better recognize its scholarly contribution.
>2.  Shift the publishing decision from editors to authors.
>3.  Shift curation from before to after publication.

This community-driven technology effort is to produce an application that can support the changes in behaviour required to effect this change. The approach to building the software is to keep the cost of change low so that the application can quickly adapt to feedback and barriers to adoption, helping the researcher drive the technology to meet their needs.

While the majority of people working on this application are funded by eLife and their generous funders, we are operating at a distance from the eLife journal so that other editorial communities, innovative journals and interested technologists can join on a more equal basis. eLife’s editorial community will be one of the first to use the application and this separation helps us support them in their endeavours to change behaviour in the same way we will with any other community.

Read more about:

-   [Our approach](#our-approach)
-   [Our current direction and hypothesis](#current-direction)
-   [Scenarios we’ve enabled](#implemented-scenarios)
-   [Scenarios we’re currently working on](#current-scenarios)
-   [What we consider to be our immediate next focus](#next-focus)
-   [Future direction and considerations](#future-direction)
-   [How to give us feedback](#feedback)

---

## <a name="our-approach">Our approach</a>

Using techniques popularised by [extreme programming](#beck) to concentrate on meeting your needs and to get feedback early, we are developing this application with a “working software first” approach. This means that you’ll see more of the application earlier, and some parts will be clearly labelled as a future feature that we’re asking for early feedback on.
This means we can add new editorial communities quickly and respond to your feedback with changes to the application while you’re using it.

We define an hypothesis to test and write software to help test that hypothesis with real users. In doing so we define the scope of the next iteration and clearly define parts that are to be deferred. This ensures everyone knows what is being implemented but can see areas left for future exploration. For example, early on we won’t work on a complex login and authentication system as we can get faster feedback without it, but we know it is likely that this will be required at some point, and we’ll work on that then.

## <a name="current-direction">Current direction</a>

We’re currently focussing on improving the user experience for postdocs who regularly engage with preprints. We are exploring ways in which we might help readers discover and consume new content that is relevant to them outside of the realm of traditional journal publication.

We assume that additional value indicators such as comments, reviews and endorsements from different communities of editors and reviewers will help readers choose in which articles to invest their limited time, and are testing this with a number of implemented scenarios which are further outlined below.

We are working with a small number of editorial communities who have provided us with reviews and other content. We want to find out if trust in the judgement of these communities is fostered not only by the transparent disclosure of that community’s review output, but also its editorial policies and review process in order to contextualise that output for researchers.

Crucially, we are hoping to move away from the current model where a community’s brand is accepted as the most important measure of its reliability.


## <a name="implemented-scenarios">Scenarios enabled in the current iteration</a>

These are the most recent scenarios represented on the application now:

- The name of an editorial community, rather than an individual, is displayed as the author of a review.
- Clicking on the name of an editorial community will take the user to a page outlining that community’s editorial policies and review process etc.
- The editorial community’s landing page contains a list of reviews that the community has posted.
- Additionally, the editorial community’s landing page contains a list of articles it has endorsed, or highlighted as particularly important for its interested followers/readers.
- Clicking on an article listed on a community’s landing page will take the user to the article page.
- The application supports a landing page per one of its multiple communities.
- Users can search for a bioRxiv article using the search box on the home page.
- Clicking on an article title from the list of returned results will take the user to the article page.
- If an article has gained comments, clicking on this indicator on the article page will take the user to bioRxiv, where the comments can be read. 
- If an article has gained reviews, clicking on this indicator on the article page will take the user to the review content at the bottom of the article page.
- Experimental features to explore the addition of reviews:
    - Users can add a new review to an article. This is done by uploading the review to Zenodo, generating a concept DOI for the review, and then associating that review DOI with the article via the form in our application.
    - When adding a review, a user is able to additionally select an editorial community from a drop down list.
    - It is possible for a user to attach multiple reviews to an article, each under the name of a different editorial community. In this way, an article could foreseeably garner multiple perspectives which together form a 360-degree holistic opinion of the research.
    - Reviews published via hypothes.is can also be included (although not via the form yet)



Currently we are outsourcing the hosting of reviews to Zenodo; this
enables us to build an end-to-end experience more quickly, and hence to
obtain [rapid feedback](#feedback) from users (that's you).

The current iteration also only integrates with bioRxiv for the hosting
of articles. It is our intention to integrate with other preprint
servers soon.

## <a name="current-scenarios">In progress scenarios</a>

Our [Opportunity Solution Tree](https://miro.com/app/board/o9J_ksVfD4E=/) and [User Story Map](https://miro.com/app/board/o9J_ksVfD4E=/?moveToWidget=3074457348328557591&cot=13) are publicly available and show our current and future ideas.

The Opportunity Solution Tree shows the areas we may explore next as opportunities, hypotheses and experiments. You can [learn more about this visualisation technique here](https://www.producttalk.org/2016/08/opportunity-solution-tree/).

The User Story Map shows the scenarios we've been working on (at the top), the work we're currently doing (nearer the bottom) and what we're planning next (at the bottom). The items across the top show the user journey backbone and are grouped by functionality so that you can see which areas we're concentrating on. You can [learn more about this type of visualisation here](https://www.jpattonassociates.com/user-story-mapping/).

## <a name="next-focus">Our immediate next focus</a>

To aid in the rapid development of the application we have deliberately
left some key features for later:

-   Persistence: at present all user entered data is lost with each new deployment.
-   Authentication: a user should have to log in to post a review under the umbrella of an editorial community.
-   Branding: we don't yet have a name for this application!

## <a name="future-direction">Future direction and considerations</a>

We attempt to record any ideas or questions that arise as we build, use and gather feedback from the application. This will form our future direction.

-   What information about an editorial community is the most useful for a reader?
-   Should we mandate what information is provided in order to facilitate like-for-like comparisons?
-   Where a traditional journal can only provide a submission with the judgement of its own community of editors and reviewers, the PRC application should additionally facilitate concurrent reviews from multiple editorial communities- we anticipate this will be a unique selling point and thus drive adoption.
-   Should we provide the name of the reviewer(s) alongside the editorial community, if these are available?
-   What are some other indicators that build reader trust in a review?
-   Does a conflict of interest declaration increase trust?
-   Does confirmation to an established set of ethical guidelines increase trust?
-   Should we allow readers to indicate if they found a review helpful or not, as a quantitative needle we could seek to move? Would an accumulation of ‘upvotes’ itself signal additional trustworthiness?
-   Should we additionally allow a user to ‘highlight’ an article? We hypothesise that this would enable an editorial community to add an indication of the article’s value/quality over and above the review itself, thereby reducing information overload for readers. This may influence how we present the previous reviews on a community’s About page.
-   Article versioning: associating a review with a particular version of the article?

## <a name="feedback">How to give us feedback</a>

The application is changing on a daily basis. To stay up to date, as well as letting us know what you think so far, head on over to our [feedback page](https://eepurl.com/g7qqcv).

## References

<a name="beck">Beck K (2000)</a> <i>Extreme Programming Explained: Embrace Change</i>.
Addison-Wesley Professional, 2000.
ISBN 0201616416.

<a name="stern-oshea">Stern BM, O’Shea EK (2019)</a> A proposal for the future of scientific publishing in the life sciences. PLoS Biol 17(2): e3000116. <https://doi.org/10.1371/journal.pbio.3000116>

