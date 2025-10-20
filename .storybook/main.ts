import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  stories: ['../**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-themes'],
};

export default config;
