import {
  VolumeDownRounded,
  VolumeOffRounded,
  VolumeUpRounded,
} from "@mui/icons-material";
import { Slider } from "@mui/material";
import React from "react";
import { Book } from "./Book";

type ControlsProps = {
  book: Book;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  duration: number;
  narrator: string;
  setNarrator: React.Dispatch<React.SetStateAction<string>>;
  playState: { isPlaying: boolean; nextLocation?: number; stopRegion?: number };
  setPlayState: React.Dispatch<
    React.SetStateAction<{
      isPlaying: boolean;
      nextLocation?: number;
      stopRegion?: number;
    }>
  >;
};

function VolumeManager({
  book,
  playState,
  setPlayState,
  ...props
}: ControlsProps) {
  const [volume, setVolume] = React.useState(60);
  const [muteVolume, setMuteVolume] = React.useState(false);
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
          width: ["60px", "90px", "100px"],
          color: "rgba(0,0,0,0.87)",
          "& .MuiSlider-track": {
            border: "none",
          },
          "& .MuiSlider-thumb": {
            width: 14,
            height: 14,
            "&:before": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
            },
            "&:hover, &.Mui-focusVisible, &.Mui-active": {
              boxShadow: "none",
            },
          },
        }}
      />
    </div>
  );
}

export default VolumeManager;
