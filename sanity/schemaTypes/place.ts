import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'place',
  title: 'Place',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geopoint',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'address' },
  },
});
