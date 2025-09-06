import { visionTool } from '@sanity/vision';
import { defineConfig, Template, defineField } from 'sanity';
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
    templates: prev => prev.concat(categories),
  },
});

const categories: Template[] = [
  {
    id: 'category-music',
    title: 'Category: Music',
    schemaType: 'category',
    value: { title: 'Music', slug: { current: 'music' } },
  },
  {
    id: 'category-nightlife-parties',
    title: 'Category: Nightlife & Parties',
    schemaType: 'category',
    value: { title: 'Nightlife & Parties', slug: { current: 'nightlife-parties' } },
  },
  {
    id: 'category-performing-arts',
    title: 'Category: Performing Arts',
    schemaType: 'category',
    value: { title: 'Performing Arts', slug: { current: 'performing-arts' } },
  },
  {
    id: 'category-stage-film',
    title: 'Category: Stage & Film',
    schemaType: 'category',
    value: { title: 'Stage & Film', slug: { current: 'stage-film' } },
  },
  {
    id: 'category-art-exhibitions',
    title: 'Category: Art & Exhibitions',
    schemaType: 'category',
    value: { title: 'Art & Exhibitions', slug: { current: 'art-exhibitions' } },
  },
  {
    id: 'category-food-drink',
    title: 'Category: Food & Drink',
    schemaType: 'category',
    value: { title: 'Food & Drink', slug: { current: 'food-drink' } },
  },
  {
    id: 'category-family-kids',
    title: 'Category: Family & Kids',
    schemaType: 'category',
    value: { title: 'Family & Kids', slug: { current: 'family-kids' } },
  },
  {
    id: 'category-sports-wellness',
    title: 'Category: Sports & Wellness',
    schemaType: 'category',
    value: { title: 'Sports & Wellness', slug: { current: 'sports-wellness' } },
  },
  {
    id: 'category-festivals-fairs',
    title: 'Category: Festivals & Fairs',
    schemaType: 'category',
    value: { title: 'Festivals & Fairs', slug: { current: 'festivals-fairs' } },
  },
  {
    id: 'category-classes-workshops',
    title: 'Category: Classes & Workshops',
    schemaType: 'category',
    value: { title: 'Classes & Workshops', slug: { current: 'classes-workshops' } },
  },
  {
    id: 'category-science-tech',
    title: 'Category: Science & Tech',
    schemaType: 'category',
    value: { title: 'Science & Tech', slug: { current: 'science-tech' } },
  },
  {
    id: 'category-business-networking',
    title: 'Category: Business & Networking',
    schemaType: 'category',
    value: { title: 'Business & Networking', slug: { current: 'business-networking' } },
  },
  {
    id: 'category-community-civic',
    title: 'Category: Community & Civic',
    schemaType: 'category',
    value: { title: 'Community & Civic', slug: { current: 'community-civic' } },
  },
  {
    id: 'category-tours-outdoor',
    title: 'Category: Tours & Outdoor',
    schemaType: 'category',
    value: { title: 'Tours & Outdoor', slug: { current: 'tours-outdoor' } },
  },
  {
    id: 'category-markets-shopping',
    title: 'Category: Markets & Shopping',
    schemaType: 'category',
    value: { title: 'Markets & Shopping', slug: { current: 'markets-shopping' } },
  },
];
