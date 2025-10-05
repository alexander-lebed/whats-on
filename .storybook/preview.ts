import type { Preview } from 'storybook';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: { expanded: true },
    backgrounds: {
      options: {
        light: { name: 'Light', value: 'var(--foreground)' },
        dark: { name: 'Dark', value: 'var(--background)' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
};

export default preview;
