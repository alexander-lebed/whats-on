import { visionTool } from '@sanity/vision';
import { defineConfig, defineField } from 'sanity';
import { structureTool } from 'sanity/structure';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { SANITY_LANGUAGES } from '@/sanity/constants';
import deskStructure from './sanity/deskStructure';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'GoCastellon',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
    internationalizedArray({
      languages: SANITY_LANGUAGES,
      fieldTypes: [
        // Ensure both string and text internationalized types are registered
        defineField({ name: 'string', type: 'string' }),
        defineField({ name: 'text', type: 'text', rows: 5 }),
      ],
      languageDisplay: 'titleAndCode',
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
