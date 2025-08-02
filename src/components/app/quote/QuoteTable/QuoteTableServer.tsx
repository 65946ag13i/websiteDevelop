import { getServerQueryClient } from "@/components/ReactQueryProvider/queryClient";
import QuoteTable from "@/components/app/quote/QuoteTable/QuoteTable";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { searchUserQuote, searchUserQuoteTable } from "./QuoteTableServices";

const QuoteTableServer = ({ children }: { children: React.ReactNode }) => {
  const clientQuery = getServerQueryClient();
  clientQuery.prefetchQuery({
    queryKey: ["post", 1],
    queryFn: () => searchUserQuoteTable("1"),
  });
  return (
    <HydrationBoundary state={dehydrate(clientQuery)}>
      {/* <QuoteTable /> */}
    </HydrationBoundary>
  );
};
