import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(storybookDir, "..");

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: false,
  },
  docs: {
    autodocs: false,
  },
  viteFinal: (config) => {
    config.base = process.env.STORYBOOK_BASE_URL ?? '/';
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    config.resolve = {
      ...config.resolve,
      dedupe: ["react", "react-dom"],
    };
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include ?? []), "react", "react-dom"],
    };
    config.server = {
      ...config.server,
      fs: { allow: [projectRoot, storybookDir] },
      warmup: {
        clientFiles: [
          "./.storybook/preview.tsx",
          "../stories/RightRail.stories.tsx",
          "../src/layouts/HandoffLayouts.tsx",
        ],
      },
    };
    return config;
  },
};

export default config;
