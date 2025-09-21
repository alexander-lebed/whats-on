import { groq } from 'next-sanity';

// Helper to pick a string value from internationalized arrays with fallbacks
// Always resolves to string|null, so TypeGen infers a scalar
const i18nPick = (field: string) => `coalesce(
  ${field}[ _key == $lang ][0].value,
  ${field}[ _key == 'en' ][0].value,
  ${field}[ _key == 'es' ][0].value,
  ${field}[0].value,
  null
)`;

// Localized events list: require schedule present and order by startDate
export const EVENTS_QUERY_I18N = groq`
  *[
    _type == "event"
    && defined(schedule.startDate)
    && defined(slug.current)
    && !(_id in path('drafts.**'))
  ] | order(schedule.startDate asc) {
    ..., // include all fields by default
    "slug": slug.current,
    "title": coalesce(${i18nPick('title')}, ""),
    "summary": coalesce(${i18nPick('summary')}, ""),
    "categories": coalesce(categories, []),
    "place": coalesce(place-> { _id, title, slug, address, location }, null),
    organizer-> { _id, title, slug }
  }
`;
