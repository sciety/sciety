🔥 **Bonfire** is an open, community-friendly discussion space that can be customised to suit the needs of the communities that use it. It’s built to be decentralised using the W3C’s ActivityPub standard, meaning different communities can set their own rules and still connect and share discussions with each other; think of many pe. This is the opposite of a centralised model like Facebook, where one company with a profit motive decides how the community operates. 

Imagine a wide, open landscape dotted with many camps, each with its own campfire. Around each fire, a group of people gather and tell stories to each other.

Some fires are small and intimate, others large and lively. Occasionally, someone stands up and walks to a neighbouring camp, bringing a story with them. That story might spark a new idea or even light a new fire

Every camp remains independent and self-governed, but the movement of people and stories between fires creates a network of shared meaning, an ecosystem of knowledge and culture.

---

❄️ **Nix** is a package manager, but unlike apt or brew, that you may have used on Linux or Mac,  it works in a completely declarative and reproducible way. You describe what you want, and Nix makes it so.

**NixOS** is a Linux distribution built entirely using Nix. It takes the ideas of reproducibility even further: you configure your whole system; from the desktop environment to user accounts using a single file.

In a traditional setup, you might run commands like sudo apt install nginx or manually edit configuration files in /etc/. Over time, these ad-hoc changes accumulate, leading to what’s known as configuration drift.

Two systems that started out identical can slowly become different in subtle or even major ways. Replicating a setup becomes harder, and troubleshooting turns into a slow, frustrating process. NixOS avoids all that.

In simple terms: if you create a recipe (a configuration.nix file), every time you use that recipe, whether on your laptop, a server, or in the cloud, you get the exact same setup.

For this project, using NixOS means institutions or communities can quickly and reliably deploy the customised Bonfire environment, avoiding tricky setup issues.

---

🟠 **Sciety** is a platform dedicated to tracking and showcasing [peer evaluation of preprints](https://blog.sciety.org/what-is-public-preprint-evaluation/) (openly licensed and often early-stage research papers), documenting a history of the work as it evolves and helping researchers get recognition for comments and evaluations. Prior to this initiative, Sciety had limited capabilities to index and support commentary and discussion of preprinted work. Preprint commentary is a valuable evaluation activity that supports researchers in developing the work and readers in understanding it. We expect to leverage the modular nature of Bonfire to enable discussion of the preprint and any of the reviews/evaluations, exploring ActivityPub alongside our existing COAR Notify support and recording this activity on Sciety as part of the history of the preprint.

Sciety Discussions (https://discussions.sciety.org) is a researcher-led space for open, meaningful conversations about early-stage research. Powered by Bonfire, a federated social networking toolkit to customise and host your own online space and control your experience at the most granular level, it puts you in control: of who you engage with, how you moderate, and what matters to your community.

Sciety surfaces the discussions as part of the preprint history on sciety.org, ensuring your contributions to preprint dialogue are discoverable and part of a growing ecosystem that values openness, transparency, and researcher voice.
