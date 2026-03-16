// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { UserProfile } from "./pages/UserProfile";
import { Search } from "./pages/Search";
import { Login } from "./pages/Login";
import { ChooseAccount } from "./pages/ChooseAccount";
import { RegisterUser } from "./pages/RegisterUser";
import { RegisterCompany } from "./pages/RegisterCompany";
import { CustomerSupport } from "./pages/CustomerSupport";
import { Review } from "./pages/Review";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="search" element={<Search />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<ChooseAccount />} />
      <Route path="register/user" element={<RegisterUser />} />
      <Route path="register/company" element={<RegisterCompany />} />
      <Route path="support" element={<CustomerSupport />} />
      <Route path="review" element={<Review />} />
    </Route>
  )
);