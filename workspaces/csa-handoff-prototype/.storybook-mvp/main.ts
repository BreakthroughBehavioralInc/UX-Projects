import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(storybookDir, "..");
const designSystem = path.resolve(projectRoot, "../mdlive-design-system");

const config: StorybookConfig = {
  stories: [
    "../stories/deliverable/**/*.stories.@(ts|tsx)",
    "../stories/deliverable/**/*.mdx",
  ],
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
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    config.resolve = {
      ...config.resolve,
      dedupe: ["react", "react-dom"],
      alias: [
        ...(Array.isArray(config.resolve?.alias) ? config.resolve.alias : []),
        { find: "@everkit/design-system", replacement: path.join(designSystem, "src/index.ts") },
        { find: /^@\/(.*)$/, replacement: path.join(designSystem, "src") + "/$1" },
      ],
    };
    config.optimizeDeps = {
      ...config.optimizeDeps,
      exclude: [...(config.optimizeDeps?.exclude ?? []), "@everkit/design-system"],
      include: [...(config.optimizeDeps?.include ?? []), "react", "react-dom"],
    };
    config.server = {
      ...config.server,
      fs: { allow: [projectRoot, designSystem, storybookDir] },
      warmup: {
        clientFiles: [
          "./.storybook-mvp/preview.tsx",
          "../stories/deliverable/HandoffDeliverable.stories.tsx",
        ],
      },
    };
    return config;
  },
};

export default config;
