import { RouterProvider } from "react-router-dom";
import { router } from "./router/Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const App = () => {
  const client = new QueryClient();
  return (
    <div className="container">
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
};
