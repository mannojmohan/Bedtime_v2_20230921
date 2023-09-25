import React from "react";

import { getBook, getQueryParams } from "../books";
import { useLoaderData, useLocation } from "react-router";
import { Book } from "../components/player/Book";
import { NavLink } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import Recorder from "../components/recorder/Recorder";

export async function loader({ params }: any) {

    const queryParams = getQueryParams();
    const book = await getBook(params.bookId , queryParams);

    if (!book) {
        throw new Response("", {
            status: 404,
            statusText: "Book Not Found"
        });
    }
    return { book , queryParams }
}

export default function BookPlayerPage() {
    const { book , queryParams } = useLoaderData() as { book: Book, queryParams:{key: string, name:string} | null };
    const [recording, setRecording] = React.useState(null);
    const location = useLocation()

    const requestParams = queryParams.key
    const requestName = queryParams.name

    let bookWithRecordingAsNarration = Object.assign({}, book);

    if (recording) {
        bookWithRecordingAsNarration.narrations = {
            "Current recording": {
                narrator_name: "Current user", audio: recording.blobUrl, timestamps: recording.timestamps
            }
        };
    }

    
    return (
        <div className="tall:py-4 lg:p-8 w-full">
            <div className="px-4 pb-2 lg:p-0">
                <MainHeader text={<><NavLink className="underline underline-offset-2" to="/books">Books</NavLink> / Recorder</>}></MainHeader>
            </div>
            <Recorder book={book} setRecording={setRecording} requestParams={requestParams} requestName={requestName} />

        </div>
    );
}