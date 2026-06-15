<script setup lang="ts">
import { capture } from "@/utils/analytics";
import { useScriptTag } from "@vueuse/core";

useScriptTag("https://cross-service-link.vercel.app/loader.js", () => {
  document.addEventListener(
    "cross-service-link:ready",
    () => {
      const onLinkClick = (link: string) => capture("link-click", { link });
      const onLearnMoreClick = () => capture("learn-more-click");
      const onNeverShowClick = () => capture("never-show-click");
      const onCloseClick = () => capture("close-click");
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
