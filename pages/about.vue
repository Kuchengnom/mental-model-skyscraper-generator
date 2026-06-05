<script setup lang="ts"></script>

<template>
  <div class="content-container">
    <div class="max-w-xl mx-auto py-16 flex flex-col gap-0">

      <!-- Eyebrow -->
      <p class="text-[10px] font-mono uppercase tracking-[0.25em] text-text-muted mb-4 animate-fade-up m-0">
        About
      </p>

      <!-- Title -->
      <h1 class="font-syne text-6xl font-extrabold text-text leading-none mb-4 animate-fade-up">
        Skyline
      </h1>

      <!-- Amber rule -->
      <div class="w-10 h-0.5 bg-amber mb-10 animate-fade-up"></div>

      <!-- Body text -->
      <div class="space-y-4 animate-fade-up-1">
        <p class="text-[14px] text-text-dim leading-relaxed m-0">{{ $t("about.addText1") }}</p>
        <p class="text-[14px] text-text-dim leading-relaxed m-0">{{ $t("about.addText2") }}</p>
        <p class="text-[14px] text-text-dim leading-relaxed m-0">{{ $t("about.addText3") }}</p>
      </div>

      <!-- Indi Young link -->
      <div class="mt-8 animate-fade-up-2">
        <p class="text-[13px] text-text-muted m-0">
          {{ $t("about.linktoIndiYoung") }}
        </p>
        <a href="https://indiyoung.com/"
           target="_blank"
           class="inline-flex items-center gap-1.5 mt-2
                  text-[12px] font-mono uppercase tracking-[0.1em]
                  text-amber hover:text-amber/70 transition-colors">
          {{ $t("about.buttonIndiYoung") }}
          <svg class="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <path d="M2 10L10 2M5 2h5v5"/>
          </svg>
        </a>
      </div>

      <!-- Footer links -->
      <div class="mt-16 pt-6 border-t border-border flex flex-col gap-2 animate-fade-up-3">
        <p class="text-[11px] text-text-muted m-0">
          {{ $t("about.iconsBy") }}
          <a href="https://www.flaticon.com/free-icons/architecture-and-city"
             class="text-amber/60 hover:text-amber ml-1">
            SBTS2018 — Flaticon ↗
          </a>
        </p>
        <p class="text-[11px] text-text-muted m-0">
          {{ $t("about.github") }}
          <a href="https://github.com/katasc22/iaweb24-mmd-generator"
             class="text-amber/60 hover:text-amber ml-1">
            iaweb24-mmd-generator ↗
          </a>
        </p>
      </div>

    </div>
  </div>
</template>
