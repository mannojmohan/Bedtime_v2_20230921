import * as React from 'react';

import { Recording } from './types';
import Button from '@mui/material/Button';
import { Book } from '../player/Book';

import Player from "../player/Player";


export default function RecordingResults({
    handleCombineRecordings, audio, uploadRecording, book, uploadingMessage, recordingName, requestParams }: {
        handleCombineRecordings: () => void,
        audio?: Recording,
        uploadRecording: () => void,
        book: Book,
        uploadingMessage: string,
        recordingName: string,
        requestParams: string,

    }) {

    let bookWithRecordingAsNarration = Object.assign({}, book);
    let section = null;
    if (audio) {
        bookWithRecordingAsNarration.narrations = {
            [recordingName]: {
                narrator_name: `${recordingName}`, audio: audio.blobUrl, timestamps: audio.timestamps
            }
        };

        section = <div className='flex flex-col gap-4'>
            <h2 className='text-xl my-4'>Preview recording in the player</h2>
            <Player book={bookWithRecordingAsNarration} />

            {/* <h2 className='text-xl my-4'>All good?</h2> */}
            <p>Don't worry about the clicking, other mouse sounds, or some amount of background noise, they will be fixed in post processing. You can always go back and rerecord any of the pages.</p>
            <p><Button variant='contained' onClick={uploadRecording}>Upload recording</Button>
            </p>
            <p>{uploadingMessage}</p>

        </div>
    } else {
        section = <div>
            <Button className="" variant='contained' onClick={handleCombineRecordings} disabled={requestParams ? !!!requestParams : !!!recordingName}>Combine recordings</Button>
            {!requestParams && !recordingName && <p>please enter a recording name for combine</p>}
        </div>;
    }


    return (
        <div className='mx-4 lg:mx-0 my-8'>
            {section}
        </div>
    );
}