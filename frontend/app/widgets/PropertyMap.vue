<script setup lang="ts">
import { useActiveProperty } from "~/composables/useActiveProperty";

const props = defineProps<{
  properties: Array<any>;
}>();

const { hoveredPropertyId, setHovered, setSelected, selectedPropertyId } =
  useActiveProperty();

const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
const markersMap = new Map<string, any>(); // Хранилище ссылок на маркеры Leaflet
let markersGroup: any = null;

onMounted(async () => {
  const L = await import("leaflet");
  import("leaflet/dist/leaflet.css");

  if (!mapContainer.value) return;

  map = L.map(mapContainer.value).setView([41.47, 2.08], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  markersGroup = L.layerGroup().addTo(map);
  renderMarkers(L);
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  markersGroup = null;
  markersMap.clear();
});

const getFormattedPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

const renderMarkers = async (LInstance?: any) => {
  const L = LInstance || (await import("leaflet"));
  if (!map) return;

  // Clear old markers
  markersGroup.clearLayers();

  props.properties.forEach((item) => {
    const coords = item;
    if (coords?.latitude == null || coords?.longitude == null) return;

    const icon = createCustomIcon(
      L,
      item.price,
      item.documentId === selectedPropertyId.value,
    );
    const marker = L.marker([coords.latitude, coords.longitude], {
      icon,
    });

    markersGroup.addLayer(marker);

    // Map events -> State
    marker.on("mouseover", () => setHovered(item.documentId));
    marker.on("mouseout", () => setHovered(null));
    marker.on("click", () => {
      setSelected(item.documentId);

      const zoom = map.getZoom() - 1 <= 14 ? 14 : map.getZoom() - 1;
      map.flyTo([coords.latitude, coords.longitude], zoom, {
        duration: 0.5,
      });
    });

    if (selectedPropertyId.value === item.documentId) {
      marker.setZIndexOffset(1000);

      const zoom = map.getZoom() - 1 <= 14 ? 14 : map.getZoom() - 1;
      map.flyTo([coords.latitude, coords.longitude], zoom, {
        duration: 0.5,
      });
    }
  });
};

// Custom HTML-pin
const createCustomIcon = (L: any, price: number, isActive: boolean) => {
  return L.divIcon({
    className: "custom-map-pin w-auto!",
    html: `
      <div class="px-2.5 py-1 text-xs font-bold rounded-lg shadow-md transition-all duration-200 cursor-pointer ${
        isActive
          ? "bg-indigo-600 text-white scale-125 z-50 ring-4 ring-indigo-200"
          : "bg-white text-slate-800 hover:bg-slate-100"
      }">
        ${getFormattedPrice(price)}
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
};

// Map reaction to hoveredPropertyId from the list of cards
watch(hoveredPropertyId, async (newId) => {
  const L = await import("leaflet");
  if (!map || !markersGroup) return;

  // Remove all markers from group
  markersGroup.clearLayers(); // Recreate markers
  props.properties.forEach((item) => {
    const coords = item;
    if (!coords?.latitude || !coords?.longitude) return;

    const icon = createCustomIcon(
      L,
      item.price,
      item.documentId === newId || item.documentId === selectedPropertyId.value,
    );
    const marker = L.marker([coords.latitude, coords.longitude], {
      icon,
    });

    markersGroup.addLayer(marker);

    // Update z-index
    if (item.documentId === newId) {
      marker.setZIndexOffset(1000);
    }

    // Add event handlers
    marker.on("mouseover", () => setHovered(item.documentId));
    marker.on("mouseout", () => setHovered(null));
    marker.on("click", () => {
      setSelected(item.documentId);

      const zoom = map.getZoom() + 1 >= 14 ? 14 : map.getZoom() + 1;
      map.flyTo([coords.latitude, coords.longitude], zoom, {
        duration: 0.5,
      });
    });
  });
});

watch(
  () => [props.properties, selectedPropertyId.value],
  () => renderMarkers(),
  { deep: true },
);
</script>

<template>
  <div
    class="sticky top-6 h-[calc(100vh-6rem)] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
  >
    <div ref="mapContainer" class="h-full w-full z-0"></div>
  </div>
</template>
