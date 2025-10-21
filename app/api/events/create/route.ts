import { NextRequest } from 'next/server';
import slugify from 'slugify';
import { sanityWriteClient } from '@/lib/sanity/writeClient';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const image = form.get('image') as File | null;
    const titleJson = form.get('title') as string;
    const summaryJson = form.get('summary') as string;
    const scheduleJson = form.get('schedule') as string;
    const isDigital = form.get('isDigital') === 'true';
    const website = (form.get('website') as string) || undefined;
    const ticketUrl = (form.get('ticketUrl') as string) || undefined;
    const isFree = form.get('isFree') === 'true';
    const priceStr = (form.get('price') as string) || '';
    const categoriesJson = (form.get('categories') as string) || '[]';
    const placeCandidateJson = (form.get('placeCandidate') as string) || 'null';

    const title = JSON.parse(titleJson);
    const summary = JSON.parse(summaryJson);
    const schedule = JSON.parse(scheduleJson);
    const categories: string[] = JSON.parse(categoriesJson);
    const placeCandidate: null | {
      name: string;
      address: string;
      lat: number;
      lng: number;
    } = JSON.parse(placeCandidateJson);

    // Upload image
    let imageAssetRef: string | undefined;
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const asset = await sanityWriteClient.assets.upload('image', buffer, {
        filename: (image as any).name || 'event-image',
        contentType: image.type,
      });
      imageAssetRef = asset?._id ? asset._id : asset?._ref;
    }

    // Ensure place exists if provided
    let placeRef: { _type: 'reference'; _ref: string } | undefined;
    if (!isDigital && placeCandidate && Number.isFinite(placeCandidate.lat) && Number.isFinite(placeCandidate.lng)) {
      const existing = await sanityWriteClient.fetch(
        `*[_type=="place" && address==$address && location.lat==$lat && location.lng==$lng][0]{_id}`,
        { address: placeCandidate.address, lat: placeCandidate.lat, lng: placeCandidate.lng }
      );
      let placeId = existing?._id as string | undefined;
      if (!placeId) {
        const createPlace = await sanityWriteClient.create({
          _type: 'place',
          name: placeCandidate.name,
          slug: { _type: 'slug', current: slugify(placeCandidate.name, { lower: true }) },
          address: placeCandidate.address,
          location: { _type: 'geopoint', lat: placeCandidate.lat, lng: placeCandidate.lng },
        });
        placeId = createPlace._id as string;
      }
      if (placeId) {placeRef = { _type: 'reference', _ref: placeId };}
    }

    const english = (title as Array<{ _key: string; value: string }>).find(x => x._key === 'en')?.value;
    const baseSlug = english || (title[0]?.value as string) || 'event';
    const slug = slugify(baseSlug, { lower: true, strict: true }).slice(0, 90);

    const eventDoc: any = {
      _type: 'event',
      title,
      slug: { _type: 'slug', current: slug },
      summary,
      categories,
      schedule,
      isDigital,
      website,
      ticketUrl,
      isFree,
      price: isFree ? undefined : Number(priceStr) || undefined,
      place: placeRef,
    };
    if (imageAssetRef) {
      eventDoc.image = { _type: 'image', asset: { _type: 'reference', _ref: imageAssetRef } };
    }

    const created = await sanityWriteClient.create(eventDoc);
    return Response.json({ id: created._id, slug }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: 'Failed to create event' }, { status: 500 });
  }
}


