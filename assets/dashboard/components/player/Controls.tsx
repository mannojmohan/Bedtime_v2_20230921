import * as React from 'react';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import { VolumeOffRounded } from '@mui/icons-material';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


import { Book } from './Book';


type ControlsProps = {
    book: Book;
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    duration: number;
    narrator: string;
    setNarrator: React.Dispatch<React.SetStateAction<string>>;
    playState: {isPlaying: boolean, nextLocation?: number, stopRegion?: number};
    setPlayState: React.Dispatch<React.SetStateAction<{isPlaying: boolean, nextLocation?: number, stopRegion?: number}>>;
};

export default function Controls({ book, playState, setPlayState, ...props }: ControlsProps) {

    const [volume, setVolume] = React.useState(60);
    const [muteVolume, setMuteVolume] = React.useState(false);

    const narratorOptions = Object.entries(book.narrations).map(([narrator, _]) => narrator);
    const narratorSelectItems = narratorOptions.map(narrator => <MenuItem key={narrator} value={narrator}>{narrator}</MenuItem>)
    const handleNarratorChange = (event: SelectChangeEvent) => {
        setPlayState({
            isPlaying: false,
            stopRegion: null,
            nextLocation: null,
        });
        props.setNarrator(event.target.value);
    };

    React.useEffect(() => {
        if (props.audioRef) {
            props.audioRef.current.volume = volume / 100;
        }
    }, [volume, props.audioRef]);

    React.useEffect(() => {
        if (props.audioRef) {
            props.audioRef.current.volume = volume / 100;
            props.audioRef.current.muted = muteVolume;
        }
    }, [volume, props.audioRef, muteVolume]);


    const handleVolumeChange = (event: Event, newValue: number | number[]) => {
        setVolume(newValue as number);
    };

    return (
        <div className='flex flex-row lg:flex-row tall:flex-col gap-2 lg:gap-8 items-center tall:my-4 '>
           
            <Stack spacing={2} direction="row" alignItems="center">

                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-helper-label" sx={{ top: "-10px" }}>Narrator voice</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={props.narrator}
                        size='small'
                        onChange={handleNarratorChange}
                        
                    >
                       {narratorSelectItems}
                    </Select>
                </FormControl>


                <div className="flex flex-row items-center gap-2">
                    <button onClick={() => setMuteVolume((prev) => !prev)}>
                        {muteVolume || volume < 5 ? (
                            <VolumeOffRounded />
                        ) : volume < 40 ? (
                            <VolumeDownRounded />
                        ) : (
                            <VolumeUpRounded />
                        )}
                    </button>

                    <Slider
                        aria-label="Volume"
                        value={volume}
                        onChange={handleVolumeChange}
                        sx={{
                            width: "100px",
                            color: 'rgba(0,0,0,0.87)',
                            '& .MuiSlider-track': {
                                border: 'none',
                            },
                            '& .MuiSlider-thumb': {
                                width: 14,
                                height: 14,
                                '&:before': {
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                                },
                                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                    boxShadow: 'none',
                                },
                            },
                        }}
                    />
                </div>
            </Stack>
        </div>
    );
}
