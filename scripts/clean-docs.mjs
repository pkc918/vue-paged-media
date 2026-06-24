import { rmSync } from "node:fs";

rmSync("docs/.vitepress/dist", { recursive: true, force: true });
