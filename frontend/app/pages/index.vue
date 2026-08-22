<script setup lang="ts">
import CatalogFilters from "~/widgets/CatalogFilters.vue";
import PropertyGrid from "~/widgets/PropertyGrid.vue";
import GET_PROPERTIES from "~/utils/queries/properties.gql";
import PropertyMap from "~/widgets/PropertyMap.vue";

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
  <div
    class="grid gap-8 px-4 py-6 lg:grid-cols-[minmax(0,2fr)_minmax(22rem,3fr)]"
  >
    <main class="min-w-0 space-y-6">
      <CatalogFilters v-model="filters" @change="applyFiltersToUrl" />
      <PropertyGrid :properties="data?.properties || []" :loading="pending" />
    </main>

    <aside class="min-w-0">
      <PropertyMap :properties="data?.properties || []" />
    </aside>
  </div>
</template>
