import { defineType } from 'sanity';

export default defineType({
  name: 'timeValue',
  title: 'Time',
  type: 'string',
  validation: Rule => Rule.regex(/^\d{2}:\d{2}$/),
});
