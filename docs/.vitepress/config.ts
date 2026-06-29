import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";

const { version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf-8"),
);

const zhNav = [
  { text: "指南", link: "/zh/guide/getting-started" },
  { text: "Demo", link: "/zh/demo/" },
];

const zhSidebar = [
  {
    text: "指南",
    items: [{ text: "快速开始", link: "/zh/guide/getting-started" }],
  },
  {
    text: "Demo",
    items: [
      { text: "Demo 集合", link: "/zh/demo/" },
      { text: "Dimensions", link: "/zh/demo/dimensions" },
      { text: "Margin", link: "/zh/demo/margin" },
      { text: "Column", link: "/zh/demo/column" },
      { text: "排页方式", link: "/zh/demo/page-flow" },
      { text: "打印", link: "/zh/demo/print" },
      { text: "Blocks", link: "/zh/demo/blocks" },
      { text: "页边插槽", link: "/zh/demo/page-margin-slots" },
    ],
  },
];

const enNav = [
  { text: "Guide", link: "/guide/getting-started" },
  { text: "Demo", link: "/demo/" },
];

const enSidebar = [
  {
    text: "Guide",
    items: [{ text: "Getting Started", link: "/guide/getting-started" }],
  },
  {
    text: "Demo",
    items: [
      { text: "Demo Gallery", link: "/demo/" },
      { text: "Dimensions", link: "/demo/dimensions" },
      { text: "Margin", link: "/demo/margin" },
      { text: "Column", link: "/demo/column" },
      { text: "Page Flow", link: "/demo/page-flow" },
      { text: "Print", link: "/demo/print" },
      { text: "Blocks", link: "/demo/blocks" },
      { text: "Page Margin Slots", link: "/demo/page-margin-slots" },
    ],
  },
];

export default defineConfig({
  title: "vue-paged-media",
  description: "A Vue library for previewing paged media layouts before printing.",
  lang: "en-US",
  base: process.env.DOCS_BASE || "/",
  cleanUrls: true,
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          vp: "logos:vitejs",
        },
      }),
    ],
    resolve: {
      alias: {
        "vue-paged-media/style.css": fileURLToPath(new URL("../../src/style.css", import.meta.url)),
        "vue-paged-media": fileURLToPath(new URL("../../src/index.ts", import.meta.url)),
      },
    },
  },
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      ...enNav,
      { text: `v${version}`, link: "https://github.com/pkc918/vue-paged-media/releases" },
    ],
    sidebar: enSidebar,
    langMenuLabel: "Change language",
    socialLinks: [{ icon: "github", link: "https://github.com/pkc918/vue-paged-media" }],
    search: {
      provider: "local",
    },
  },
  locales: {
    root: {
      label: "English",
      lang: "en-US",
      link: "/",
      title: "vue-paged-media",
      description: "A Vue library for previewing paged media layouts before printing.",
      themeConfig: {
        nav: [
          ...enNav,
          { text: `v${version}`, link: "https://github.com/pkc918/vue-paged-media/releases" },
        ],
        sidebar: enSidebar,
        langMenuLabel: "Change language",
      },
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/zh/",
      title: "vue-paged-media",
      description: "用于打印前预览分页媒体布局的 Vue 组件库。",
      themeConfig: {
        nav: [
          ...zhNav,
          { text: `v${version}`, link: "https://github.com/pkc918/vue-paged-media/releases" },
        ],
        sidebar: zhSidebar,
        langMenuLabel: "切换语言",
      },
    },
  },
});
