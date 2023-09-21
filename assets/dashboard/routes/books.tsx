import React, { useEffect, useState } from "react";
import { Book } from "../components/player/Book";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import IconButton from "@mui/material/IconButton";
const mainIconColor = "#000";
import { STANDARD_COLORS } from "../components/colors";
import MainHeader from "../components/MainHeader";
import { getBook, getBooks } from "../books";
import { useLoaderData } from "react-router";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
export async function loader({}) {
  const books = await getBooks();
  console.log("Books ==> ", books);
  return { books };
}
function BookCard({ bookId, book }: { bookId: number; book: Book }) {
  const [narratorSelectItems, setNarratorSelectItems] = useState(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  useEffect(() => { 
    const getNarrations = async (bookId: number) => {
      const { narrations } = await getBook(bookId);
      const narratorOptions = Object.entries(narrations).map(
        ([narrator, _]) => narrator
      );
      setNarratorSelectItems(
        narratorOptions.map((narrator) => (
          <MenuItem key={narrator} value={narrator}>
            {narrator}
          </MenuItem>
        ))
      );
      if (narratorOptions.length > 0) {
        setSelectedName(narratorOptions[0]);
      }
    };
    getNarrations(bookId);
  }, [bookId]);
  const handleClickValue = (event: SelectChangeEvent) => {
    setSelectedName(event.target.value as string);
  };
  return (
    <Card
      sx={{
        maxWidth: 345,
        my: 2,
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <div> */}
      <CardMedia
        sx={{ height: 160 }}
        image={book.cover}
        title="book cover"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {book.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            height: { md: "50px", sm: "auto", xs: "auto" },
            overflow: "hidden",
          }}
        >
          {book.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent:
            narratorSelectItems && narratorSelectItems.length > 0
              ? "space-between"
              : "flex-end",
          alignItems: "start",
        }}
      >
        {narratorSelectItems && narratorSelectItems.length > 0 && (
          <FormControl sx={{ m: 1, minWidth: 160 }}>
            <InputLabel
              id="demo-simple-select-helper-label"
              sx={{ top: "-10px" }}
            >
              Narrator voice
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              size="small"
              value={selectedName}
              onChange={handleClickValue}
            >
              {narratorSelectItems}
            </Select>
          </FormControl>
        )}
        <IconButton
          href={`#/player/${bookId}?name=${selectedName}`}
          sx={{
            border: "8px " + STANDARD_COLORS["primary"] + " solid",
            "&:hover": { background: "hsl(184deg 14% 68% / 40%)" },
          }}
          aria-label="Play"
        >
          <PlayArrowRounded
            sx={{ fontSize: "2rem" }}
            htmlColor={mainIconColor}
          />
        </IconButton>
      </CardActions>
      {/* </div> */}
    </Card>
  );
}
export default function Books() {
  const { books } = useLoaderData() as { books: { [key: string]: Book } };
  const bookEntries = Object.entries(books).map(([bookId, book]) => (
    <BookCard key={bookId} bookId={bookId} book={book} />
  ));
  return (
    <div className="tall:py-4 p-4 lg:p-8">
      <MainHeader text="Books" />
      <div className="flex flex-col md:flex-row md:gap-4 flex-wrap">
        {bookEntries}
      </div>
    </div>
  );
}
