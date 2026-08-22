// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/apollo",
    "nuxt-strapi-blocks-renderer",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./app/shared/ui",
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: import.meta.env.GQL_HOST,
      },
    },
  },
  $development: {
    apollo: {
      clients: {
        default: {
          httpEndpoint: "http://localhost:1337/graphql",
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      strapiUrl: import.meta.env.STRAPI_URL,
    },
  },
});