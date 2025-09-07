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

// Localized events list: future or ongoing only (no drafts), sorted by startDate asc
export const EVENTS_QUERY_I18N = groq`
  *[
    _type == "event"
    && defined(startDateTime)
    && defined(slug.current)
    && !(_id in path('drafts.**'))
    && (
      dateTime(startDateTime) >= dateTime(now())
      || (defined(endDateTime) && dateTime(endDateTime) >= dateTime(now()))
    )
  ] | order(dateTime(startDateTime) asc) {
    ..., // include all fields by default
    "slug": slug.current,
    "title": coalesce(${i18nPick('title')}, ""),
    "summary": coalesce(${i18nPick('summary')}, ""),
    "categories": categories[]-> { _id, title, slug },
    "place": coalesce(place-> { _id, title, slug, address, location }, null),
    organizer-> { _id, title, slug }
  }
`;
