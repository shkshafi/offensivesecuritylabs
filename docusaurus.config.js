import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "OffensiveSecurity Labs",
  tagline: "OffensiveSecurity Labs",
  // favicon: 'img/favicon.ico',
  favicon: "img/favicon.ico",
  // Set the production url of your site here
  url: "https://offensivesecuritylabs.com/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/kb/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "offensivesecuritylabs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/", // Serve the docs at the site's root
          sidebarPath: "./sidebars.js",

        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: "",
        logo: {
          alt: "Offensive Security Labs",
          // src: 'img/logo.svg',
          src: "img/logo_light.png",
          srcDark: "img/logo_dark.jpg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "🏠 Docs",
          },
          { to: "/blog", label: "✍️ Blog", position: "left" },
          { to: "/author", label: "👑 Author", position: "left" },
          // { to: "/services", label: "🛠️ Services", position: "left" },
          { to: "/contact", label: "📬 Contact", position: "left" },
          {
            href: "https://offensivesecuritylabs.com/",
            target: "_self",
            label: "➡️ Back to Offensive Security Labs",
            position: "right",
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} Offensive Security Labs. <br /> Made with ❤️`,
        links: [
          {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/shkshafi",
          },
          {
            label: "Github",
            href: "https://github.com/shkshafi",
          },
          {
            label: "X",
            href: "https://x.com/shkshafi",
          },
          {
            html: `<br/>
                <a aria-label="Deploys by ">
                  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by " width="114" height="51" />
                </a>
                <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"></script>
                <amp-ad width="100vw" height="320"
     type="adsense"
     data-ad-client="ca-pub-1260667564079492"
     data-ad-slot="1240870063"
     data-auto-format="rspv"
     data-full-width="">
  <div overflow=""></div>
</amp-ad>
              `,
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
