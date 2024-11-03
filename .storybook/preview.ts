import type { Preview } from "@storybook/react";
import "nes.css/css/nes.min.css";
import "../src/index.css";
import "../src/design-system.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
