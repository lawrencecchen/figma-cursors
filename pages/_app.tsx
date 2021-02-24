import { RoomServiceProvider } from "@roomservice/react";
import useUserID from "../hooks/use-user-id";
import Head from "next/head";
import "../styles/globals.css";

async function myAuthFunction(params: {
  room: string;
  ctx: { userID: number };
}) {
  const response = await fetch("/api/roomservice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //  Pass cookies to server
    credentials: "include",
    body: JSON.stringify({
      room: params.room,

      //  TODO: Determine userID on server based on cookies or values passed in here.
      user: params.ctx.userID,
    }),
  });

  if (response.status === 401) {
    throw new Error("Unauthorized!");
  }

  if (response.status !== 200) {
    throw await response.text();
  }

  const body = await response.json();
  return {
    user: body.user,
    resources: body.resources,
    token: body.token,
  };
}

function MyApp({ Component, pageProps }) {
  const userID = useUserID();
  return (
    <>
      <Head>
        <title>Figma Cursors</title>
        <meta name="viewport" content="width=device-width"></meta>
      </Head>
      <RoomServiceProvider
        //  Don't connect until the userID is set
        online={userID !== null}
        clientParameters={{
          auth: myAuthFunction,
          //  Passed into myAuthFunction when RoomService connects. Include
          //  anything you need here to identify the user on the server.
          ctx: {
            userID,
          },
        }}
      >
        <Component {...pageProps} />
      </RoomServiceProvider>
    </>
  );
}

export default MyApp;
