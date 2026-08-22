<script setup lang="ts">
const currentYear = new Date().getFullYear();
const year = computed(() => {
  return currentYear === 2026 ? "2026" : `2026 - ${currentYear}`;
});
</script>

<template>
  <footer class="border-t bg-muted/30 py-8">
    <div class="text-center text-sm text-muted-foreground">
      © {{ year }} <span class="px-1">•</span> V. Ponochovny. All rights
      reserved. Real estate website built with Strapi and Nuxt.
    </div>
  </footer>
</template>
