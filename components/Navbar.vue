<script setup>
const localePath = useLocalePath();
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 h-[52px] z-50
              flex items-center justify-between px-6
              bg-surface/90 backdrop-blur-md
              border-b border-border shadow-sm shadow-ink/[0.04]">

    <!-- Wordmark -->
    <NuxtLink :to="localePath('/')" class="flex items-center gap-2.5 group no-underline">
      <div class="w-6 h-6 bg-accent rounded-sm flex items-center justify-center shrink-0
                  group-hover:bg-accent-dim transition-colors duration-200">
        <img src="/favicon.ico" alt="" class="size-4" style="filter: brightness(0) invert(1);" />
      </div>
      <span class="font-syne text-[11px] font-bold tracking-[0.22em] uppercase text-ink
                   group-hover:text-accent transition-colors duration-200">
        Skyline
      </span>
    </NuxtLink>

    <!-- Nav links -->
    <div class="flex items-center gap-1">
      <NuxtLink :to="localePath('/diagram')" class="btn-nav">
        {{ $t("navbar.menu.diagram") }}
      </NuxtLink>
      <NuxtLink :to="localePath('/about')" class="btn-nav">
        {{ $t("navbar.menu.about") }}
      </NuxtLink>
      <div class="w-px h-3.5 bg-border mx-2"></div>
      <LanguageSwitcher />
    </div>
  </nav>
</template>
