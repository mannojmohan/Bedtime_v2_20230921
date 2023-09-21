import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RecordingResults from './RecordingResults';
import { MyThemeProvider } from '../../theme';
import { StyledEngineProvider } from '@mui/material';
import bookAudioJ from '../../data/caterpillar/justyna_bad.mp3';
import { RecordingWithABlob, Timestamp } from './types';
import book1 from '../../data/drawer/book';


const meta = {
  title: 'RecordingResults',
  component: RecordingResults,
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
} satisfies Meta<typeof RecordingResults>;

export default meta;
type Story = StoryObj<typeof meta>;

const timestamps: Array<Timestamp> = [
    [
      "1-2",
      0,
      2.8799773242630384
    ],
    [
      "3-4",
      2.9799773242630385,
      7.359954648526077
    ],
    [
      "5-6",
      8.459954648526077,
      13.279931972789115
    ],
    [
      "7-8",
      14.379931972789116,
      16.819909297052156
    ],
    [
      "9-10",
      15.919909297052154,
      24.279909297052154
    ],
    [
      "11-12",
      25.379909297052155,
      27.739909297052154
    ],
    [
      "13-14",
      28.839909297052156,
      32.03988662131519
    ],
    [
      "15-16",
      33.13988662131519,
      35.73988662131519
    ],
    [
      "17-18",
      36.839886621315195,
      42.2598866213152
    ],
    [
      "19-20",
      43.3598866213152,
      49.739863945578236
    ],
    [
      "21-22",
      50.83986394557824,
      52.959863945578235
    ]
]

const AUDIO_EXAMPLE: RecordingWithABlob = {
  blob: new Blob(),
  timestamps, blobUrl: bookAudioJ
};

let recordingStatus = {val: ""};

export const Basic: Story = {
  args: {
    handleCombineRecordings: () => { console.log("Combining...") },
    audio: AUDIO_EXAMPLE,
    book: book1,
    uploadRecording: () => {console.log("Uploading")},
    uploadingMessage: recordingStatus.val,
  },
};

export const NoAudio: Story = {
  args: {
    handleCombineRecordings: () => { console.log("Combining...") },
    book: book1,
    uploadRecording: () => {console.log("uploading...");},
    uploadingMessage: recordingStatus.val,
  },
};