import React, {FC} from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from './Sidebar';

import {
    HashRouter as Router,
} from "react-router-dom";

const meta = {
  title: 'Sidebar',
  component: Sidebar,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    (story) => <Router>{story()}</Router>
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Basic: Story = {};