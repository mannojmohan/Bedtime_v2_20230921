import React, { useContext, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FullScreenContext } from "../../context/fullScreenContext";
import { useLoaderData } from "react-router";
import { Book } from "../../components/player/Book";
import { getBook, getBooks } from "../../books";


export async function loader({}) {
  const books = await getBooks();
  console.log("Test Books ==> ", books);
  return { books };
}

export default function BookTestPlayer() {
  const { books } = useLoaderData() as { books: { [key: string]: Book } };
  console.log(books);

  return (
    <div>
      <h1>Hello, Book Player!</h1>
    </div>
  );
}
