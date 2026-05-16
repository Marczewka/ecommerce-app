import StoreLayout from "../layouts/ShopLayout";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import AuthApp from "../layouts/RootLayout";

import Category from "../pages/shop/Category";
import Products from "../pages/shop/Products";
import Product from "../pages/shop/Product";
import Cart from "../pages/shop/Cart";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminLayout from "../layouts/AdminLayout";
import AdminProducts from "../pages/admin/Products";
import AdminCategories from "../pages/admin/Categories";
import AdminUsers from "../pages/admin/Users";

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
