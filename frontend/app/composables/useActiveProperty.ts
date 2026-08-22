const hoveredPropertyId = ref<string | null>(null);
const selectedPropertyId = ref<string | null>(null);

export const useActiveProperty = () => {
  const route = useRoute();

  const { filters, applyFiltersToUrl } = useCatalogFilters();

  onMounted(() => {
    selectedPropertyId.value = route.query.activeProperty as string | null;
  });

  const computedHoveredPropertyId = computed(() => {
    return hoveredPropertyId.value;
  });

  const setHovered = (id: string | null) => {
    hoveredPropertyId.value = id;
  };

  const setSelected = (id: string | null) => {
    selectedPropertyId.value = id;
    filters.value.activeProperty = id;
    applyFiltersToUrl();
  };

  return {
    hoveredPropertyId,
    computedHoveredPropertyId,
    selectedPropertyId,
    setHovered,
    setSelected,
  };
};
