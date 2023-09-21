import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Player from './Player';
import { MyThemeProvider } from '../../theme';
import { StyledEngineProvider } from '@mui/material';
import panchatantraBook from '../../data/panchatantra_draft/book';
import caterpillarBook from '../../data/caterpillar/book';

const meta = {
  title: 'Player',
  component: Player,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [(Story) => {
    return (<MyThemeProvider>
        <StyledEngineProvider injectFirst={true} /><Story /></MyThemeProvider>)

  }],
} satisfies Meta<typeof Player>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Panchatantra: Story = {
  args: {
    book: panchatantraBook,
  },
};

export const Caterpillar: Story = {
  args: {
    book: caterpillarBook,
  },
};