import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import { LoadingBay, type Property } from "./models/Property";
const pinia = createPinia();
pinia.use(({ store }) => {
  if (store.id == "StaticData") {
    return;
  }
  const storageKey = `pinia-${store.$id}`;
  store.$subscribe(
    (_, state) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (error) {
        console.error(`Failed to persist store ${store.$id}`, error);
      }
    },
    {
      flush: "sync",
      deep: true,
    },
  );
  const savedState = localStorage.getItem(storageKey);

  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);

      if (Array.isArray(parsed.property)) {
        parsed.property = parsed.property.map((property: Property) => ({
          ...property,
          loadingBay: property.loadingBay
            ? new LoadingBay(...property.loadingBay)
            : undefined,
        }));
      }

      store.$patch(parsed);
    } catch (error) {
      console.error(`Failed to hydrate store ${store.$id}`, error);
    }
  }
});
createApp(App).use(pinia).mount("#app");
