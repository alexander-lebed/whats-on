import { withThemeByClassName } from '@storybook/addon-themes';
import '../app/globals.css';
import { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: { expanded: true },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--background)' },
        { name: 'dark', value: 'var(--background)' },
      ],
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
