// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/react';

import { INITIAL_VIEWPORTS} from "@storybook/addon-viewport";

import '../static/css/site-tailwind.css';

const preview: Preview = {
  parameters: {

    viewport: {
      viewports: INITIAL_VIEWPORTS,
    }
  },
};

export default preview;