import * as React from "react";
import { useRef, useEffect } from "react";
import "../../../../static/css/progress-bar.css";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

import { Book } from "./Book";

const mainIconColor = "#000";

import { STANDARD_COLORS } from "../colors";
import ChooseNarrator from "./ChooseNarrator";
import VolumeManager from "./VolumeManager";
import { FullScreenContext } from "../../context/fullScreenContext";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";

function pageIndexForTimestamp(
  timestamp: number,
  book: Book,
  narrator: string
) {
  if (!(narrator in book.narrations)) {
    console.log("bad page for index");
    return 0;
  }
  const timestamps = book.narrations[narrator].timestamps;

  if (timestamp === 0) {
    return 0;
  }

  for (let i = 0; i < timestamps.length; i += 1) {
    if (timestamp < timestamps[i][1]) {
      if (i === 0) {
        return 0;
      }
      return i - 1;
    }
  }
  return timestamps.length - 1;
}

function formatDuration(value: number) {
  const minute = Math.floor(value / 60);
  const secondLeft = Math.floor(value - minute * 60);
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

export interface ProgressBarProps {
  book: Book;
  narrator: string;
  duration: number;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  
  setPageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  playState: { isPlaying: boolean; nextLocation?: number; stopRegion?: number };
  setPlayState: React.Dispatch<
    React.SetStateAction<{
      isPlaying: boolean;
      nextLocation?: number;
      stopRegion?: number;
    }>
  >;
  setNarrator: any;

  onLoaded: () => void;
  onLoadStart: () => void;
  onEnded: () => void;

  isLoading: boolean;
  stopRegion: number;
  autoplayPages: boolean;
}

export default function ProgressBar({
  book,
  narrator,
  duration,
  audioRef,
  playState,
  setPageIndex,
  setPlayState,
  setNarrator,
  onLoaded,
  onLoadStart,
  onEnded,
  isLoading,
  stopRegion,
  autoplayPages,
  setAutoplayPages, 
  currentTime,
  setCurrentTime,
  videoRef
}: ProgressBarProps) {
  const maxPage = Math.min(
    book.pages.length,
    book.narrations[narrator].timestamps.length
  );
  const { isFullScreen, toggleFullScreen }: any =
    React.useContext(FullScreenContext);
  const [timeProgress, setTimeProgress] = React.useState(0);
  const playAnimationRef = useRef(0);
  const progressBarRef = useRef<HTMLInputElement>();
  // const videoRef = useRef<HTMLVideoElement>();
  console.log(book);

  useEffect(() => {
    
    videoRef.current.muted = true
   
  }, [])
  

  const togglePlayPause = () => {
    const newPlaying = !playState.isPlaying;
  
    // Get references to both audio and video elements
    const audioElement = audioRef.current;
    const videoElement = videoRef.current;

    console.log("VIDEO >>>>>", videoElement)
  
    // If both audio and video elements exist
    if (audioElement && videoElement) {
      if (newPlaying) {
        // If switching to play mode, set the current time for both elements
        if (playState.nextLocation && playState.stopRegion) {
          audioElement.currentTime = playState.nextLocation;
          videoElement.currentTime = playState.nextLocation;
        }
  
        // Play both audio and video
        audioElement.play();
        videoElement.play();
      } else {
        // Pause both audio and video
        audioElement.pause();
        videoElement.pause();
      }
    }
  
    setPlayState({
      isPlaying: newPlaying,
      nextLocation: null,
      stopRegion: null,
    });
  };

  const handleProgressChange = () => {
    audioRef.current.currentTime = Number(progressBarRef.current.value);
    setPlayState((oldState) => {
      return { ...oldState, nextLocation: null, stopRegion: null };
    });
  };

  const handleUpdateProgress = React.useCallback(
    (newTime: number) => {
      if (progressBarRef && progressBarRef.current) {
        setTimeProgress(newTime);
        progressBarRef.current.value = String(newTime);
      }
    },
    [progressBarRef, duration, book, narrator, playState]
  );

  const repeat = React.useCallback(() => {
    if (audioRef && audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      handleUpdateProgress(currentTime);
    }
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [narrator, audioRef]);

  React.useEffect(() => {
    if (audioRef && audioRef.current && !isLoading) {
      if (playState.isPlaying) {
        audioRef.current.play()
          .then(() => { })
          .catch((err) => {
            setPlayState({
              isPlaying: false,
              nextLocation: null,
              stopRegion: null,
            });
            console.log(`Error on audio playing: ${err}`)
          });
      } else {
        audioRef.current.pause();
        if (playState.nextLocation) {
          audioRef.current.currentTime = playState.nextLocation;
        }
      }
    }
    playAnimationRef.current = requestAnimationFrame(repeat);
    return () => {
      cancelAnimationFrame(playAnimationRef.current);
    };
  }, [playState.isPlaying, playState.nextLocation, narrator, isLoading, isFullScreen]);

  React.useEffect(() => {
    const newPageIndex = pageIndexForTimestamp(
      timeProgress + 0.01,
      book,
      narrator
    );
    if (!playState.nextLocation) {
      setPageIndex(newPageIndex);
    }
    if (narrator in book.narrations && playState.isPlaying) {
      const stopTime = book.narrations[narrator].timestamps[newPageIndex][2];
      if (timeProgress + 0.1 >= stopTime) {
        if (newPageIndex < maxPage - 1 && !autoplayPages) {
          stopRegion = newPageIndex + 1;

          let nextLocation =
            book.narrations[narrator].timestamps[stopRegion][1];
          audioRef.current.pause();

          setPlayState((oldState) => {
            return { isPlaying: false, nextLocation, stopRegion };
          });
        }
      }
    }
  }, [timeProgress, playState.isPlaying, playState.nextLocation]);

  React.useEffect(() => {
    if (isFullScreen) {
      setAutoplayPages(true);
    }
  }, []);

  function getOppositeOrientation() {
    return window.screen.orientation?.type.startsWith("portrait")
      ? "landscape"
      : "portrait";
  }

  async function rotate() {
    const newOrientation = getOppositeOrientation();
    if (window.screen.orientation?.type) {
      await window.screen.orientation.lock(newOrientation);
    }
  }

  function detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }

  const handleScreen = async () => {
    setCurrentTime(audioRef.current.currentTime);
    toggleFullScreen();
    if (detectMob()) {
      await rotate();
    }
  };

  return (
    <div>
      <audio
        src={book.narrations[narrator].audio}
        ref={audioRef}
        onLoadedData={() => {
          if(currentTime>0) audioRef.current.currentTime = currentTime;
          const seconds = audioRef.current.duration;
          progressBarRef.current.max = String(seconds);
          onLoaded();
        }}
        onLoadStart={onLoadStart}
        onEnded={onEnded}
        onError={(e) => alert("error with audio" + e)}
      />

      <div
        className="player-progress-bar flex flex-row gap-2 items-center"
        style={{ height: "40px", display: "flex", width: "100%" }}
      >
        <span className="time current">{formatDuration(timeProgress)}</span>
        <input
          style={{
            width: "100%",
          }}
          step={0.001}
          type="range"
          ref={progressBarRef}
          defaultValue="0"
          onChange={handleProgressChange}
        />
        <span className="time">{formatDuration(duration)}</span>
      </div>
      <Box
        sx={{
          display: ["flex", "flex", "none"],
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <IconButton
          sx={{
            border: "8px " + STANDARD_COLORS["primary"] + " solid",
            "&:hover": { background: "hsl(184deg 14% 68% / 40%)" },
          }}
          aria-label={!playState.isPlaying ? "play" : "pause"}
          onClick={() => togglePlayPause()}
        >
          {!playState.isPlaying ? (
            <PlayArrowRounded
              sx={{ fontSize: "2rem" }}
              htmlColor={mainIconColor}
            />
          ) : (
            <PauseRounded sx={{ fontSize: "2rem" }} htmlColor={mainIconColor} />
          )}
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: ["space-between", "flex-start", "center"],
          gap: ["0px", "20px", "50px", "100px"],
        }}
      >
        <ChooseNarrator
          {...{
            book,
            audioRef,
            duration,
            narrator,
            setNarrator,
            playState,
            setPlayState,
            autoplayPages,
          }}
        />

        <Box
          sx={{
            display: ["none", "none", "flex"],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            sx={{
              border: "8px " + STANDARD_COLORS["primary"] + " solid",
              "&:hover": { background: "hsl(184deg 14% 68% / 40%)" },
            }}
            aria-label={!playState.isPlaying ? "play" : "pause"}
            onClick={() => togglePlayPause()}
          >
            {!playState.isPlaying ? (
              <PlayArrowRounded
                sx={{ fontSize: "2rem" }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded
                sx={{ fontSize: "2rem" }}
                htmlColor={mainIconColor}
              />
            )}
          </IconButton>
        </Box>
        {isFullScreen && (
          <FormControlLabel
            control={
              <Checkbox
                checked={autoplayPages}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAutoplayPages(event.target.checked);
                }}
                inputProps={{ "aria-label": "autoplay" }}
                sx={{ "& .MuiSvgIcon-root": { fontSize: [10, 12, 15] } }}
              />
            }
            sx={{ fontSize: [10, 12, 15] }}
            label={
              <Typography sx={{ fontSize: [10, 12, 15] }}>Autoplay</Typography>
            }
          />
        )}
        <VolumeManager
          {...{
            book,
            audioRef,
            duration,
            narrator,
            setNarrator,
            playState,
            setPlayState,
            autoplayPages,
          }}
        />
        <IconButton
          sx={{ display: ["block", "block", "block"] }}
          onClick={handleScreen}
        >
          <FullscreenIcon />
        </IconButton>
      </Box>
    </div>
  );
}
