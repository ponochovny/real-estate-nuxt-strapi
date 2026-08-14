<script setup lang="ts">
export interface FilterState {
  category: string;
  location: string;
  priceMin: number | null;
  priceMax: number | null;
  features: string[];
}

const props = defineProps<{
  modelValue: FilterState;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FilterState): void;
  (e: "change"): void;
}>();

// Local copy for v-model
const localFilters = reactive({ ...props.modelValue });

// Track external changes (e.g., when going back by URL)
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localFilters, newVal);
  },
  { deep: true },
);

// Sending changes up
const handleApply = () => {
  emit("update:modelValue", { ...localFilters });
  emit("change");
};

const handleReset = () => {
  localFilters.category = "";
  localFilters.location = "";
  localFilters.priceMin = null;
  localFilters.priceMax = null;
  localFilters.features = [];
  handleApply();
};
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-6 flex items-center justify-between">
      <h3 class="text-lg font-bold text-slate-900">Filters</h3>
      <button
        type="button"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        @click="handleReset"
      >
        Reset
      </button>
    </div>

    <form @submit.prevent="handleApply" class="space-y-6">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700"
          >Property type</label
        >
        <select
          v-model="localFilters.category"
          class="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All types</option>
          <option value="Villa">Villas</option>
          <option value="Apartment">Apartments</option>
          <option value="Penthouse">Penthouses</option>
        </select>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700"
          >Price ($)</label
        >
        <div class="grid grid-cols-2 gap-2">
          <input
            v-model.number="localFilters.priceMin"
            type="number"
            placeholder="From"
            class="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <input
            v-model.number="localFilters.priceMax"
            type="number"
            placeholder="To"
            class="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700"
          >Features</label
        >
        <div class="space-y-2">
          <label
            class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
          >
            <input
              v-model="localFilters.features"
              type="checkbox"
              value="1"
              class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Swimming pool
          </label>
          <label
            class="flex items-center gap-2 text-sm text-slate-600 cursor-pointer"
          >
            <input
              v-model="localFilters.features"
              type="checkbox"
              value="2"
              class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Sea view
          </label>
        </div>
      </div>

      <button
        type="submit"
        class="w-full rounded-lg bg-indigo-600 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Apply
      </button>
    </form>
  </div>
</template>
