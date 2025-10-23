'use client';

import { FC, Key, useCallback, useEffect, useRef, useState } from 'react';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import slugify from 'slugify';
import { GOOGLE_MAPS_API_KEY } from '@/app/features/Map/constants';
import { Autocomplete, type AutocompleteProps, type UIAutocompleteItem } from '@/app/ui';

export type Geopoint = { lat?: number; lng?: number } | undefined;

export type PlacePayload = {
  name: string;
  slug: { _type: 'slug'; current: string };
  address: string;
  zipCode?: string;
  city?: string;
  location?: Geopoint;
};

export type PlaceAutocompleteProps = Omit<AutocompleteProps, 'onSelect'> & {
  locale: string;
  onSelect: (place: PlacePayload) => void;
  onClear?: () => void;
};

const InnerPlaceAutocomplete: FC<PlaceAutocompleteProps> = ({
  locale,
  placeholder,
  onSelect,
  onClear,
  ...rest
}) => {
  const places = useMapsLibrary('places');
  const [inputValue, setInputValue] = useState('');
  const [selectedKey, setSelectedKey] = useState<Key | null>(null);
  const [items, setItems] = useState<UIAutocompleteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sessionRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const svcRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const detailsSvcRef = useRef<google.maps.places.PlacesService | null>(null);
  const detailsDivRef = useRef<HTMLDivElement | null>(null);
  const prevInputValueRef = useRef('');

  useEffect(() => {
    if (!places) {
      return;
    }
    // init services
    svcRef.current = new places.AutocompleteService();
    if (detailsDivRef.current) {
      detailsSvcRef.current = new places.PlacesService(detailsDivRef.current);
    }
  }, [places]);

  // start a new session when user starts typing
  useEffect(() => {
    if (!places) {
      return;
    }
    if (inputValue && !sessionRef.current) {
      sessionRef.current = new places.AutocompleteSessionToken();
    }
  }, [inputValue, places]);

  const fetchPredictions = useCallback(
    (query: string) => {
      const svc = svcRef.current;
      const token = sessionRef.current;
      if (!places || !svc || !query || !token) {
        setItems([]);
        return;
      }
      setIsLoading(true);
      svc.getPlacePredictions({ input: query, sessionToken: token, language: locale }, preds => {
        const mapped: UIAutocompleteItem[] = (preds ?? []).map(p => ({
          key: p.place_id!,
          label: p.structured_formatting?.main_text ?? p.description ?? 'Place',
          description: p.structured_formatting?.secondary_text ?? undefined,
        }));
        setItems(mapped);
        setIsLoading(false);
      });
    },
    [locale, places]
  );

  useEffect(() => {
    if (!inputValue) {
      setItems([]);
      // clear selection when the input transitions from non-empty to empty
      if (selectedKey !== null) {
        setSelectedKey(null);
      }
      if (prevInputValueRef.current) {
        onClear?.();
      }
    } else {
      const id = setTimeout(() => fetchPredictions(inputValue), 200);
      return () => clearTimeout(id);
    }
    prevInputValueRef.current = inputValue;
  }, [inputValue, fetchPredictions, selectedKey, onClear]);

  const endSession = () => {
    sessionRef.current = null;
  };

  const getDetails = useCallback(
    (placeId: string) =>
      new Promise<PlacePayload | null>(resolve => {
        const svc = detailsSvcRef.current;
        const token = sessionRef.current;
        if (!places || !svc || !token) {
          return resolve(null);
        }
        svc.getDetails(
          {
            placeId,
            sessionToken: token,
            fields: [
              'place_id',
              'name',
              'formatted_address',
              'address_components',
              'geometry.location',
            ],
            language: locale,
          },
          place => {
            if (!place) {
              return resolve(null);
            }
            const name = place.name || '';
            const address = place.formatted_address || '';
            const comps = place.address_components || [];
            const city = comps.find(
              c => c.types.includes('locality') || c.types.includes('postal_town')
            )?.long_name;
            const zip = comps.find(c => c.types.includes('postal_code'))?.long_name;
            const loc = place.geometry?.location
              ? { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
              : undefined;
            const slug = slugify(name, { lower: true, strict: true });
            resolve({
              name,
              slug: { _type: 'slug', current: slug },
              address,
              city: city || undefined,
              zipCode: zip || undefined,
              location: loc,
            });
          }
        );
      }),
    [locale, places]
  );

  const handleSelection = useCallback(
    async (key: Key | null) => {
      setSelectedKey(key);
      if (typeof key !== 'string') {
        return;
      }
      const details = await getDetails(key);
      if (details) {
        onSelect(details);
        endSession();
      }
    },
    [getDetails, onSelect]
  );

  return (
    <div>
      <div style={{ display: 'none' }} ref={detailsDivRef} />
      <Autocomplete
        {...rest}
        placeholder={placeholder}
        items={items}
        inputValue={inputValue}
        onInputChange={setInputValue}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        selectedKey={selectedKey}
        onSelectionChange={handleSelection}
        isLoading={isLoading}
      />
    </div>
  );
};

const PlaceAutocomplete: FC<PlaceAutocompleteProps> = props => {
  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language={props.locale} onError={console.error}>
      <InnerPlaceAutocomplete {...props} />
    </APIProvider>
  );
};

export default PlaceAutocomplete;
