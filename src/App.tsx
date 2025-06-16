import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TestConnection } from "./components/TestConnection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className="container mx-auto p-4">
      <TestConnection />
    </div>
  </QueryClientProvider>
);

export default App;
