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

We are looking to test a hypothesis around the themes of trust (in preprint articles and reviews) and using the concept of editorial communities to explore that. This means we are currently expanding the application to take on a small number of communities and display a small number of reviews while we work with the community to define precisely the next most important hypothesis to test.

The desired behaviour change we are looking to drive is that authors will increasingly rely on the application for feedback rather than traditional peer review afforded by a journal. To effect this change, we assume that we will need to provide the same (and greater) value to its users that they currently get from journal submission and eventual publication. The first element of that value to explore is the idea of trust: we want to retain the integrity of peer review while decoupling it from other aspects of journal publication. Trust in a community’s judgement, we assume, is fostered not only by the transparent disclosure of that community’s review output, but also its editorial policies and review process in order to contextualise that output for researchers.

## <a name="implemented-scenarios">Scenarios enabled in the current iteration</a>

These are the most recent scenarios represented on the application now:

-   Users can add a new review to an article. This is done by uploading
    the review to Zenodo, generating a concept DOI for the review, and then
    associating that review DOI with the article via the form in our
    application.
-   It is possible for a user to attach multiple reviews to an article, each under the name of a different editorial community. In this way, an article could foreseeably garner multiple perspectives which together form a 360-degree holistic opinion of the research.
-   When adding a review, a user is able to additionally select an editorial community from a drop down list.
-   The name of an editorial community, rather than an individual, is displayed as the author of a review.
-   Clicking on the name of an editorial community will take the user to a page outlining that community’s editorial policies and review process etc.
-   The editorial community’s About page contains a list of reviews that community has posted.
-   Clicking on a review listed on a community’s About page will take the user to the article page.
-   The application supports an About page per one of its multiple communities.

Currently we are outsourcing the hosting of reviews to Zenodo; this
enables us to build an end-to-end experience more quickly, and hence to
obtain [rapid feedback](#feedback) from users (that's you).

The current iteration also only integrates with bioRxiv for the hosting
of articles. It is our intention to integrate with other preprint
servers soon.

## <a name="current-scenarios">In progress scenarios</a>

Link to our story map coming soon.

## <a name="next-focus">Our immediate next focus</a>

To aid in the rapid development the application we have deliberately
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

We would love to talk to you so just send any comments or feedback to <prc-feedback@elifesciences.org> and we’ll be in touch.

## References

<a name="beck">Beck K (2000)</a> <i>Extreme Programming Explained: Embrace Change</i>.
Addison-Wesley Professional, 2000.
ISBN 0201616416.

<a name="stern-oshea">Stern BM, O’Shea EK (2019)</a> A proposal for the future of scientific publishing in the life sciences. PLoS Biol 17(2): e3000116. <https://doi.org/10.1371/journal.pbio.3000116>

