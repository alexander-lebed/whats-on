import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PlaceAutocomplete, { type PlacePayload } from './PlaceAutocomplete';

const meta: Meta<typeof PlaceAutocomplete> = {
  title: 'Features/PlaceAutocomplete',
  component: PlaceAutocomplete,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof PlaceAutocomplete>;

export const Basic: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<PlacePayload | null>(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    return (
      <div className="w-lg">
        {!apiKey ? (
          <div className="text-sm text-default-500">
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to test predictions.
          </div>
        ) : null}
        <PlaceAutocomplete
          locale="en"
          placeholder="Search for a place"
          onSelect={p => setSelected(p)}
        />
        <pre className="mt-4 text-xs bg-default-100 p-3 rounded">
          {JSON.stringify(selected, null, 2)}
        </pre>
      </div>
    );
  },
};
