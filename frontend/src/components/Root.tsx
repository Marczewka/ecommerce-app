import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow bg-indigo-100 p-10">
        <Outlet />
      </main>
    </div>
  );
}
