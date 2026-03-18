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
import { ChooseAccount } from "./pages/ChooseAccount"
import { RegisterUser } from "./pages/RegisterUser"
import { RegisterCompany } from "./pages/RegisterCompany"
import { CustomerSupport } from "./pages/CustomerSupport"
import { Review } from "./pages/Review"
import { Inicio } from "./pages/Inicio";
import { Legal } from "./pages/Legal";
import { Map } from "./pages/Map";
import { CompanyProfile } from "./pages/CompanyProfile";
import { CheckoutTest } from "./pages/CheckoutTest";
import { Checkout } from "./pages/Checkout";
import { Success } from "./pages/Success";
import { Cancel } from "./pages/Cancel";

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      <Route index element={<Inicio />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/search" element={<Search />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<ChooseAccount />} />
      <Route path="/register/user" element={<RegisterUser />} />
      <Route path="/register/company" element={<RegisterCompany />} />
      <Route path="/support" element={<CustomerSupport />} />
      <Route path="/review" element={<Review />} />
      <Route path="/Legal" element={<Legal />} />
      <Route path="/map" element={<Map />} />
      <Route path="/profile/company" element={<CompanyProfile />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="checkout-test" element={<CheckoutTest />} />
      <Route path="success" element={<Success />} />
      <Route path="cancel" element={<Cancel />} />
    </Route>

  
    
  )
);