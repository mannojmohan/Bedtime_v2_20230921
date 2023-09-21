import React, { useContext, useEffect, useState } from "react";

import { getBook } from "../books";
import { useLoaderData } from "react-router";
import BookPlayer from "../components/player/Player";
import { Book } from "../components/player/Book";
import { NavLink } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import { FullScreenContext } from "../context/fullScreenContext";

export async function loader({ params }: any) {
  const book = await getBook(params.bookId);
  if (!book) {
    throw new Response("", {
      status: 404,
      statusText: "Book Not Found",
    });
  }
  return { book, bookId: params.bookId };
}

export default function BookPlayerPage() {
  const { isFullScreen, toggleFullScreen }: any = useContext(FullScreenContext);
  const { book, bookId } = useLoaderData() as { book: Book; bookId: number };
  useEffect(() => {
    if(!(Object.entries(book.narrations).length < 1))
    {toggleFullScreen()}
  }, []);

  return (
    <div className={` w-full ${isFullScreen ? "flex  " : "tall:py-4 lg:p-8"}`}>
      {!isFullScreen && (
        <div className="px-4 pb-2 lg:p-0">
          <MainHeader
            text={
              <>
                <NavLink className="underline underline-offset-2" to="/books">
                  Books
                </NavLink>{" "}
                / Player
              </>
            }
          ></MainHeader>
        </div>
      )}
      <BookPlayer book={book} />
      {!isFullScreen && (
        <div className="my-4">
          Do you want to have your custom narration? Try a{" "}
          <NavLink
            className="underline underline-offset-2"
            to={`/recorder/${bookId}`}
          >
            recorder
          </NavLink>
          .
        </div>
      )}
    </div>
  );
}
