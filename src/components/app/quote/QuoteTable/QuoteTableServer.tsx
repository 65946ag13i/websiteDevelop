import { getServerQueryClient } from "@/components/ReactQueryProvider/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { searchUserQuoteTable } from "./QuoteTableServices";
import QuoteFunctionSwitch from "@/components/app/quote/QuoteTable/QuoteFunctionSwitch";
const QuoteTableServer: React.FC = () => {
  const clientQuery = getServerQueryClient();
  clientQuery.prefetchQuery({
    queryKey: ["post", 1],
    queryFn: () => searchUserQuoteTable("1"),
  });
  return (
    <HydrationBoundary state={dehydrate(clientQuery)}>
      <QuoteFunctionSwitch />
    </HydrationBoundary>
  );
};
export default QuoteTableServer;
