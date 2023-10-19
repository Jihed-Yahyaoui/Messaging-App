import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormText from "../components/forms/formText";
import { Button } from "@mui/material";
import { postData } from "../utils/fetch";
import { useDispatch } from "react-redux";
import { setAccessToken, setRefreshToken } from "../redux/slices/jwtSlice";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function Signin() {
  // Errors originating from DB and server related problems
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  // Form state and other various utilities
  const { register, control, handleSubmit, clearErrors, watch } = useForm({
    defaultValues: {
      id: "",
      password: "",
    },
  });

  // Send form data on Submit and receive tokens
  const onSubmit = async (data) => {
    setLoading(true);
    await postData("user/login", data).then((res) => {
      if (res.reason) return setServerError(res);
      dispatch(setAccessToken(res.access_token));
      dispatch(setRefreshToken(res.refresh_token));
    });
    setLoading(false);
  };

  // Send Google Login info on Submit
  const handleGoogleLogin = async ({ credential }) => {
    const refresh_token = await postData("user/googleUser", { credential });
    dispatch(setAccessToken(credential));
    dispatch(setRefreshToken(refresh_token));
  };

  // Remove errors after input
  useEffect(() => {
    const subscription = watch(() => {
      clearErrors();
      setServerError(null);
    });

    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  return loading ? (
    "Loading ..."
  ) : (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
      <FormText
        name="id"
        control={control}
        register={register}
        serverError={serverError}
        rules={{
          minLength: {
            value: 3,
            message: "This field must contain at least 3 characters.",
          },
          maxLength: {
            value: 24,
            message: "This field must not contain more than 24 characters.",
          },

          required: "This field is required.",
        }}
        label="E-mail"
      />
      <FormText
        name="password"
        control={control}
        register={register}
        isPassword={true}
        serverError={serverError}
        rules={{
          minLength: {
            value: 6,
            message: "This field must contain at least 6 characters.",
          },
          required: "This field is required.",
        }}
        label="Password"
      />
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          handleSubmit(onSubmit)();
        }}
      >
        Sign in
      </Button>
      OR
      <GoogleLogin onSuccess={handleGoogleLogin} theme="filled_blue">
        Sign up with Google
      </GoogleLogin>
    </GoogleOAuthProvider>
  );
}
