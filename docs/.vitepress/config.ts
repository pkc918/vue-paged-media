import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";

const zhNav = [
  { text: "指南", link: "/guide/getting-started" },
  { text: "Demo", link: "/demo/" },
];

const zhSidebar = [
  {
    text: "指南",
    items: [{ text: "快速开始", link: "/guide/getting-started" }],
  },
  {
    text: "Demo",
    items: [
      { text: "Demo 集合", link: "/demo/" },
      { text: "Dimensions", link: "/demo/dimensions" },
      { text: "Margin", link: "/demo/margin" },
      { text: "Column", link: "/demo/column" },
    ],
  },
];

const enNav = [
  { text: "Guide", link: "/en/guide/getting-started" },
  { text: "Demo", link: "/en/demo/" },
];

const enSidebar = [
  {
    text: "Guide",
    items: [{ text: "Getting Started", link: "/en/guide/getting-started" }],
  },
  {
    text: "Demo",
    items: [
      { text: "Demo Gallery", link: "/en/demo/" },
      { text: "Dimensions", link: "/en/demo/dimensions" },
      { text: "Margin", link: "/en/demo/margin" },
      { text: "Column", link: "/en/demo/column" },
    ],
  },
];

export default defineConfig({
  title: "vue-paged-media",
  description: "A Vue library for previewing paged media layouts before printing.",
  lang: "zh-CN",
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
    nav: zhNav,
    sidebar: zhSidebar,
    langMenuLabel: "切换语言",
    socialLinks: [{ icon: "github", link: "https://github.com/pkc918/vue-paged-media" }],
    search: {
      provider: "local",
    },
  },
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-CN",
      link: "/",
      title: "vue-paged-media",
      description: "用于打印前预览分页媒体布局的 Vue 组件库。",
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        langMenuLabel: "切换语言",
      },
    },
    en: {
      label: "English",
      lang: "en-US",
      link: "/en/",
      title: "vue-paged-media",
      description: "A Vue library for previewing paged media layouts before printing.",
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        langMenuLabel: "Change language",
      },
    },
  },
});
