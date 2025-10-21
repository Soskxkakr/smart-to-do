import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Tasks from '@/pages/Tasks'
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Tasks />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
