import Root from "../components/Root";
import Categories from "../components/Categories";
import Category from "../components/Category";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="categories" element={<Categories />} />
      <Route path="products" element={<Category />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
