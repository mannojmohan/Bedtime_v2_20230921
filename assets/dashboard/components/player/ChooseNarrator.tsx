import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
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

function ChooseNarrator({
  book,
  playState,
  setPlayState,
  ...props
}: ControlsProps) {
  const narratorOptions = Object.entries(book.narrations).map(
    ([narrator, _]) => narrator
  );
  const narratorSelectItems = narratorOptions.map((narrator) => (
    <MenuItem key={narrator} value={narrator}>
      {narrator}
    </MenuItem>
  ));
  const handleNarratorChange = (event: SelectChangeEvent) => {
    setPlayState({
      isPlaying: false,
      stopRegion: null,
      nextLocation: null,
    });
    props.setNarrator(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: [100, 160, 160] }}>
      <InputLabel id="demo-simple-select-helper-label" sx={{ top: "-10px" }}>
        Narrator voice
      </InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={props.narrator}
        size="small"
        onChange={handleNarratorChange}
      >
        {narratorSelectItems}
      </Select>
    </FormControl>
  );
}

export default ChooseNarrator;
