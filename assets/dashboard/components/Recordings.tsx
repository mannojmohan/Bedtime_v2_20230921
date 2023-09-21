import React, { useState } from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import MainHeader from "../components/MainHeader";
import { RecordingRequestApi, RecordingApi } from "./recorder/types";

import { Book } from "./player/Book";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { STANDARD_COLORS } from "./colors";
import { ErrorBoundary } from "../error_utils";
import { Box, Modal } from "@mui/material";
import { getRecordingRequests, getRecordingUrl, saveRecording, copyToClipboard } from "../books";
import { Close } from "@mui/icons-material";


const REQUEST_STATUS = {
    New: "Not Completed",
    Finished: "Completed",
    Start: "Started"
}

function BookCard({
    bookId,
    book,
    setRecordingRequests,
}: {
    bookId: string;
    book: Book;
    setRecordingRequests: any;
}) {

    console.log(book);
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [narratorName, setNarratorName] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [postRecordingSuccess, setPostRecordingSuccess] = useState(false);

    const requestRecording = async () => {
        const recordingUrl = await getRecordingUrl(Number(bookId));

        if (recordingUrl.url) {
            setUrl(recordingUrl.url);
        }
        setOpen(true);
    };

    const handleSave = async () => {
        // await saveRecording(Number(bookId) , );
        setLoading(true);
        if (narratorName.length) {
            let id = url.split("=")
            const data = await saveRecording(
                Number(bookId),
                narratorName,
                "New Recording Request",
                id[id.length - 1]
            );


            if (data.ok) {
                setUrl(url + `&&name=${data?.data?.narrator_name}`)
                const datas = await getRecordingRequests();
                if (datas) {
                    setRecordingRequests(datas);
                    setLoading(false);
                    setPostRecordingSuccess(true);
                    setNarratorName("")
                }
            } else {
                setErrors({
                    name: data.errors
                        .result.message
                });
                setLoading(false);
            }
        } else {
            setErrors({
                name: "the field should contain a Name",
            });
            setLoading(false);
        }
    };


    return (
        <Card
            sx={{
                width: 345,
                my: 2,
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div>
                <CardMedia
                    sx={{ height: 160 }}
                    image={book.cover}
                    title="book cover"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {book.description}
                    </Typography>
                </CardContent>
            </div>

            <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button href={`#/recorder/${bookId}`}>Record</Button>
                <Button onClick={requestRecording} disabled={false}>
                    Request Recording
                </Button>
            </CardActions>
            <Modal open={open} onClose={() => {
                setPostRecordingSuccess(false)
                setOpen(false)
            }}>
                {!postRecordingSuccess ? (
                    <Box
                        sx={{
                            position: "absolute" as "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 500,
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <div className="flex items-center">
                            <label htmlFor="narrator_name">Recording Name</label>
                            <input
                                onChange={(e) => {
                                    setNarratorName(e.target.value);
                                }}
                                onFocus={() => {
                                    setErrors({ ...errors, name: null });
                                }}
                                className="border-2 w-48 p-1 ml-2 border-2 border-black w-full"
                                id="narrator_name"
                            />
                        </div>
                        <p className="text-red-700">{errors?.name}</p>


                        <div className="flex items-center justify-between gap-5 mt-6">
                            <button
                                onClick={handleSave}
                                className="bg-indigo-600 p-1 w-32 border-2 border-black text-white"
                            >
                                {loading ? "saving..." : "Save Recording"}
                            </button>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                }}
                                className="bg-indigo-600 p-1 w-32 border-2 border-black text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            position: "absolute" as "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 500,
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Close onClick={() => {
                            setPostRecordingSuccess(false)
                            setOpen(false)
                        }} /></div>
                        <p >
                            Recording request successfully created. You can track the status
                            of the recording in the Recording Requests panel
                        </p>
                        <div className="flex items-center justify-between my-5">
                            <input
                                className="border-2 w-72 p-1 border-2 border-black w-32"
                                value={url}
                                onCopy={(e) => { e.preventDefault() }}
                            />
                            <button
                                onClick={() => copyToClipboard(url)}
                                className="bg-indigo-600 p-1 border-2 border-black w-32 text-white"

                            >
                                Copy Url
                            </button>
                        </div>
                        <p>
                            Please copy the recording request URL and send it to your loved
                            one. Save the recording request to be able to track the status of
                            the recording.
                        </p>
                    </Box>
                )}
            </Modal>
        </Card>
    );
}
function RecordingRequestCard({
    book,
    recordingRequest,
}: {
    book: Book;
    recordingRequest: RecordingRequestApi;
}) {
    return (
        <Card
            sx={{
                width: 345,
                my: 2,
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Status: {recordingRequest.status}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Created {new Date(recordingRequest.created_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Narrator name: {recordingRequest.narrator_name}
                    </Typography>
                </CardContent>
                <CardMedia
                    sx={{ height: 160 }}
                    image={book.cover}
                    title="book cover"
                />
            </div>
        </Card>
    );
}

const UpdatedRecordingRequestCard = ({
    book,
    recordingRequest,
}: {
    book: Book;
    recordingRequest: RecordingRequestApi;
}) => {




    return <Card sx={{
        width: ["none",500,500],
        my: 2,
        p: 2,
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
    }}>
        <table>
            <th style={{ textAlign: 'left' }}>Recording Request Name </th>
            <th style={{ marginRight: "50px" }}> Status</th>
            <th> Date</th>
            <th> Actions</th>
            <tbody>
                <td>{recordingRequest?.narrator_name}</td>
                <td style={{ textAlign: 'center' }}>
                    {REQUEST_STATUS[recordingRequest?.status]}
                </td>
                <td style={{ textAlign: 'center' }}>{new Date(recordingRequest?.status == "New" ? recordingRequest.created_at : recordingRequest.last_modified).toLocaleDateString()}</td>
                <td style={{ textAlign: 'center' }}>
                    <button
                        onClick={() => copyToClipboard(recordingRequest?.requested_url)}
                        className="bg-indigo-600 p-1 border-2 border-black  text-white disabled:bg-gray-400"
                        disabled={!!(REQUEST_STATUS[recordingRequest?.status] == "Completed")}
                    >
                        Copy Url
                    </button>
                </td>
            </tbody>
        </table>
    </Card>
}

function RecordingCard({
    book,
    recording,
}: {
    book: Book;
    recording: RecordingApi;
}) {
    return (
        <Card
            sx={{
                width: 345,
                my: 2,
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {recording.request
                            ? "Request: " + recording.request
                            : "Self recorded"}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        {book
                            ? book.title
                            : recording.book
                                ? "Book couldn't be loaded"
                                : "No book"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Created {new Date(recording.created_at).toLocaleDateString()}
                    </Typography>
                </CardContent>
                {book ? (
                    <CardMedia
                        sx={{ height: 160 }}
                        image={book.cover}
                        title="book cover"
                    />
                ) : null}

                <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Button href={`#/recordings/${recording.book}`}>View</Button>
                </CardActions>
            </div>
        </Card>
    );
}

function EmptyBooks() {
    return (
        <div className="shadow-md rounded-md bg-gray-200 w-full max-w-[850px] p-10 text-center">
            <div className="max-w-[350px] m-auto my-6">
                <Typography gutterBottom variant="h5" component="div">
                    No books? What?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    That shouldn't be happening, what happened to the library?
                </Typography>

                <div className="py-4 flex items-center justify-center">
                    <LibraryBooksIcon
                        sx={{ fontSize: "4rem", color: STANDARD_COLORS["custom_gray"] }}
                    />
                </div>
            </div>
        </div>
    );
}

function EmptyRecordings() {
    return (
        <div className="shadow-md rounded-md bg-gray-200 w-full max-w-[850px] p-10 text-center">
            <div className="max-w-[350px] m-auto my-6">
                <Typography gutterBottom variant="h5" component="div">
                    No recordings so far
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    If you record content yourself or someone records content in response
                    to your recording request, the recordings will show up here.
                </Typography>

                <div className="py-4 flex items-center justify-center">
                    <KeyboardVoiceIcon
                        sx={{ fontSize: "4rem", color: STANDARD_COLORS["custom_gray"] }}
                    />
                </div>
            </div>
        </div>
    );
}

function EmptyRecordingRequests() {
    return (
        <div className="shadow-md rounded-md bg-gray-200 w-full max-w-[850px] p-10 text-center">
            <div className="max-w-[350px] m-auto my-6">
                <Typography gutterBottom variant="h5" component="div">
                    No requests so far
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    If you create a recording request it will show up here and you will be
                    see if it is not started, started, finished.
                </Typography>

                <div className="py-4 flex items-center justify-center">
                    <RecordVoiceOverIcon
                        sx={{ fontSize: "4rem", color: STANDARD_COLORS["custom_gray"] }}
                    />
                </div>
            </div>
        </div>
    );
}

function RecordingsList({
    books,
    recordings,
}: {
    books: { [key: string]: Book };
    recordings: RecordingApi[];
}) {
    const recordingEntries = recordings.map((recording) => (
        <RecordingCard
            recording={recording}
            key={recording.id}
            book={books[recording.book]}
        />
    ));

    return (
        <>
            <h2 className="text-xl my-4">All recordings</h2>
            <div className="flex flex-col md:flex-row md:gap-4 flex-wrap">
                {recordings.length > 0 ? recordingEntries : <EmptyRecordings />}
            </div>
        </>
    );
}

function RecordingRequestsList({
    books,
    recordingRequests,
}: {
    books: { [key: string]: Book };
    recordingRequests: RecordingRequestApi[];
}) {
    const requestEntries = recordingRequests.map((request) => (
        // <RecordingRequestCard
        //   recordingRequest={request}
        //   key={request.id}
        //   book={books[request.book]}
        // />
        <UpdatedRecordingRequestCard

            recordingRequest={request}
            key={request.id}
            book={books[request.book]}

        />
    ));

    return (
        <>
            <h2 className="text-xl my-4">Recording requests</h2>
            <div className="flex flex-col md:flex-row md:gap-4  flex-wrap">
                {recordingRequests.length > 0 ? (
                    requestEntries
                ) : (
                    <EmptyRecordingRequests />
                )}
            </div>
            <div className="my-4">
                <Button disabled={true}>Create a recording request</Button>
            </div>
        </>
    );
}

export default function Recordings({
    books,
    recordingRequests,
    recordings,
    setRecordingRequests,
}: {
    books: { [key: string]: Book };
    recordingRequests: RecordingRequestApi[];
    recordings: RecordingApi[];
    setRecordingRequests: any;
}) {
    // TODO: implement pagination of content.
    const bookEntries = Object.entries(books).map(([bookId, book]) => (
        <BookCard
            key={bookId}
            bookId={bookId}
            book={book}
            recordingRequests={recordingRequests}
            setRecordingRequests={setRecordingRequests}
        />
    ));

    return (
        <div className="mb-4">
            <MainHeader text="Recordings" />
            <p>
                Make your own narrations for books by recording it yourself or asking
                for a recording.
            </p>
            <h2 className="text-xl my-4">Recordable content</h2>
            <div className="flex flex-col md:flex-row md:gap-4  flex-wrap">
                {Object.entries(books).length > 0 ? bookEntries : <EmptyBooks />}
            </div>
            <ErrorBoundary>
                <RecordingRequestsList
                    books={books}
                    recordingRequests={recordingRequests}
                />
            </ErrorBoundary>

            <ErrorBoundary>
                <RecordingsList books={books} recordings={recordings} />
            </ErrorBoundary>
        </div>
    );
}