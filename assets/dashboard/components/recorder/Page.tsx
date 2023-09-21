import * as React from 'react';
import { Book } from '../player/Book';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';


const CoverVideo = styled('div')({
    borderRadius: 8,
    '& > video': {
        width: '100%',
    },
});

type PageProps = {
    book: Book;
    pageIndex: number;
    audio: any;
    recordedPage: number | null;
    startRecording: () => void;
    stopRecording: () => void;
};


export default function Page({
    book,
    pageIndex,
    audio,
    recordedPage,
    startRecording,
    stopRecording,
}: PageProps) {
    console.log(book);
    const bookPages = book.pages[pageIndex][1];
    
    const recording = audio ? (<div className="audio-container  h-[80px] flex items-center gap-2">
        <span>Recorded audio:</span><audio src={audio.blobUrl} controls></audio>
    </div>) : (<p className='flex flex-col justify-center h-[80px]'>No recordings yet. </p>);

    return (
        <div className='p-4 my-8 bg-[#e2ebe7] rounded-md shadow-md min-w-[300px] w-full flex flex-col space-between'>

            <div>
                Pages: {book.pages[pageIndex][0]}
            </div>
            <Box className="tall:mt-2 lg:mt-4  tall:h-full" sx={{ display: 'flex', flexDirection: "column", alignItems: 'center', justifyContent: "center", }}>
                <CoverVideo className='flex max-h-[50vh] flex-col justify-center' sx={{ flex: "1 1 300px", width: "100%" }}>
                    <video style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    >
                    <source src={bookPages} type="video/mp4" />
                    </video>
                </CoverVideo>
            </Box>

            <div className="py-8 w-full h-[150px]">
                <div>
                    <div className="flex flex-col gap-2">
                        {recordedPage === null ? (
                            <Button variant="contained" color="primary"
                                onClick={startRecording}
                            >{!audio ? "Start Recording" : "Redo the recording"}
                            </Button>
                        ) : (recordedPage === pageIndex ? (
                            <>

                                <Button variant="contained" color="primary" onClick={stopRecording} type="button">
                                    Stop Recording
                                </Button>
                                <div className='flex flex-row h-[80px] items-center gap-2'><RadioButtonCheckedIcon sx={{ color: "red" }} /> Recording...</div>
                            </>

                        ) : <p>Already recording a different page...</p>)}
                        {recordedPage !== pageIndex ? recording : null}
                    </div>
                </div>
            </div>
        </div>
    );
}