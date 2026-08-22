<script setup lang="ts">
import PropertyCard from "./PropertyCard.vue";

defineProps<{
  properties: Array<any>;
  loading: boolean;
}>();
</script>

<template>
  <div>
    <!-- Skeleton while loading -->
    <div v-if="loading" class="grid grid-cols-1 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="h-105 animate-pulse rounded-2xl bg-slate-200"
      ></div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!properties?.length"
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center"
    >
      <p class="text-xl font-medium text-slate-700">Nothing found</p>
      <p class="mt-1 text-sm text-slate-500">
        Try changing the filtering parameters
      </p>
    </div>

    <!-- Grid of cards -->
    <div v-else class="grid grid-cols-1 gap-6">
      <PropertyCard
        v-for="item in properties"
        :key="item.documentId"
        :property="item"
      />
    </div>
  </div>
</template>
