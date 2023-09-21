import React from "react";

import { createHashRouter, RouterProvider } from "react-router-dom";

import Books, { loader as booksLoader } from "./routes/books";
import Recordings, { loader as recordingsLoader } from "./routes/recordings";
import Root from "./routes/root";
import Index from "./routes/index";
import ErrorPage from "./error-page";
import BookPlayerPage, { loader as bookLoader } from "./routes/player";
import RecorderPage, { loader as bookRecorderLoader } from "./routes/recorder";
import Recording, { loader as recordingLoader } from "./routes/recording";
import {FullScreenProvider} from "./context/fullScreenContext";

import PlayerTest, {loader as playerloader} from "./components/player_test/PlayerTest";
import BookTestPlayer, {loader as booktestloader} from "./components/player_test/BooktestPlayer";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "books",
            element: <Books />,
            loader: booksLoader,
          },

          {
            path: "player/:bookId",
            element: <BookPlayerPage />,
            loader: bookLoader,
          },
          {
            path: "recorder/:bookId",
            element: <RecorderPage />,
            loader: bookRecorderLoader,
          },

          {
            path: "recordings",
            element: <Recordings />,
            loader: recordingsLoader,
          },
          {
            path: "recordings/:bookId",
            element: <Recording />,
            loader: recordingLoader,
          },
          {
            path: "/test/:bookId",
            element: <PlayerTest/>,
            loader: playerloader,
          },
        ],
      },
    ],
  },
]);

export default class App extends React.Component {
  render() {
    return (
      <FullScreenProvider>
        <RouterProvider router={router} />
      </FullScreenProvider>
    );
  }
}
