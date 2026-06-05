<template>
  <form @submit.prevent="submitForm">
  <!-- Global Settings Section -->
  <h3>{{$t('form.globalSettings')}}</h3>
  <div class="grid-container">
    <div class="grid-item">
      <label for="globalBackgroundColor">{{$t('form.backgroundColor')}}</label>
      <input v-model="globalSettings.globalBackgroundColor" id="globalBackgroundColor" type="color" @input="updateSettings"/>
    </div>
    <div class="grid-item">
      <label for="globalBorderColor">{{$t('form.borderColor')}}</label>
      <input v-model="globalSettings.globalBorderColor" id="globalBorderColor" type="color" @input="updateSettings"/>
    </div>
    <div class="grid-item">
      <label for="globalTextColor">{{$t('form.textColor')}}</label>
      <input v-model="globalSettings.globalTextColor" id="globalTextColor" type="color" @input="updateSettings"/>
    </div>
    <div class="grid-item">
      <label for="globalFontFamily">{{$t('form.fontFamily')}}</label>
      <select v-model="globalSettings.globalFontFamily" id="globalFontFamily" @input="updateSettings">
        <option value="Arial">Arial</option>
        <option value="'Times New Roman', serif">Times New Roman</option>
        <option value="Verdana, sans-serif">Verdana</option>
        <option value="Tahoma, sans-serif">Tahoma</option>
        <option value="'Courier New', monospace">Courier New</option>
        <option value="'Georgia', serif">Georgia</option>
      </select>
    </div>
    <div class="grid-item">
      <label for="globalFontSize">{{$t('form.fontSize')}}</label>
      <input v-model="globalSettings.globalFontSize" id="globalFontSize" type="number" @change="updateSettings"/>
    </div>
    <div class="grid-item">
      <label>{{$t('form.exportScale')}}</label>
      <div class="scale-options">
        <label v-for="s in [1, 2, 4]" :key="s" :class="['scale-option', globalSettings.exportScale === s ? 'scale-option--active' : '']">
          <input type="radio" :value="s" v-model="globalSettings.exportScale" @change="dataStore.updateGlobalSettings('exportScale', s)" class="sr-only" />
          {{ s }}×
        </label>
      </div>
    </div>
  </div>

  <!-- Element-Specific Settings Section-->
    <h3>{{$t('form.advancedSettings')}}</h3>
  <div v-for="(element, key) in settings" :key="key" class="element-settings">
    <h4>{{ $t('form.' + key+'Settings') }}</h4>
    <div class="grid-container">
      <div class="grid-item">
        <label :for="`${key}BackgroundColor`">{{$t('form.backgroundColor')}}</label>
        <input v-model="element.backgroundColor" :id="`${key}BackgroundColor`" type="color" />
      </div>
      <div class="grid-item">
        <label :for="`${key}BorderColor`">{{$t('form.borderColor')}}</label>
        <input v-model="element.strokeColor" :id="`${key}BorderColor`" type="color" />
      </div>
      <div class="grid-item">
        <label :for="`${key}TextColor`">{{$t('form.textColor')}}</label>
        <input v-model="element.textColor" :id="`${key}TextColor`" type="color" />
      </div>
      <div class="grid-item">
        <label :for="`${key}FontFamily`">{{$t('form.fontFamily')}}</label>
        <select v-model="element.fontFamily" :id="`${key}FontFamily`">
          <option value="Arial">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="Tahoma, sans-serif">Tahoma</option>
          <option value="'Courier New, monospace">Courier New</option>
          <option value="'Georgia, serif">Georgia</option>
        </select>
      </div>
      <div class="grid-item">
        <label :for="`${key}FontSize`">{{$t('form.fontSize')}}</label>
        <input v-model="element.fontSize" :id="`${key}FontSize`" type="number" placeholder="16"/>
      </div>
    </div>
  </div>

    <!-- Submit Button -->
    <button type="submit" class="btn-primary w-fit">{{$t('form.save')}}</button>
  </form>


</template>

<script setup>
import { useDataStore } from "@/stores/dataStore.js";
import { computed } from "vue";
import { onMounted } from "vue";

// Define the event emitted to the parent
const emit = defineEmits(['form-submit']);

// Use the settings store
const dataStore = useDataStore();

// Access the settings
const settings = computed(() => dataStore.settings);

const globalSettings = computed(() => dataStore.globalDefaults);


onMounted(() => {
  //To check if we have settings in localstorage
  const savedSettings = localStorage.getItem("userSettings");

  if(savedSettings) {
    const parsedSettings=JSON.parse(savedSettings);
    console.log("localStorage");

    for (const [key,value] of Object.entries(parsedSettings.globalSettings || {})) {
      console.log("updating",key)
      dataStore.updateGlobalSettings(key, value || {});
    }

    for (const [key,value] of Object.entries(parsedSettings.elementSettings || {})){
      if (settings.value[key]) {
        Object.assign(settings.value[key], value);
      }
    }
  }else{
    console.log("default");
  }
});



function updateSettings(event){
  let target_element = event.target.id
  let updated_value
  switch(target_element) {
    case "globalBackgroundColor":
      updated_value = event.target.form[0].value
      break;
    case "globalBorderColor":
      updated_value = event.target.form[1].value
      break;
    case "globalTextColor":
      updated_value = event.target.form[2].value
      break;
    case "globalFontFamily":
      updated_value = event.target.form[3].value
      break;
    case "globalFontSize":
      updated_value = event.target.form[4].value
      break;
    default:
      console.log("Element unknown: ", target_element)
  }
  console.log(target_element,"\n", updated_value)
  dataStore.updateGlobalSettings(target_element, updated_value)
  console.log(settings.value.block)
}


// Handle form submission
const submitForm = () => {

  //To save the settings in localstorage:
  const currentSettings = {
    globalSettings: globalSettings.value,
    elementSettings: settings.value,
  };
  localStorage.setItem("userSettings", JSON.stringify(currentSettings));


  dataStore.updateSettings(settings.value);
  emit('form-submit');
};
</script>

<style scoped>
.scale-options {
  display: flex;
  gap: 6px;
}
.scale-option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 28px;
  border: 1px solid var(--color-border, #c8c8c8);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  transition: background 0.1s, border-color 0.1s;
}
.scale-option:hover {
  border-color: #888;
}
.scale-option--active {
  background: var(--color-ink, #1a1a1a);
  color: #fff;
  border-color: var(--color-ink, #1a1a1a);
}
</style>
