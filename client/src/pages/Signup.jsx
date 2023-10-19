import { useForm } from "react-hook-form";
import FormText from "../components/forms/formText";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { postData } from "../utils/fetch";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { setAccessToken, setRefreshToken } from "../redux/slices/jwtSlice";

export default function Signup() {
  // Errors originating from DB and server related problems
  // e.g.: duplicate username/email, invalid email, internal server errors
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  // JSON Web Tokens
  const tokens = useSelector((state) => state.jwt);
  const dispatch = useDispatch();
  // Form state and other various utilities
  const { register, control, handleSubmit, getValues, clearErrors, watch } =
    useForm({
      defaultValues: {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });

  // Remove errors after input
  useEffect(() => {
    const subscription = watch(() => {
      clearErrors();
      setServerError(null);
    });

    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  // Send form data on Submit
  const onSubmit = async (data) => {
    setLoading(true);
    await postData("user/create", data, tokens).then((res) =>
      setServerError(res.reason ? res : null)
    );
    setLoading(false);
  };

  // Send Google Login info on Submit
  const handleGoogleLogin = async ({ credential }) => {
    const refresh_token = await postData("user/googleUser", { credential });
    dispatch(setAccessToken(credential));
    dispatch(setRefreshToken(refresh_token));
  };

  if (loading) return "Loading...";

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_ID}>
      <FormText
        name="firstname"
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

          // Accepts at most three words each at least 3 letters long
          // and seperated by at most 2 spaces
          pattern: {
            value: /^([a-zA-Z]{3,}\s{0,2}){0,2}[a-zA-Z]{3,}$/,
            message: "This field is not valid.",
          },
          required: "This field is required.",
        }}
        label="First Name"
      />
      <FormText
        name="lastname"
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

          // Accepts at most three words each at least 3 letters long
          // and seperated by at most 2 spaces
          pattern: {
            value: /^([a-zA-Z]{3,}\s{0,2}){0,2}[a-zA-Z]{3,}$/,
            message: "This field is not valid.",
          },
          required: "This field is required.",
        }}
        label="Last Name"
      />
      <FormText
        name="email"
        control={control}
        register={register}
        serverError={serverError}
        rules={{
          minLength: {
            value: 6,
            message: "This field must contain at least 6 characters.",
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
      <FormText
        name="confirmPassword"
        control={control}
        register={register}
        isPassword={true}
        serverError={serverError}
        rules={{
          validate: (value) =>
            value === getValues("password") || "These passwords do not match.",
          required: "This field is required.",
        }}
        label="Confirm Password"
      />
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          handleSubmit(onSubmit)();
        }}
      >
        Sign up
      </Button>
      OR
      <GoogleLogin onSuccess={handleGoogleLogin} theme="filled_blue">
        Sign up with Google
      </GoogleLogin>
    </GoogleOAuthProvider>
  );
}
