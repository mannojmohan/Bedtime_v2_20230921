import React, { useEffect, useState } from "react";
import { Book } from "../player/Book";
import ReactPlayer from "react-player";
import { useLoaderData } from "react-router";
import { getBook } from "../../books";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
} from "@mui/material";

// Define the Book type
type BookType = {
  cover: string;
  description: string;
  id: number;
  narrations: { [key: string]: any };
  pages: Array<[string, string]>; // Define the pages type as an array of tuples
  thumbnail: string;
  title: string;
};

export async function loader({ params }: any) {
  const books = await getBook(params.bookId);

  if (!books) {
    throw new Response("", {
      status: 404,
      statusText: "Book Not Found",
    });
  }
  return { books, bookId: params.bookId };
}

export default function PlayerTest() {
  const { books } = useLoaderData() as { books: BookType }; // Use the defined BookType

  const [currentPage, setCurrentPage] = useState<number>(0); // Initialize currentPage to 0

  const pages = books.pages || [];

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!books || Object.keys(books).length === 0) {
    return <div>No books found.</div>;
  }

  return (
    <div>
      <h2>{books.title}</h2>
      <div>
        {pages.map((page, index) => (
          <div key={index} style={{ display: index === currentPage ? "block" : "none" }}>
            <h3>Page {index + 1}</h3>
            <ReactPlayer
              url={page[1]} // URL of the video page
              controls // Show video controls (play, pause, etc.)
              width="100%" // Set the width of the player
            />
          </div>
        ))}
      </div>
      <div>
        <Button onClick={goToPreviousPage} disabled={currentPage === 0}>
          Previous
        </Button>
        <Button onClick={goToNextPage} disabled={currentPage === pages.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
}
