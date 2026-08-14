<script setup lang="ts">
interface PropertyProps {
  property: {
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
}

const props = defineProps<PropertyProps>();
const config = useRuntimeConfig();

const formattedPrice = computed(() => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(props.property.price);
});
</script>

<template>
  <div
    class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
  >
    <div class="relative h-64 overflow-hidden bg-slate-100">
      <img
        :src="property.images?.[0]?.url"
        :alt="property.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span
        v-if="property.category"
        class="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-md"
      >
        {{ property.category.name }}
      </span>
    </div>

    <div class="p-5">
      <div class="mb-2 text-2xl font-bold text-slate-900">
        {{ formattedPrice }}
      </div>

      <NuxtLink :to="`/properties/${property.slug}`">
        <h3
          class="mb-2 text-lg font-semibold text-slate-800 hover:text-indigo-600"
        >
          {{ property.title }}
        </h3>
      </NuxtLink>

      <p v-if="property.location" class="mb-4 text-sm text-slate-500">
        📍 {{ property.location.title }}
      </p>

      <div
        class="flex items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600"
      >
        <span v-if="property.bedrooms">
          🛏 {{ property.bedrooms }} bedrooms
        </span>
        <span v-if="property.bathrooms">
          🛁 {{ property.bathrooms }} bathrooms
        </span>
        <span v-if="property.area"> 📐 {{ property.area }} m² </span>
      </div>

      <!-- Agent -->
      <div
        v-if="property.agent"
        class="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3"
      >
        <div class="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
          <img
            v-if="property.agent.photo"
            :src="property.agent.photo.url"
            :alt="property.agent.name"
            class="h-full w-full object-cover"
          />
        </div>
        <span class="text-xs font-medium text-slate-600">
          {{ property.agent.name }}
        </span>
      </div>
    </div>
  </div>
</template>
