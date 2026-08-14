export interface CatalogFilters {
  category: string;
  priceMin: number | null;
  priceMax: number | null;
  location: string;
  features: string[];
}

export const useCatalogFilters = () => {
  const route = useRoute();
  const router = useRouter();

  // 1. Safe parsing of parameters from URL
  const parseQueryFilters = (): CatalogFilters => {
    const parseFeatures = (val: any): string[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val as string[];
      return String(val).split(",");
    };

    return {
      category: (route.query.category as string) || "",
      priceMin: route.query.priceMin ? Number(route.query.priceMin) : null,
      priceMax: route.query.priceMax ? Number(route.query.priceMax) : null,
      location: (route.query.location as string) || "",
      features: parseFeatures(route.query.features),
    };
  };

  // 2. Internal reactive state for form/UI
  const filters = ref<CatalogFilters>(parseQueryFilters());

  // 3. Converting filters to GraphQL format for Strapi
  const buildStrapiFilters = (f: CatalogFilters) => {
    const query: Record<string, any> = {};

    if (f.category) {
      query.category = { name: { eq: f.category } };
    }
    if (f.location) {
      query.location = { id: { eq: f.location } };
    }
    if (f.priceMin !== null || f.priceMax !== null) {
      const price: Record<string, number> = {};
      if (f.priceMin !== null && !isNaN(f.priceMin)) price.gte = f.priceMin;
      if (f.priceMax !== null && !isNaN(f.priceMax)) price.lte = f.priceMax;
      if (Object.keys(price).length > 0) query.price = price;
    }
    if (f.features?.length) {
      query.features = { id: { in: f.features } };
    }

    return query;
  };

  // 4. Stable object with internal ref for useAsyncQuery (Working pattern)
  const queryVariables = ref<{ filters: Ref<Record<string, any>> }>({
    filters: ref(buildStrapiFilters(filters.value)),
  });

  // 5. Watch for URL changes and update variables
  watch(
    () => route.query,
    () => {
      filters.value = parseQueryFilters();
      queryVariables.value.filters = buildStrapiFilters(filters.value);
    },
    { deep: true },
  );

  // 6. Method for writting filters to URL (called when clicking "Apply" or checkboxes)
  const applyFiltersToUrl = () => {
    const query: Record<string, any> = {};

    if (filters.value.category) query.category = filters.value.category;
    if (filters.value.location) query.location = filters.value.location;
    if (filters.value.priceMin !== null)
      query.priceMin = filters.value.priceMin;
    if (filters.value.priceMax !== null)
      query.priceMax = filters.value.priceMax;
    if (filters.value.features?.length) {
      query.features = filters.value.features.join(",");
    }

    router.push({ query });
  };

  const resetFilters = () => {
    filters.value = {
      category: "",
      priceMin: null,
      priceMax: null,
      location: "",
      features: [],
    };
    applyFiltersToUrl();
  };

  return {
    filters,
    queryVariables,
    applyFiltersToUrl,
    resetFilters,
  };
};
