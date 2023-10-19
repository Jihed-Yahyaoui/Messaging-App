import { useDispatch, useSelector } from "react-redux";
import { resetTokens, setAccessToken } from "../redux/slices/jwtSlice";
import { useEffect, useState } from "react";
import { getData } from "../utils/fetch";
import { socket } from "../utils/socket";
import { resetUser, setUser } from "../redux/slices/userSlice";
import { Outlet } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const tokens = useSelector((state) => {
    return {
      access_token: state.jwt.access_token,
      refresh_token: state.jwt.refresh_token,
    };
  });

  const userId = useSelector((state) => state.user.id);

  // Verify tokens
  // And get user info
  useEffect(() => {
    getData("user/home", tokens).then((res) => {
      // if tokens are invalid, delete and return to login screen
      if (res.message) {
        dispatch(resetTokens());
        dispatch(resetUser());
        return;
      }

      // Otherwise receive possibly new access token
      // And user info
      if (res.access_token !== tokens.access_token)
        dispatch(setAccessToken(res.access_token));
      dispatch(setUser(res.user));
      setLoading(false);

      /* // Request notification permisson and add message notifications
      Notification.requestPermission().then((permission) => {
        if (permission === "granted")
          socket.on(
            "message",
            ({ text }) =>
              new Notification("You have received a message", { body: text })
          );
      }); */
    });
  }, []);

  // Connect to socketIO and send ID
  useEffect(() => {
    socket.connect();
    socket.emit("connected", userId);

    return () => {
      socket.disconnect();
    };
  });

  return loading ? (
    "Loading..."
  ) : (
    <>
      hi
      <Outlet />
    </>
  );
}
