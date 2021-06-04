import * as TE from 'fp-ts/TaskEither';

type GetHtml = (url: string) => TE.TaskEither<'unavailable', string>;

export const getHtml: GetHtml = () => TE.right(`
    <!doctype html>
<!--[if IE 7 ]> <html class="no-js ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]> <html class="no-js ie8" lang="en"> <![endif]-->
<!--[if IE 9 ]> <html class="no-js ie9" lang="en"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>    <meta charset="UTF-8" />

    <!-- Meta desc -->
    <meta name="description" content="" />

    <!-- Robots -->
    <meta name="robots" content="/robots.txt" />
    <!-- Prevent Search Engines using DMOZ data. -->
    <meta name="robots" content="NOODP">

    <!-- Canonical -->
    <link rel="canonical" href="">

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Disable skype from styling numbers as skype buttons -->
    <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE" />

    <!-- For IE, use the latest supported mode, see http://stackoverflow.com/a/6771584 -->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&amp;subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese" rel="stylesheet">
    <link rel="stylesheet" href="https://use.typekit.net/agx8fit.css">

    <link rel="stylesheet" href="/dist/styles.min.css?v=1619685852">
    
    <link rel="stylesheet" href="https://prelights.biologists.com/wp-content/themes/thecobpph/tooltip.css">

    <!-- Icons - https://github.com/audreyr/favicon-cheat-sheet -->
    <!-- ICO generator: http://www.favicomatic.com -->
    <!-- IE6-10 -->
    <link rel="shortcut icon" sizes="16x16 24x24 32x32 48x48 64x64" href="/favicon.ico">
    <!-- Everybody else -->
    <link rel="icon" sizes="16x16 24x24 32x32 48x48 64x64" href="/favicon.ico">
    <!-- iOS 2.0+ and Android 2.1+ -->
    <link rel="apple-touch-icon-precomposed" href="/favicon-152.png">
    <!-- Metro tile -->
    <meta name="msapplication-TileColor" content="#FFFFFF">
    <meta name="msapplication-TileImage" content="/favicon-260.png">

    <!-- Twitter Card and Open Graph protocol tags -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="" />
    <meta name="twitter:creator" content="" />
    <meta property="og:url" content="" />
    <meta property="og:title" content="" />
    <meta property="og:description" content="" />
    <meta property="og:description" content="" />
    <meta property="og:image" content="" />

    <!-- Head JS -->
    <script src="https://use.fontawesome.com/releases/v5.0.1/js/all.js"></script>

    <script src="/dist/modernizr.min.js"></script>
    
    <title>Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development - preLights</title>

<!-- This site is optimized with the Yoast SEO plugin v11.6 - https://yoast.com/wordpress/plugins/seo/ -->
<link rel="canonical" href="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/" />
<meta property="og:locale" content="en_GB" />
<meta property="og:type" content="article" />
<meta property="og:title" content="Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development - preLights" />
<meta property="og:description" content="All endothelial roads lead to “Rome”: understanding the cell plasticity of cardiac blood vessels" />
<meta property="og:url" content="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/" />
<meta property="og:site_name" content="preLights" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:description" content="All endothelial roads lead to “Rome”: understanding the cell plasticity of cardiac blood vessels" />
<meta name="twitter:title" content="Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development - preLights" />
<script type='application/ld+json' class='yoast-schema-graph yoast-schema-graph--main'>{"@context":"https://schema.org","@graph":[{"@type":"WebSite","@id":"https://prelights.biologists.com/#website","url":"https://prelights.biologists.com/","name":"preLights","potentialAction":{"@type":"SearchAction","target":"https://prelights.biologists.com/?s={search_term_string}","query-input":"required name=search_term_string"}},{"@type":"WebPage","@id":"https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/#webpage","url":"https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/","inLanguage":"en-GB","name":"Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development - preLights","isPartOf":{"@id":"https://prelights.biologists.com/#website"},"datePublished":"2021-06-04T07:26:28+00:00","dateModified":"2021-06-04T07:26:28+00:00"}]}</script>
<!-- / Yoast SEO plugin. -->

<link rel='dns-prefetch' href='//s0.wp.com' />
<link rel='dns-prefetch' href='//www.google.com' />
<link rel='dns-prefetch' href='//s.w.org' />
<link rel="alternate" type="application/rss+xml" title="preLights &raquo; Feed" href="https://prelights.biologists.com/feed/" />
<link rel="alternate" type="application/rss+xml" title="preLights &raquo; Comments Feed" href="https://prelights.biologists.com/comments/feed/" />
<link rel="alternate" type="application/rss+xml" title="preLights &raquo; Coronary blood vessels from distinct origins converge to equivalent states during mouse and human development Comments Feed" href="https://prelights.biologists.com/highlights/coronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development/feed/" />
<link rel='stylesheet' id='user-registration-css-css'  href='https://prelights.biologists.com/wp-content/plugins/cobpph-registration/user-registration.css?v=1604931223&#038;ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='cld-font-awesome-css'  href='https://prelights.biologists.com/wp-content/plugins/comments-like-dislike/css/fontawesome/css/all.min.css?ver=1.1.1' type='text/css' media='all' />
<link rel='stylesheet' id='cld-frontend-css'  href='https://prelights.biologists.com/wp-content/plugins/comments-like-dislike/css/cld-frontend.css?ver=1.1.1' type='text/css' media='all' />
<link rel='stylesheet' id='contact-form-7-css'  href='https://prelights.biologists.com/wp-content/plugins/contact-form-7/includes/css/styles.css?ver=5.0.5' type='text/css' media='all' />
<link rel='stylesheet' id='wprc-style-css'  href='https://prelights.biologists.com/wp-content/plugins/report-content/static/css/styles.css?ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='wp-postratings-css'  href='https://prelights.biologists.com/wp-content/plugins/wp-postratings/css/postratings-css.css?ver=1.89' type='text/css' media='all' />
<link rel='stylesheet' id='wpt-twitter-feed-css'  href='https://prelights.biologists.com/wp-content/plugins/wp-to-twitter/css/twitter-feed.css?ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='jquery-ui-css-css'  href='https://prelights.biologists.com/wp-content/themes/thecobpph/vendor/jquery-ui-1.12.1.custom-datepicker/jquery-ui.min.css?ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='dashicons-css'  href='https://prelights.biologists.com/wp-includes/css/dashicons.min.css?ver=4.9.18' type='text/css' media='all' />
<link rel='stylesheet' id='social-logos-css'  href='https://prelights.biologists.com/wp-content/plugins/jetpack/_inc/social-logos/social-logos.min.css?ver=1' type='text/css' media='all' />
<link rel='stylesheet' id='jetpack_css-css'  href='https://prelights.biologists.com/wp-content/plugins/jetpack/css/jetpack.css?ver=6.7.2' type='text/css' media='all' />
<script type='text/javascript' src='https://prelights.biologists.com/wp-includes/js/jquery/jquery.js?ver=1.12.4'></script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=1.4.1'></script>
<script type='text/javascript'>
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-includes/js/zxcvbn-async.min.js?ver=1.0'></script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/cobpph-registration/user-registration.js?v=1604931223&#038;ver=4.9.18'></script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/themes/thecobpph/js/report_content_override.js?ver=4.9.18'></script>
<script type='text/javascript'>
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/comments-like-dislike/js/cld-frontend.js?ver=1.1.1'></script>
<script type='text/javascript'>
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/report-content/static/js/scripts.js?ver=4.9.18'></script>
<script type='text/javascript' src='https://www.google.com/recaptcha/api.js?ver=4.9.18'></script>
<script type='text/javascript'>
</script>
<script type='text/javascript' src='https://prelights.biologists.com/wp-content/plugins/safe-report-comments/js/ajax.js?ver=4.9.18'></script>
<link rel='https://api.w.org/' href='https://prelights.biologists.com/wp-json/' />
<link rel="EditURI" type="application/rsd+xml" title="RSD" href="https://prelights.biologists.com/xmlrpc.php?rsd" />
<link rel="wlwmanifest" type="application/wlwmanifest+xml" href="https://prelights.biologists.com/wp-includes/wlwmanifest.xml" /> 
<link rel='shortlink' href='https://prelights.biologists.com/?p=29382' />
<link rel="alternate" type="application/json+oembed" href="https://prelights.biologists.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fprelights.biologists.com%2Fhighlights%2Fcoronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development%2F" />
<link rel="alternate" type="text/xml+oembed" href="https://prelights.biologists.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fprelights.biologists.com%2Fhighlights%2Fcoronary-blood-vessels-from-distinct-origins-converge-to-equivalent-states-during-mouse-and-human-development%2F&#038;format=xml" />
<style>a.cld-like-dislike-trigger {color: #ffffff;}span.cld-count-wrap {color: #ffffff;}</style><style type='text/css'>img#wpstats{display:none}</style><style type="text/css">.recentcomments a{display:inline !important;padding:0 !important;margin:0 !important;}</style>
</head>
<!-- NAVBAR
================================================== -->
<body>
</body>
</html>
    `);
