import { Outlet } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import { MyThemeProvider } from "../theme";

import { useLocation } from "react-router-dom";
import MobileMenu from "../components/MobileMenu";

import { StyledEngineProvider } from "@mui/material";

import React, { useContext, useEffect } from "react";
import fullScreenContext, {
  FullScreenContext,
} from "../context/fullScreenContext";

function ScrollToTop(): any {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const queryClient = new QueryClient();

export default function Root() {
  const userEmail = JSON.parse(
    document.getElementById("userEmail")?.textContent
  );

  const location = useLocation()

    const queryParams = new URLSearchParams(location.search);
    const requestParams = queryParams.get("key")

  const [menuVisible, setMenuVisible] = React.useState(false);

  const { isFullScreen }: any = useContext(FullScreenContext);

  return (
    <>
      <ScrollToTop />
      <MyThemeProvider>
        <StyledEngineProvider injectFirst={true} />
        <QueryClientProvider client={queryClient}>
          <div className="flex flex-col h-full">
            {!!requestParams || !isFullScreen && (
              <Header email={userEmail} setMenuVisible={setMenuVisible} />
            )}
            <main className="flex h-full w-full">
              {!!requestParams || !isFullScreen && <Sidebar />}

              <div className="flex flex-col w-full min-h-[100%] h-full">
                <div className="bg-lightest flex w-full h-full text-dark min-h-[100vh]">
                  <Outlet />
                </div>

                <Footer />
              </div>
            </main>
            {!requestParams &&<MobileMenu
              {...{ email: userEmail, menuVisible, setMenuVisible }}
            />}
          </div>
        </QueryClientProvider>
      </MyThemeProvider>
    </>
  );
}
