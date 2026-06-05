<script setup>
import { GlobeEuropeAfricaIcon } from '@heroicons/vue/24/solid/index.js';
import { ref } from 'vue';

const { setLocale } = useI18n();
const isDropdownOpen = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
function changeLanguage(lang) {
  setLocale(lang);
  isDropdownOpen.value = false;
}

const langs = [
  ['en', 'English'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
];
</script>

<template>
  <div class="relative">
    <button @click="toggleDropdown" class="btn-nav flex items-center gap-1.5">
      <GlobeEuropeAfricaIcon class="size-3.5 opacity-60" />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isDropdownOpen"
           class="absolute right-0 top-full mt-1 w-28
                  bg-surface border border-border rounded-sm
                  shadow-lg shadow-ink/10 z-50 overflow-hidden">
        <ul class="py-1">
          <li v-for="[code, label] in langs" :key="code">
            <button @click="changeLanguage(code)"
                    class="w-full text-left px-3 py-1.5
                           text-[11px] font-mono tracking-wider
                           text-ink-dim hover:text-accent hover:bg-accent-bg
                           transition-colors duration-100">
              {{ label }}
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
