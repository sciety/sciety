The Publish, Review, Curate (PRC) model has been [advocated by funders](https://doi.org/10.1371/journal.pbio.3000116) and [researchers](https://elifesciences.org/inside-elife/e9091cea/peer-review-new-initiatives-to-enhance-the-value-of-elife-s-process) as a way of improving the quality and availability of published research. [Stern BM, O’Shea EK (2019)](#stern-oshea) recommend several changes over three areas:

> To drive scientific publishing forward, we propose several long-term changes. Although these changes could be implemented independently, together they promise to significantly increase transparency and efficiency.
>
>1.  Change peer review to better recognize its scholarly contribution.
>2.  Shift the publishing decision from editors to authors.
>3.  Shift curation from before to after publication.

This community-driven technology effort is to produce an application that can support the changes in behaviour required to effect this change. The approach to building the software is to keep the cost of change low so that the application can quickly adapt to feedback and barriers to adoption, helping the researcher drive the technology to meet their needs.

While the majority of people working on this application are funded by eLife and their generous funders, we are operating at a distance from the eLife journal so that other groups, innovative journals and interested technologists can join on a more equal basis. eLife’s editorial group will be one of the first to use the application and this separation helps us support them in their endeavours to change behaviour in the same way we will with any other group.

Read more about:

-   [Our approach](#our-approach)
-   [Our current direction and hypothesis](#current-direction)
-   [Scenarios we’ve enabled](#implemented-scenarios)
-   [Scope](#scope)
-   [Future direction and considerations](#future-direction)
-   [How to give us feedback](#feedback)

---

## <a name="our-approach">Our approach</a>

Using techniques popularised by [extreme programming](#beck) to concentrate on meeting your needs and to get feedback early, we are developing this application with a “working software first” approach. This means that you’ll see more of the application earlier, and some parts will be clearly labelled as a future feature that we’re asking for early feedback on.
This means we can add new groups quickly and respond to your feedback with changes to the application while you’re using it.

We define an hypothesis to test and write software to help test that hypothesis with real users. In doing so we define the scope of the next iteration and clearly define parts that are to be deferred. This ensures everyone knows what is being implemented but can see areas left for future exploration.

## <a name="current-direction">Current direction</a>

We’re currently focussing on improving the user experience for postdocs who regularly engage with preprints. We are exploring ways in which we might help readers discover and consume new content that is relevant to them outside of the realm of traditional journal publication.

Talking to researchers about how they currently discover and consume content has led us to implement a number of features that emphasise the social networking aspect of scholarly communication, since the interests and recommendations of peers are highly influential. Application users can build a customisable feed of activity by following groups of editors and reviewers, and we plan to expand this functionality to include other kinds of events and entities in the future. Crucially, these activities should be as relevant to the user as possible, to help filter out what matters to them from the wealth of available content.

We assume that additional value indicators such as evaluations from different groups will help readers choose in which articles to invest their limited time, and we are working with a small number of groups who have already provided us with reviews and other content. We want to find out if trust in the judgement of these groups is fostered not only by the transparent disclosure of that group’s review output, but also its editorial policies and review process in order to contextualise that output for researchers.

## <a name="implemented-scenarios">Scenarios currently implemented</a>

These are the most recent scenarios represented on the application now:

- The group’s landing page outlines that group’s editorial policies and review process, shows a feed of their most recent activity.
- Each group's landing page contains a list of current followers.
- Evaluations from groups are automatically imported from each group's own platform(s) of choice.
- Users can search for bioRxiv content using the search box on the home page.
- Article pages collect evaluation information such as reviews.
- A user can log in using Twitter credentials and customize the homepage feed by selecting groups to follow.

## <a name="scope">Scope</a>

To aid in the rapid development of the application we have deliberately
left some key features for later:

-   Content: only evaluations of bioRxiv content are currently supported.

## <a name="future-direction">Future direction and considerations</a>

We gather feedback from users as we build which helps inform our future direction.
Our [team Miro board](https://miro.com/app/board/o9J_ksVfD4E=/) is publicly available and shows our current work in progress as well as the longer term roadmap. 

It visualises the areas we may explore next as opportunities, hypotheses and experiments.
[(Learn more about the Opportunity Solution Tree framework)](#ost).

## <a name="feedback">How to give us feedback</a>
The application is changing on a daily basis. To stay up to date, as well as letting us know what you think so far, head on over to our [feedback page](https://eepurl.com/g7qqcv).

## References

<a name="beck">Beck K (2000)</a> <i>Extreme Programming Explained: Embrace Change</i>.
Addison-Wesley Professional, 2000.
ISBN 0201616416.

<a name="stern-oshea">Stern BM, O’Shea EK (2019)</a> [A proposal for the future of scientific publishing in the life sciences](https://doi.org/10.1371/journal.pbio.3000116). PLoS Biol 17(2): e3000116.

<a name="ost">Teresa Torres (2016)</a> [Why This Opportunity Solution Tree is Changing the Way Product Teams Work](https://www.producttalk.org/2016/08/opportunity-solution-tree/).
