import React from "react";

import MainHeader from "../components/MainHeader";

import { Book } from "../components/player/Book";
import { NavLink } from "react-router-dom";
import { getBook, getRecording } from "../books";
import { useLoaderData } from "react-router";
import { RecordingApi } from "../components/recorder/types";
import Player from "../components/player/Player";
import RecordingResults from "../components/recorder/RecordingResults";


export async function loader({ params }: any) {
    const recording = await getRecording(params.bookId);
    let book = null;
    if (params?.bookId) {
        book = await getBook(params?.bookId);
    }

    return { book, recording };
}


export default function Recording() {

    let { book, recording } = useLoaderData() as { book?: Book, recording: RecordingApi };

    const narationData = {}

    for(let item of recording?.results){
        narationData[item.narrator_name] = {
            audio : item.audio,
            timestamps : item.timestamps,   
            narrator_name : item.narrator_name
        }
    }
    let section = null;
    if (recording.book) {
        let bookWithRecordingAsNarration = Object.assign({}, book);
        bookWithRecordingAsNarration.narrations = {
            ...narationData,
        };

        section = <div className='flex flex-col gap-4'>
            <h2 className='text-xl my-4'>Preview recording in the player</h2>
            <Player book={bookWithRecordingAsNarration} />
        </div>
    } else {
        section = <div className='flex flex-col gap-4'>
            <p>This recording is not associated with a book.
            </p>
            <audio src={recording.audio} controls />
        </div>
    }

    return (
        <div className="tall:py-4 p-4 lg:p-8">
            <MainHeader text={<><NavLink className="underline underline-offset-2" to="/recordings">Recordings</NavLink> / {recording.id}</>} />
            {section}
        </div>
    );
}