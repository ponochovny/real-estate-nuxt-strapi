<script setup lang="ts">
import CatalogFilters from "~/widgets/CatalogFilters.vue";
import PropertyGrid from "~/widgets/PropertyGrid.vue";
import GET_PROPERTIES from "~/utils/queries/properties.gql";

const route = useRoute();
const { filters, queryVariables, applyFiltersToUrl } = useCatalogFilters();

type Property = {
  documentId: string;
  title: string;
  slug: string;
  price: number;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  category: {
    name: string;
  };
  location: {
    title: string;
  };
  images: {
    url: string;
  }[];
  agent: {
    name: string;
    photo: {
      url: string;
    };
  };
};

const { data, refresh, pending } = await useAsyncQuery<{
  properties: Property[];
}>(GET_PROPERTIES, queryVariables.value);

watch(
  () => route.query,
  async () => {
    await refresh();
  },
);
</script>

<template>
  <div class="container mx-auto py-8 flex gap-8 px-4">
    <aside class="w-1/4">
      <CatalogFilters v-model="filters" @change="applyFiltersToUrl" />
    </aside>

    <main class="w-3/4">
      <PropertyGrid :properties="data?.properties || []" :loading="pending" />
    </main>
  </div>
</template>
