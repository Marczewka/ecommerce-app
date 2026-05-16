import StoreLayout from "../components/StoreLayout";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import AuthApp from "../components/AuthApp";

import Category from "../components/Category";
import Products from "../components/Products";
import Product from "../components/Product";
import Cart from "../components/Cart";
import Login from "../components/Login";
import Register from "../components/Register";

import AdminLayout from "../components/AdminLayout";
import AdminProducts from "../components/AdminProducts";
import AdminCategories from "../components/AdminCategories";
import AdminUsers from "../components/AdminUsers";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthApp />}>
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<Products />} />
        <Route path="categories/:categorySlug" element={<Category />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:productSlug" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminProducts />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
