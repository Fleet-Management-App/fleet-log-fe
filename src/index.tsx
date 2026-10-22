import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

import { Context } from "@/context/Context";
import { router } from "@/routes/-router";

import "@/styles.css";

createRoot(document.getElementById("root")!).render(
  <Context>
    <RouterProvider router={router} />
  </Context>,
);
