import Root from "../components/Root";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Category from "../components/Category";
import Products from "../components/Products";
import Product from "../components/Product";
import Cart from "../components/Cart";
import Login from "../components/Login";
import Register from "../components/Register";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="categories/:categorySlug" element={<Category />} />
      <Route index element={<Products />} />
      <Route path="products" element={<Products />} />
      <Route path="products/:productSlug" element={<Product />} />
      <Route path="cart" element={<Cart />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
