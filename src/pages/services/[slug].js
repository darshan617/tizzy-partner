import Layout from "@/components/layout/Layout";
import ServiceSlugPage from "@/components/services/ServiceSlugPage";
import { useGetProvidersQuery } from "@/redux/apis/servicesApi";
import { useRouter } from "next/router";

export default function ParticularService() {
  const router = useRouter();
  const slug =
    typeof router.query.slug === "string" ? router.query.slug : undefined;
  const {
    data: providers,
    isLoading: isLoadingProviders,
    isFetching: isFetchingProviders,
  } = useGetProvidersQuery(undefined, {
    skip: !router.isReady,
  });

  return (
    <Layout>
      <ServiceSlugPage
        slug={slug}
        providers={providers}
        isLoadingProviders={isLoadingProviders}
        isFetchingProviders={isFetchingProviders}
      />
    </Layout>
  );
}
