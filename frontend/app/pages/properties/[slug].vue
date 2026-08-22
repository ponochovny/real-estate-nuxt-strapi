<script setup lang="ts">
import type { BlockNode } from "#strapi-blocks-renderer/types";
import { gql } from "graphql-tag";

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const GET_PROPERTY_BY_SLUG = gql`
  query GetPropertyBySlug($filters: PropertyFiltersInput) {
    properties(filters: $filters) {
      title
      description
      price
      bedrooms
      area
      category {
        name
      }
      location {
        title
      }
      latitude
      longitude
      swimming_pool
      sea_view
      agent {
        name
        phone
        email
        photo {
          url
        }
      }
      images {
        url
      }
    }
  }
`;

type Property = {
  title: string;
  description: BlockNode[];
  price: number;
  bedrooms: number;
  area: number;
  category: {
    name: string;
  };
  location: {
    title: string;
  };
  latitude: number;
  longitude: number;
  swimming_pool: boolean;
  sea_view: boolean;
  agent: {
    name: string;
    phone: string;
    email: string;
    photo: {
      url: string;
    };
  };
  images: {
    url: string;
  }[];
};

const { data, pending, error } = await useAsyncQuery<{
  properties: Property[];
}>(GET_PROPERTY_BY_SLUG, {
  filters: { slug: { eq: slug.value } },
});

const property = computed(() => data.value?.properties?.[0]);
</script>

<template>
  <div v-if="pending" class="container mx-auto py-12 text-center">
    <p class="text-slate-500">Loading...</p>
  </div>

  <div v-else-if="error" class="container mx-auto py-24 px-4 text-center">
    <h1 class="text-3xl font-bold text-slate-900 mb-4">
      Unable to load property
    </h1>
    <p class="text-slate-500 mb-8">Please try again later.</p>
  </div>

  <div v-else-if="!property" class="container mx-auto py-24 px-4 text-center">
    <h1 class="text-3xl font-bold text-slate-900 mb-4">Property Not Found</h1>
    <p class="text-slate-500 mb-8">
      The property you are looking for does not exist or has been removed.
    </p>
    <NuxtLink
      to="/"
      class="inline-flex items-center justify-center bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
    >
      Back to Home
    </NuxtLink>
  </div>

  <div v-else class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div
      class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center"
    >
      <div>
        <span
          class="text-sm font-semibold text-indigo-600 uppercase tracking-wider"
        >
          {{ property.category?.name }}
        </span>
        <h1 class="text-3xl font-bold text-slate-900 mt-1">
          {{ property.title }}
        </h1>
        <p class="text-slate-500">📍 {{ property.location?.title }}</p>
      </div>
      <div class="text-3xl font-extrabold text-indigo-600">
        ${{ property.price?.toLocaleString() }}
      </div>
    </div>

    <!-- Cloudinary Gallery -->
    <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div
        v-for="(img, idx) in property.images"
        :key="idx"
        :class="idx === 0 ? 'md:col-span-2 md:row-span-2' : ''"
        class="overflow-hidden rounded-2xl bg-slate-100 h-64 md:h-full"
      >
        <img
          :src="img?.url"
          :alt="property.title"
          class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>

    <!-- Main content and agent contacts -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <div
          class="flex gap-6 rounded-2xl border border-slate-200 p-4 bg-slate-50"
        >
          <div>
            <span class="text-slate-500 text-sm">Bedrooms:</span>
            <strong>{{ property.bedrooms }}</strong>
          </div>
          <div>
            <span class="text-slate-500 text-sm">Area:</span>
            <strong>{{ property.area }} m²</strong>
          </div>
        </div>

        <div v-if="property.description">
          <h2 class="text-xl font-bold mb-3">Description</h2>
          <div class="text-slate-600 leading-relaxed">
            <StrapiBlocksText :nodes="property.description" />
          </div>
        </div>

        <!-- Amenities / Tags -->
        <div v-if="property.sea_view || property.swimming_pool">
          <h2 class="text-xl font-bold mb-3">Amenities</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-if="property.sea_view"
              class="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
            >
              ✓ Sea View
            </span>
            <span
              v-if="property.swimming_pool"
              class="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
            >
              ✓ Swimming Pool
            </span>
          </div>
        </div>
      </div>

      <!-- Agent Card from Strapi -->
      <aside>
        <div
          class="sticky top-6 rounded-2xl border border-slate-200 p-6 shadow-sm bg-white"
        >
          <h3 class="text-lg font-bold mb-4">Agent</h3>
          <div class="flex items-center gap-4 mb-4" v-if="property.agent">
            <img
              :src="property.agent.photo?.url"
              class="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <div class="font-bold text-slate-900">
                {{ property.agent.name }}
              </div>
              <div class="text-sm text-slate-500">Real Estate Expert</div>
            </div>
          </div>
          <a
            v-if="property.agent?.phone"
            :href="`tel:${property.agent?.phone}`"
            class="block w-full text-center bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Call agent
          </a>
        </div>
      </aside>
    </div>
  </div>
</template>
