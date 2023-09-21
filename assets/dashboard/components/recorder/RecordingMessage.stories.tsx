import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RecordingMessage from './RecordingMessage';
import { MyThemeProvider } from '../../theme';
import { StyledEngineProvider } from '@mui/material';

const meta = {
  title: 'RecordingMessage',
  component: RecordingMessage,
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
} satisfies Meta<typeof RecordingMessage>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Basic: Story = {
  args: {
    content: <div><p>Starting recording in 3s... </p>
    <p>Speak slow, loud and clear.</p></div>,
    visible: true,
  },
};

export const Invisible: Story = {
    args: {
      content: <div><p>Starting recording in 3s... </p>
      <p>Speak slow, loud and clear.</p></div>,
      visible: false,
    },
  };