import Home from "./pages/Home";
import Activate from "./pages/Activate";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Messenger from "./pages/Messenger";
import Search from "./components/forms/Search";

// These functions are designed this way to prevent wrong pages
// From appearing briefly on the screen
function RedirectToHome({ children }) {
  const loggedIn = useSelector((state) => state.jwt.loggedIn);
  return loggedIn ? <Navigate to="/home" replace /> : children;
}

function RedirectToLogin({ children }) {
  const loggedIn = useSelector((state) => state.jwt.loggedIn);
  return loggedIn ? children : <Navigate to="/signin" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          element={
            <RedirectToHome>
              <Signin />
            </RedirectToHome>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectToHome>
              <Signup />
            </RedirectToHome>
          }
        />
        <Route
          path="/home"
          element={
            <RedirectToLogin>
              <Home />
            </RedirectToLogin>
          }
        >
          <Route path="search" element={<Search />} />
          <Route path="message/:id" element={<Messenger />} />
        </Route>
        <Route path="/activate/:id" element={<Activate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
