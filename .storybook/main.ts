import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      image: {
        loading: 'eager',
      },
    },
  },
  stories: ['../**/*.stories.@(ts|tsx)'],
  // No addons needed; Storybook 9 ships core essentials by default
};

export default config;
