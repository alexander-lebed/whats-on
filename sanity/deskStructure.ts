import { StructureBuilder } from 'sanity/structure';

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Events')
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('Upcoming')
                .child(
                  S.documentList()
                    .title('Upcoming events')
                    .schemaType('event')
                    .filter('_type == "event" && startDateTime >= now()')
                    .defaultOrdering([{ field: 'startDateTime', direction: 'asc' }])
                ),
              S.listItem()
                .title('Past')
                .child(
                  S.documentList()
                    .title('Past events')
                    .schemaType('event')
                    .filter('_type == "event" && startDateTime < now()')
                    .defaultOrdering([{ field: 'startDateTime', direction: 'desc' }])
                ),
              S.listItem()
                .title('Featured')
                .child(
                  S.documentList()
                    .title('Featured events')
                    .schemaType('event')
                    .filter('_type == "event" && isFeatured == true')
                    .defaultOrdering([{ field: 'startDateTime', direction: 'asc' }])
                ),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('place').title('Places'),
      S.documentTypeListItem('organizer').title('Organizers'),
    ]);

export default deskStructure;
