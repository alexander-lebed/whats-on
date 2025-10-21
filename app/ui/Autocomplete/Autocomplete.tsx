'use client';

import { FC } from 'react';
import {
  Autocomplete as HAutocomplete,
  AutocompleteProps as HAutocompleteProps,
  AutocompleteItem,
} from '@heroui/autocomplete';

export type UIAutocompleteItem = {
  key: string;
  label: string;
  description?: string;
};

export type AutocompleteProps = Omit<HAutocompleteProps<UIAutocompleteItem>, 'children'>;

export const Autocomplete: FC<AutocompleteProps> = ({ ...rest }) => {
  return (
    <HAutocomplete {...rest}>
      {item => (
        <AutocompleteItem key={item.key} textValue={item.label} description={item.description}>
          {item.label}
        </AutocompleteItem>
      )}
    </HAutocomplete>
  );
};

export default Autocomplete;
