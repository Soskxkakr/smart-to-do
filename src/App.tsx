import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Tasks from '@/pages/Tasks'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tasks />
    </QueryClientProvider>
  )
}

export default App
