import React, { useContext, useEffect, useRef, useState } from "react";
import { Book } from "./Book";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ProgressBar, { ProgressBarProps } from "./ProgressBar";
import { PageIndicatorProps } from "./PageIndicator";
import { FullScreenContext } from "../../context/fullScreenContext";
import { debounce } from "@mui/material";

type Props = {
  book: Book;
  pageIndex: number;
};

type FullScreenProps = Props & ProgressBarProps & PageIndicatorProps;

const FullScreenPlayer = ({
  book,
  narrator,
  duration,
  audioRef,
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
  currentTime, setCurrentTime
}: FullScreenProps) => {
  const [showTools, setShowTools] = useState(false);
  const { isFullScreen, toggleFullScreen }: any = useContext(FullScreenContext);
  const bookPages = book.pages[pageIndex][1];

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [showTools]);

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      toggleFullScreen()
    });
    return () => {
      window.removeEventListener('popstate',() => {})
    }
  },[])

  // needs to be change logic
  // useEffect(() => {
  //   if (showTools) {
  //     setTimeout(() => {
  //       setShowTools(false)
  //     },3000)
  //   }
  // }, [showTools]);

  const handleOutsideClick = (e: any) => {
    const target = e.target as Element;
    if (
      e.target.classList.contains("fs-container") ||
      e.target.localName === "img"
    ) {
      setShowTools(!showTools);
    }
  };

  return (
    <div className="fs-container py-[30%] sm:py-[0%] sm:px-[15%] w-full flex items-center relative h-full">
      <div
        className=" hidden md:block absolute left-12"
        onClick={handlePreviousPage}
      >
        <ArrowCircleLeftIcon
          sx={{
            fontSize: 60,
          }}
        />
      </div>
      {showPrevious && (
        <div
          className=" md:hidden w-[15%] absolute h-full left-0 opacity-0"
          onClick={handlePreviousPage}
        ></div>
      )}
      <img src={bookPages} alt="Book Pages" className="h-[60%] w-full" />
      <div
        className=" hidden md:block absolute right-12"
        onClick={handleNextPage}
      >
        <ArrowCircleRightIcon
          sx={{
            fontSize: 60,
          }}
        />
      </div>
      {showNext && (
        <div
          className=" md:hidden w-[15%] absolute h-full right-0 opacity-0"
          onClick={handleNextPage}
        ></div>
      )}
      <div
        className={`progress-baar absolute bg-white w-[100%] md:mb-3 bottom-0 left-0 p-2 border-2 shadow rounded transition-all duration-500 ${showTools ? "block" : "hidden"
          }`}
      >
        <ProgressBar
          {...{
            book,
            narrator,
            duration,
            audioRef,
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
            setAutoplayPages,
            currentTime, setCurrentTime
          }}
        />
      </div>
    </div>
  );
};

export default FullScreenPlayer;