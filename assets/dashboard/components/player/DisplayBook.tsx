import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Book } from "./Book";
import { FullScreenContext } from "../../context/fullScreenContext";

const CoverImage = styled("div")({
  borderRadius: 8,
  "& > img": {
    width: "100%",
  },
});


const CoverVideo = styled("div")({
  borderRadius: 8,
  "& > video": {
    width: "100%",
  },
});


type DisplayBookProps = {
  book: Book;
  pageIndex: number;
};

export default function DisplayBook({ book, pageIndex,videoRef }: DisplayBookProps) {
  const bookPages = book.pages[pageIndex][1];
  console.log(bookPages);

  return (
    <div
      className={`display-book flex-col flex-auto grow-4 justify-center items-center`}
      // style={{ minHeight: "200px" }}
    >
      <Box sx={{ ml: 0, minWidth: 0, display: "flex", flexDirection: "row" }}>
        <Typography noWrap>
          <b>{book.title}</b>
        </Typography>
      </Box>

      <Box
        className={`${"tall:mt-2 lg:mt-4"} `}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <CoverImage
          className={`flex ${"max-h-[80vh] "}flex-col justify-center }  `}
          sx={{ flex: "1 1 300px", width: "100%" }}
        >
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            alt="Book Pages 1"
            src={bookPages}
          />
        </CoverImage> */}

        <CoverVideo
          className={`flex ${"max-h-[80vh] "}flex-col justify-center }  `}
          sx={{ flex: "1 1 300px", width: "100%" }}
        >
          <video
          ref={videoRef}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            // autoPlay
            // controls
          >
            <source src={bookPages} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </CoverVideo>

      </Box>
    </div>
  );
}
