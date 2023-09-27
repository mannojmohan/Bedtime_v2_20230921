import * as React from 'react';
import { Book } from '../player/Book';

import { useState, useRef } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Button from '@mui/material/Button';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import { audioBufferToWav } from '../../audio/utils';
import Page from './Page';
import RecordingMessage from './RecordingMessage';
import RecordingResults from './RecordingResults';
import { Timestamp, Recording, RecordingWithABlob } from './types';
import { APIClient, BASE_URL } from '../../api';
const mimeType = "audio/mp3"


export default function Recorder({ book, setRecording, requestParams, requestName }: { book: Book, setRecording: (r: Recording) => void, requestParams: string, requestName: string }) {
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [recordingName, setRecordingName] = useState(requestName ? requestName : '');

    const [recordingMessage, setRecordingMessage]: [React.ReactNode | string, any] = useState("");
    const [recordingMessageVisible, setRecordingMessageVisible] = useState(false);


    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [recordingNameVisible, setRecordingNameVisible] = useState(false)

    // book = Object.assign({}, book);
    // book.pages = book.pages.slice(0, 2);

    let defaultAudios = new Array(book.pages.length);
    const [audios, setAudios] = useState(defaultAudios);
    const [audio, setAudio]: [RecordingWithABlob | null, any] = useState(null);

    const [uploadingMessage, setUploadingMessage] = useState("");

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);

                console.log("Permission  1 >>>>", streamData)
            } catch (err) {
                alert(err.message);
                console.log("Permission err  1>>>>", err)
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecording = async (pageIndex: number) => {
        setAudio(null);
        setUploadingMessage("");
        setRecording(null);
        setRecordingStatus(pageIndex);
        const media = new MediaRecorder(stream);
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localAudioChunks: any[] = [];
        mediaRecorder.current.ondataavailable = (event: { data: any }) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };

        setAudioChunks(localAudioChunks);

        let counter = 1 * 1;
        let message = <div><p>Starting recording in {counter / 10}s... </p></div>;
        setRecordingMessage(message);
        setRecordingMessageVisible(true);

        const countAndStop = (counter: number) => {
            if (counter == 0) {
                setRecordingMessageVisible(false);
                setRecordingMessage("");
            } else {
                message = <div><p>Starting recording in {counter / 10}s... </p></div>;
                setRecordingMessage(message);
                setRecordingMessageVisible(true);
                setTimeout(() => countAndStop(counter - 1), 100)
            }
        }

        setTimeout(() => {
            countAndStop(counter - 1);
        }, 100);
    };

    const stopRecording = (pageIndex: number) => {

        const actuallyStop = () => {
            setRecordingStatus(null);
            mediaRecorder.current.stop();
            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudios((oldAudios) => { oldAudios[pageIndex] = { blobUrl: audioUrl, blob: audioBlob }; return oldAudios });
                setAudioChunks([]);
            };
            setRecordingMessageVisible(false);
            setRecordingMessage("");
        }

        let counter = 2 * 1;
        setRecordingMessage(`Stopping recording in ${counter / 10}s...`);
        setRecordingMessageVisible(true);

        const countAndStop = (counter: number) => {
            if (counter == 0) {
                actuallyStop()
            } else {
                setRecordingMessage(`Stopping recording in ${counter / 10}s...`)
                setRecordingMessageVisible(true);
                setTimeout(() => countAndStop(counter - 1), 100)
            }
        }

        setTimeout(() => {
            countAndStop(counter - 1);
        }, 100)
    };

    const uploadRecording = async () => {
        const apiClient = new APIClient(BASE_URL);
        setUploadingMessage("Uploading...");

        const result = await apiClient.createRecording(audio.timestamps, audio.blob, book.id, recordingName, requestParams);
        if (result.ok) {
            setUploadingMessage("Successfully uploaded the recording.")
        } else {
            if (result.errors.result.message === "Recording with this name already exist for this book!") {
                setUploadingMessage(result.errors.result.message)
            } else {
                setUploadingMessage("Uploading failed, please retry.")
            }
        }
    }

    const pages = book.pages.map(((_, pageIndex) => <Page
        book={book}
        key={pageIndex}
        pageIndex={pageIndex}
        audio={audios[pageIndex]}
        startRecording={() => startRecording(pageIndex)}
        stopRecording={() => stopRecording(pageIndex)}
        recordedPage={recordingStatus}
    />

    ));

    let missingPages = false;
    for (let audio of audios) {
        if (!audio) {
            missingPages = true;
        }
    }

    const handleCombineRecordings = async () => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();

        let promises = [];

        let allBlobs = [];
        for (let [i, audioInfo] of Object.entries(audios)) {
            allBlobs.push(audioInfo.blob);
            const arrayBuffer = await audioInfo.blob.arrayBuffer();
            promises.push(new Promise<[number, AudioBuffer | null]>(function (resolve, reject) {

                audioContext.decodeAudioData(arrayBuffer, (buffer: AudioBuffer) => {
                    resolve([Number(i), buffer])
                }, () => {
                    reject([Number(i), null]);
                });

            }));
        }

        function appendBuffer(buffer1: AudioBuffer, buffer2: AudioBuffer) {
            var numberOfChannels = Math.min(buffer1.numberOfChannels, buffer2.numberOfChannels);
            var tmp = audioContext.createBuffer(numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate);
            for (var i = 0; i < numberOfChannels; i++) {
                var channel = tmp.getChannelData(i);
                channel.set(buffer1.getChannelData(i), 0);
                channel.set(buffer2.getChannelData(i), buffer1.length);
            }
            return tmp;
        }

        const results: Array<[number, AudioBuffer | null]> = await Promise.all(promises);
        results.sort((a: [number, AudioBuffer | null], b: [number, AudioBuffer | null]) => a[0] - b[0]);

        let buffer;
        let i = 0;

        let timestamps: Array<Timestamp> = [];
        let currentTime = 0;

        // Trim the actual recording timestamps to incorporate pauses.
        let timeToStart = 0.8;
        let timeBeforeEnd = 0.5;
        for (let result of results) {
            const
                fragmentBuffer = result[1];
            const pageLabel = book.pages[i][0];
            timestamps.push([pageLabel, currentTime + timeToStart, currentTime + fragmentBuffer.duration - timeBeforeEnd]);
            currentTime += fragmentBuffer.duration;

            if (i === 0) {
                buffer = fragmentBuffer;
            } else {
                buffer = appendBuffer(buffer, fragmentBuffer);
            }
            i += 1;
        }

        let wavBuffer = audioBufferToWav(buffer, {});
        let megablob = new Blob([wavBuffer], { type: mimeType })
        const audioUrl = URL.createObjectURL(megablob);

        const recording: RecordingWithABlob = { blobUrl: audioUrl, timestamps: timestamps, blob: megablob };
        setAudio(recording);
        setRecording(recording);
        setRecordingNameVisible(true)

    }


    return <div className='max-w-[1400px] mt-4 flex flex-col gap-4'>
        <div className='flex mx-4 lg:mx-0 flex-col gap-2'>
            <RecordingMessage content={recordingMessage} visible={recordingMessageVisible} />
            <p>This is a recorder for illustrated books.</p>
            <p>You are currently recording <span className='font-bold'>{book.title}</span>.</p>

            <h2 className='text-xl my-4'>Recording instructions</h2>
            <p>You will do {book.pages.length} recordings, separate for each displayed page or pair of pages.</p>
            <p>After you record a fragment, you will be able to replay it to see if it was good and rerecord it if necessary.</p>
            <p>Don't worry about the clicking, other mouse sounds, or some amount of background noise, they will be fixed in post processing. You can always go back and rerecord any of the pages.</p>
            <p>When you complete all fragments, you will be able to play the whole book in the player and upload the recording.</p>

            <h2 className='text-xl my-4'>What happens after you upload the recording?</h2>
            <p>Our engineering team will turn your recording into your personalized, engaging narration ✨ by removing noise and using our best practices to improve the quality.</p>
            <h2 className='text-xl my-4'>Let's get started!</h2>
            <p>To start recordings let's first make sure that your microphone is all set up.</p>
            <div className='h-[100px] flex flex-col justify-center items-start'>
                {!permission ? (
                    <Button onClick={getMicrophonePermission} >
                        <SettingsVoiceIcon /> Set Up Microphone
                    </Button>
                ) : <div className='px-4 py-2 flex gap-1 items-center border border-1 border-green-500'><CheckCircleOutlineIcon /> Microphone ready!</div>}
            </div>
            {!requestParams && <div className="flex">
                <label className="text-sm border border-2 rounded-lg px-2 py-2 bg-gray-300 whitespace-no-wrap mr-2 w-[100px]">Recording Name</label>
                <input name="field_name" className="border border-2 rounded-lg px-4 py-2 w-[30vw]" value={recordingName} type="text" placeholder="Write Your Name here..." onChange={((e) => setRecordingName(e.target.value))} disabled={recordingNameVisible} />
            </div>}



        </div>
        {permission ? pages : null}
        {permission ? ((missingPages || recordingStatus) ?
            <div className='my-4'>You still have pages to record before finishing the book.</div>
            : <RecordingResults {...{ handleCombineRecordings, audio, uploadRecording, book, uploadingMessage, recordingName, requestParams }} />) : null}
    </div>
}