import {
    createBrowserRouter,
} from "react-router";
import Login from "../features/auth/pages/Login";
import SignUp from "../features/auth/pages/SignUp";
import Code from "../pages/Code";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        path: "/code",
        element: <Code />
    }
]);
