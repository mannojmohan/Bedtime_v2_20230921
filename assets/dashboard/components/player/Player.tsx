import * as React from "react";
import { useRef } from "react";
import { styled } from "@mui/material/styles";

import ProgressBar from "./ProgressBar";
import DisplayBook from "./DisplayBook";
import PageIndicator from "./PageIndicator";

import { Book } from "./Book";
import { FullScreenContext } from "../../context/fullScreenContext";
import { useLocation } from "react-router";
import FullScreenPlayer from "./FullScreenPlayer";

const WallPaper = styled("div")({
  overflow: "hidden",
  background: "linear-gradient(rgb(91 217 164) 0%, rgb(126 118 112) 100%)",
  transition: "all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s",
});

const Widget = styled("div")(({ theme }) => ({
  //   minWidth: "300px",
  maxWidth: "100%",
  margin: "auto",
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)",
  backdropFilter: "blur(40px)",
}));

export default function BookPlayer({ book }: { book: Book }) {
  const search = useLocation().search;
  const name = new URLSearchParams(search).get("name");
  if (Object.entries(book.narrations).length < 1) {
    return (
      <div>
        Looks like we do not have any recordings associated with your book. Be
        the first to record your voice and enjoy the book!
      </div>
    );
  }
  const defaultNarrator = Object.entries(book.narrations)[0][0];
  const [narrator, setNarrator] = React.useState(
    Object.keys(book.narrations).includes(name) ? name : defaultNarrator
  );
  return (
    <BookPlayerInner
      book={book}
      narrator={narrator}
      setNarrator={setNarrator}
    />
  );
}

export function BookPlayerInner({
  book,
  narrator,
  setNarrator,
}: {
  book: Book;
  narrator: string;
  setNarrator: any;
}) {
  const maxPage = Math.min(
    book.pages.length,
    book.narrations[narrator].timestamps.length
  );

  const audioRef = useRef<HTMLAudioElement>();
  const videoRef = useRef<HTMLVideoElement>();

  console.log(audioRef, "audioRef1");
  console.log(videoRef, "videoRef1");

  const [duration, setDuration] = React.useState(1000);

  const defaultPlayState: {
    isPlaying: boolean;
    stopRegion?: number;
    nextLocation?: number;
  } = {
    isPlaying: true,
    stopRegion: null,
    nextLocation: null,
  };

  const [audioPlayState, setAudioPlayState] = React.useState(defaultPlayState);
  const [videoPlayState, setVideoPlayState] = React.useState(defaultPlayState);
  const [playState, setPlayState] = React.useState(defaultPlayState);
  const [pageIndex, setPageIndex] = React.useState(0);
  let [autoplayPages, setAutoplayPages] = React.useState(false);
  let [isLoading, setIsLoading] = React.useState(true);
  const [currTime, setCurrTime] = React.useState(0);
  const { isFullScreen }: any = React.useContext(FullScreenContext);
  const [currentTime, setCurrentTime] = React.useState(0);

  let [stopRegion, setStopRegion] = React.useState(null);
  // console.log(playState, "playState");

  const [isAudioPlaying, setIsAudioPlaying] = React.useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(true);

  

  React.useEffect(() => {
    setPlayState({
      isPlaying: false,
      stopRegion: null,
      nextLocation: null,
    });
  }, [book, narrator]);

  React.useEffect(() => {
    if (isFullScreen) {
      setPlayState({
        isPlaying: true,
        stopRegion: null,
        nextLocation: null,
      });
    }
  }, [isFullScreen]);

  const handleNextPage = () => {
    const newPageIndex = pageIndex < maxPage - 1 ? pageIndex + 1 : pageIndex;
    setPageIndex(newPageIndex);
    setPlayState({
      isPlaying: true,
      nextLocation: null,
      stopRegion: null,
    });
    if (narrator in book.narrations) {
      const newTime =
        book.narrations[narrator].timestamps[newPageIndex][1] + 0.01;
      if (audioRef && audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    }
  };

  const handlePreviousPage = () => {
    const newPageIndex = pageIndex > 0 ? pageIndex - 1 : pageIndex;
    setPageIndex(newPageIndex);
    setPlayState({
      isPlaying: true,
      nextLocation: null,
      stopRegion: null,
    });
    if (narrator in book.narrations) {
      const newTime =
        book.narrations[narrator].timestamps[newPageIndex][1] + 0.01;
      if (audioRef && audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    }
  };

  const onLoaded = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
    setIsLoading(false);
  };

  const onEnded = () => {
    setPlayState({
      isPlaying: false,
      nextLocation: null,
      stopRegion: null,
    });
  };

  const onLoadStart = () => {
    setIsLoading(true);
  };

  const currentPages = book.pages[pageIndex][0];
  const showPrevious = pageIndex > 0;
  const showNext = pageIndex < maxPage - 1;

  if (isFullScreen) {
    return (
      <FullScreenPlayer
        {...{
          book,
          narrator,
          duration,
          audioRef,
          setStopRegion,
          pageIndex,
          setPageIndex,
          setPlayState,
          setNarrator,
          onLoaded,
          onLoadStart,
          onEnded,
          playState,
          isLoading,
          stopRegion,
          autoplayPages,
          showPrevious,
          showNext,
          handleNextPage,
          handlePreviousPage,
          setAutoplayPages,
          currentPages,
          currentTime, 
          setCurrentTime,
        }}
      />
    );
  }

  return (
    <WallPaper
      sx={{
        width: "100%",
        // maxWidth: "fit-content",
      }}
      className="flex flex-col shadow-lg  "
    >
      <Widget
        className={`tall:p-4 p-2 justify-between main-widget flex flex-col   h-full`}
      >
        <DisplayBook {...{ book, pageIndex }} />
        <div>
          <PageIndicator
            {...{
              handleNextPage,
              handlePreviousPage,
              currentPages,
              autoplayPages,
              setAutoplayPages,
              showPrevious,
              showNext,
            }}
          />
          <ProgressBar
            {...{
              book,
              narrator,
              duration,
              audioRef,
              setStopRegion,
              setPageIndex,
              setPlayState,
              setNarrator,
              onLoaded,
              onLoadStart,
              onEnded,
              playState,
              isLoading,
              stopRegion,
              autoplayPages,
              currentTime,
              setCurrentTime,
            }}
          />
        </div>
      </Widget>
    </WallPaper>
  );
}
