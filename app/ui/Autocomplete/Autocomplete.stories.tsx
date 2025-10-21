import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Autocomplete, type UIAutocompleteItem } from '@/app/ui/Autocomplete';

const meta: Meta<typeof Autocomplete> = {
  title: 'UI/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isLoading: {
      control: 'boolean',
    },
    isDisabled: {
      control: 'boolean',
    },
    isClearable: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

const staticItems: UIAutocompleteItem[] = [
  { key: '1', label: 'Alpha', description: 'First' },
  { key: '2', label: 'Beta', description: 'Second' },
  { key: '3', label: 'Gamma', description: 'Third' },
];

export const Basic: Story = {
  render: function Render(args) {
    const [inputValue, setInputValue] = useState('');
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const items = staticItems.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));
    return (
      <Autocomplete
        {...args}
        label="Choose"
        placeholder="Type to filter"
        items={items}
        inputValue={inputValue}
        onInputChange={setInputValue}
        selectedKey={selectedKey}
        onSelectionChange={key => setSelectedKey(String(key))}
      />
    );
  },
};
