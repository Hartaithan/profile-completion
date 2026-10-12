<script setup lang="ts">
import { capture } from "@/utils/analytics";
import { useScriptTag } from "@vueuse/core";

useScriptTag("https://cross-service-link.vercel.app/loader.js", () => {
  document.addEventListener(
    "cross-service-link:ready",
    () => {
      const onLinkClick = (link: string) =>
        capture("promo_widget_clicked", { action: "link", link });
      const onLearnMoreClick = () => capture("promo_widget_clicked", { action: "learn_more" });
      const onNeverShowClick = () => capture("promo_widget_clicked", { action: "never_show" });
      const onCloseClick = () => capture("promo_widget_clicked", { action: "close" });
      const events = { onLinkClick, onLearnMoreClick, onNeverShowClick, onCloseClick };
      const widget = new window.CrossServiceLink({
        target: document.body,
        theme: "inherit",
        events,
        scrollLock: false,
      });
      widget.mount();
    },
    { once: true },
  );
});
</script>

<template>
  <div style="display: none"></div>
</template>
