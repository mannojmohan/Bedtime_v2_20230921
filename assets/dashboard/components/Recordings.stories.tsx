import React, { FC } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Recordings from './Recordings';
import {
  HashRouter as Router,
} from "react-router-dom";

import { Book } from './player/Book';
import drawerBook from '../data/drawer/book';
import caterpillarBook from '../data/caterpillar/book';
import { RecordingApi, RecordingRequestApi } from './recorder/types';


const bookRegistry = {
  2: drawerBook,
  3: caterpillarBook,
};


const otherBooks = {
  12: drawerBook,
  13: caterpillarBook,
};

function getBigBookRegistry() {
  let bigbookRegistry: { [key: number]: Book } = {
    2: drawerBook,
    3: caterpillarBook,
  }

  for (let i = 4; i < 20; i++) {
    bigbookRegistry[i] = (i % 2) ? drawerBook : caterpillarBook;
  }
  return bigbookRegistry;
}

const recordingRequests: RecordingRequestApi[] = [
  {
    "id": "f5091835-a50c-42eb-9d0e-387b4d777826",
    "book": 2,
    "narrator_name": "Aunt Aditi",
    "custom_note": "Hey, please record an awesome book for Elan!",
    "status": "New",
    "created_at": "2023-06-30T18:54:54.811383Z",
    "last_modified": "2023-06-30T18:54:54.811392Z"
  },
  {
    "id": "f5091835-a50c-42eb-9d0e-387b4d777826",
    "book": 3,
    "narrator_name": "Uncle Punkle",
    "custom_note": "Hey, please record an awesome book for Elan!",
    "status": "Started",
    "created_at": "2023-06-28T18:54:54.811383Z",
    "last_modified": "2023-06-28T18:54:54.811392Z"
  },

  {
    "id": "f5091835-a50c-42eb-9d0e-387b4d777826",
    "book": 2,
    "narrator_name": "Uncle Punkle",
    "custom_note": "Hey, please record an awesome book for Elan!",
    "status": "Finished",
    "created_at": "2023-06-23T18:54:54.811383Z",
    "last_modified": "2023-06-23T18:54:54.811392Z"
  },
];

function getManyRecordingRequests() {
  let requests = Array.from(recordingRequests);
  for (let i = 4; i < 20; i++) {
    requests.push({
      "id": "f5091835-a50c-42eb-9d0e-387b4d777826",
      "book": 2,
      "narrator_name": "Uncle Punkle",
      "custom_note": "Hey, please record an awesome book for Elan!",
      "status": "Finished",
      "created_at": "2023-06-23T18:54:54.811383Z",
      "last_modified": "2023-06-23T18:54:54.811392Z"
    });
  }
  return requests;
}

const recordings: RecordingApi[] = [
  {
    "id": 10,
    "audio": "http://127.0.0.1:8000/media/blob_h3TJxJv",
    "timestamps": [
      [
        "1",
        0.8,
        3.5999773242630386
      ],
      [
        "2",
        5.8999773242630384,
        8.399954648526077
      ]
    ],
    "created_at": "2023-06-30T17:22:54.183533Z",
    "last_modified": "2023-06-30T17:22:54.183558Z",
    "user": 1,
    "book": 3,
    "request": null
  },
  {
    "id": 9,
    "audio": "http://127.0.0.1:8000/media/blob_d0O3JOP",
    "timestamps": [
      [
        "1",
        1,
        5.54
      ],
      [
        "2",
        7.54,
        18.62
      ]
    ],
    "created_at": "2023-06-30T15:32:47.806844Z",
    "last_modified": "2023-06-30T15:32:47.806859Z",
    "user": 1,
    "book": 2,
    "request": null
  },
];


function getManyRecordings() {
  let requests = Array.from(recordings);
  for (let i = 4; i < 20; i++) {
    requests.push({
      "id": 9,
      "audio": "http://127.0.0.1:8000/media/blob_d0O3JOP",
      "timestamps": [
        [
          "1",
          1,
          5.54
        ],
        [
          "2",
          7.54,
          18.62
        ]
      ],
      "created_at": "2023-06-30T15:32:47.806844Z",
      "last_modified": "2023-06-30T15:32:47.806859Z",
      "user": 1,
      "book": 2,
      "request": null
    },);
  }
  return requests;
}

const meta = {
  title: 'Recordings',
  component: Recordings,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  decorators: [
    (story) => <Router>{story()}</Router>
  ],
} satisfies Meta<typeof Recordings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    books: {},
    recordings: [],
    recordingRequests: []
  },
};

export const NoRecordingsBooksOnly: Story = {
  args: {
    books: bookRegistry,
    recordings: [],
    recordingRequests: []
  },
};


export const SomeContent: Story = {
  args: {
    books: bookRegistry,
    recordings: recordings,
    recordingRequests: recordingRequests,
  },
};


export const ManyBooks: Story = {
  args: {
    books: getBigBookRegistry(),
    recordings: recordings,
    recordingRequests: recordingRequests
  },
};

export const ManyEverything: Story = {
  args: {
    books: getBigBookRegistry(),
    recordings: getManyRecordings(),
    recordingRequests: getManyRecordingRequests()
  },
};


export const Misconfigured: Story = {
  args: {
    books: otherBooks,
    recordings: recordings,
    recordingRequests: recordingRequests,
  },
};