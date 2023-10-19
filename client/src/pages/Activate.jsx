import { useEffect, useState } from "react";
import { getData } from "../utils/fetch";
import { useDispatch } from "react-redux";
import { setAccessToken, setRefreshToken } from "../redux/slices/jwtSlice";

export default function Activate() {
  const [response, setResponse] = useState("");

  // copy the secret funny text in the activation link
  const funnyText = window.location.pathname.split("/")[2];

  // JSON Web Tokens
  const dispatch = useDispatch()

  useEffect(() => {
    getData("user/activate/" + funnyText).then((res) => {
      if (res.message)
        return setResponse(res.message)
      dispatch(setAccessToken(res.access_token))
      dispatch(setRefreshToken(res.refresh_token))
    });
  }, [dispatch, funnyText]);
  

  return (
    <>
      {response}
    </>
  );
}
