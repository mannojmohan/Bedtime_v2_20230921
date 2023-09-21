import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Recorder from './Recorder';
import { MyThemeProvider } from '../../theme';
import { StyledEngineProvider } from '@mui/material';
import panchatantraBook from '../../data/panchatantra_draft/book';
import caterpillarBook from '../../data/caterpillar/book';

const meta = {
  title: 'Recorder',
  component: Recorder,
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
} satisfies Meta<typeof Recorder>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Caterpillar: Story = {
  args: {
    book: caterpillarBook,
  },
};