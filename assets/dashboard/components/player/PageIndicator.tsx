import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import { Checkbox, FormControlLabel } from "@mui/material";
import Typography from "@mui/material/Typography";

export interface PageIndicatorProps {
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  autoplayPages: boolean;
  showPrevious: boolean;
  showNext: boolean;
  setAutoplayPages: React.Dispatch<React.SetStateAction<boolean>>;
  currentPages: string;
}

export default function PageIndicator({
  handleNextPage,
  handlePreviousPage,
  autoplayPages,
  setAutoplayPages,
  currentPages,
  showPrevious,
  showNext,
}: PageIndicatorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoplayPages(event.target.checked);
  };

  return (
    <div
      //   style={{
      //     gap: "8px",
      //     alignItems: "center",
      //     justifyContent: "space-between",
      //   }}
      className="flex my-2 xl:my-4 flex-row items-center justify-between gap-2"
    >
      <Button
        sx={{
          visibility: !showPrevious ? "hidden" : "unset",
          fontSize: ["10px", "12px", "15px"],
        }}
        onClick={handlePreviousPage}
      >
        <FastRewindRounded />
        Previous Page{" "}
      </Button>
      <Box className="flex flex-row items-center gap-1 sm:gap-4">
        <Typography noWrap sx={{ fontSize: [10, 12, 15] }} fontWeight={500}>
          PAGES {currentPages}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={autoplayPages}
              onChange={handleChange}
              inputProps={{ "aria-label": "autoplay pages" }}
              sx={{ "& .MuiSvgIcon-root": { fontSize: [10, 12, 15] } }}
            />
          }
          sx={{ fontSize: [10, 12, 15] }}
          label={
            <Typography sx={{ fontSize: [10, 12, 15] }}>
              Autoplay pages
            </Typography>
          }
        />
      </Box>
      <Button
        variant="contained"
        sx={{
          visibility: !showNext ? "hidden" : "unset",
          fontSize: ["10px", "12px", "15px"],
        }}
        onClick={handleNextPage}
      >
        {" "}
        Next Page
        <FastForwardRounded />
      </Button>
    </div>
  );
}
