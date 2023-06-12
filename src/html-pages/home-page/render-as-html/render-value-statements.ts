import { toHtmlFragment } from '../../../types/html-fragment';

export const renderValueStatements = process.env.EXPERIMENT_ENABLED === 'true'
  ? toHtmlFragment(`
    <section class="home-page-value-statements">
        <h2>How does Sciety work?</h2>
        <article>
            <div>
                <h3>A central place for preprints, reviews and recommendations</h3>
                <p>Sciety brings together groups of researchers who are evaluating and curating the preprints they find interesting or important.</p>
            </div>
            <img src="#" alt="placeholder image">
        </article>
        <article>
            <div>
                <h3>Discover the next advancement in your field</h3>
                <p>Search and sort through the vast preprint literature and find relevant and impactful studies in your area of expertise, alongside evaluations from trusted experts.</p>
            </div>
            <img src="#" alt="placeholder image">
        </article>
        <article>
            <div>
                <h3>Organise and share what you are reading</h3>
                <p>Create lists of the preprints you find interesting that you can return to in the future or share with your research community.</p>
            </div>
            <img src="#" alt="placeholder image">
        </article>
    </section>
  `)
  : toHtmlFragment('');
