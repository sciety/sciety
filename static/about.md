# Current direction

The desired behaviour change we are currently exploring is that authors will increasingly rely on the platform for feedback rather than traditional peer review afforded by a journal. In order to drive this behaviour we assume that we will need to provide the same (and greater) value to its users that they currently get from journal submission and eventual publication.

Based on primary and secondary user research, we have learned that a major value stream offered by journal publication is feedback from a pool of reviewers vetted and approved by the journal’s editorial community.

From this, we hypothesise that the stamp of a particular editorial community engenders the content of a review with more significance in the eyes of both authors and readers of scientific content. Trust in a community’s judgement, we assume, is further fostered by the transparent disclosure of that community’s editorial policies and review process.

Where a journal can only provide a submission with the judgement of its own community of editors and reviewers, the PRC platform will additionally facilitate concurrent reviews from multiple editorial communities- we anticipate this will be a unique selling point over traditional journal submission and thus drive adoption.

# Implemented Scenarios

The name of an editorial community (eLife), rather than an individual, is displayed as the author of a review

Clicking on the name of an editorial community will take the user to a page outlining that community’s editorial policies and review process etc.

The editorial community’s About page contains a list of reviews that community has posted

Clicking on a review listed on a community’s About page will take the user to the article page

# In Progress Scenarios

The platform supports an About page per one of its multiple communities

It is possible for a user to attach multiple reviews to an article, each under the name of a different editorial community

When adding a review, a user is able to additionally select an editorial community from a drop down list

When a user attempts to attach the same review to an article, they receive an error message

When a user subsequently attempts to attach the same review to a different article, they receive an error message

A user cannot attach the same review on behalf of different editorial communities. Attempting to do so will result in an error message

# Out of scope

Individual reviewers operating underneath the banner of an editorial community: we do not have a concept, for example, of “Dr Spock reviewing on behalf of eLife”. We will assume one account represents a single community.

Optimising the reviewer experience: we will continue to outsource this to Zenodo. A user uploading a review will use a concept DOI (see https&#x3A;//help.zenodo.org/ for details of concept DOIs vs version DOIs).

Persistence: data will be lost with each new deployment.

Authentication: a user will not have to log in to post a review under the umbrella of an editorial community

Surfacing recently reviewed articles on the homepage: this is a question of discovery/curation and one to be addressed at a later time

Article versioning: associating a review with a particular version of the article

# Questions to consider in possible future experiments 

What information about an editorial community is the most useful for a reader?

Should we mandate what information is provided?

Should we provide the name of the reviewer(s) alongside the editorial community, if these are available?

What are some other indicators that build reader trust in a review?

Does a conflict of interest declaration increase trust?

Does confirmation to an established set of ethical guidelines increase trust?

Should we allow readers to indicate if they found a review helpful or not, as a quantitative needle we could seek to move? Would an accumulation of ‘upvotes’ itself signal additional trustworthiness?

Should we additionally allow a user to ‘highlight’ an article? We hypothesise that this would enable an editorial community to add an indication of the article’s value/quality over and above the review itself, thereby reducing information overload for readers. This may influence how we present the previous reviews on a community’s About page.
