import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grow bg-indigo-100 p-10">
        <Outlet />
      </main>
    </div>
  );
}
