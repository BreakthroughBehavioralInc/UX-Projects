import type { Decorator, Preview } from "@storybook/react";
import { useEffect } from "react";
import "../src/styles/index.css";

const withEvernorthTheme: Decorator = (Story) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-mdlive", "theme-cigna-healthcare", "theme-partner", "dark");
    root.classList.add("theme-evernorth", "density-compact");
  }, []);

  return (
    <div className="density-compact" style={{ display: "contents" }}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withEvernorthTheme],
  parameters: {
    layout: "fullscreen",
    backgrounds: { disable: true },
    viewport: {
      viewports: {
        desktop: { name: "Desktop", styles: { width: "1440px", height: "900px" }, type: "desktop" },
        wide: { name: "Wide", styles: { width: "1680px", height: "900px" }, type: "desktop" },
      },
    },
  },
};

export default preview;
