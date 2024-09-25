import "./App.css";
import React from "react"
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import ScheduleBuilder from "./pages/ScheduleBuilder/ScheduleBuilder";
import StoreProvider from "./StoreProvider";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
      <Route index element={<StoreProvider><ScheduleBuilder/></StoreProvider>} />
      {/* <Route path="login" element={<Login />} /> */}
    </Route>
  )
)


function App() {
  return (
    <div className="container">
        <RouterProvider router={router}/>
    </div>
  );
}

export default App;
