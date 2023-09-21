import React, { useState } from "react";

import RecordingsList from "../components/Recordings";

import { Book } from "../components/player/Book";

import { getBooks, getRecordingRequests, getRecordings } from "../books";
import { useLoaderData } from "react-router";
import { RecordingRequestApi, RecordingApi } from "../components/recorder/types";

export async function loader({ }) {
    const books = await getBooks();
    const recordingRequest = await getRecordingRequests();
    const recordings = await getRecordings();
    return { books, recordingRequest, recordings };
}

export default function Recordings() {

    const { books, recordingRequest, recordings } = useLoaderData() as { books: { [key: string]: Book }, recordingRequest: RecordingRequestApi[], recordings: RecordingApi[] };

    const [recordingRequests, setRecordingRequests] = useState(recordingRequest)


    return (
        <div className="tall:py-4 p-4 lg:p-8">


            <RecordingsList {...{ books, recordingRequests, recordings, setRecordingRequests }} />
        </div>
    );
}