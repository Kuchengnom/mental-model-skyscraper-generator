<template>
  <div id="diagram" class="content-container">
    <div id="buttonbar" class="w-full flex flex-row justify-center mb-8">
      <!-- File Upload Input -->
      <!-- <label>{{$t("common.fileUpload")}}</label> -->
      <input
          type="file"
          ref="fileInput"
          @change="onFileChange"
          accept=".xlsx"
          class="hidden"
          style="display: none;"
      />

      <!-- Styled Button -->
      <button class="btn-primary" @click="triggerFileInput">{{$t("common.fileUpload")}}</button>
      <button class="btn-primary" @click="downloadExcel">{{$t("common.downloadExcel")}}</button>
      <button class="btn-primary"  @click="downloadSvg">{{$t("common.downloadSVG")}}</button>
      <button
          class="btn-primary"
          @click="openModal"
      >{{$t("navbar.menu.settings") }}
      </button>

      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog @close="closeModal" class="relative z-10">
          <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div
                class="flex min-h-full items-center justify-center p-4 mt-12 mb-12 text-center"
            >
              <TransitionChild
                  as="template"
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                    class="w-full max-w-screen-lg transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all"
                >
                  <div class="flex flex-col justify-start">
                    <MMForm @form-submit="closeModal"/>
                  </div>

                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>

    <div id="panelcontainer" class="w-full max-h-[80vh] mb-1 flex flex-row flex-grow bg-white
                                    rounded-2xl select-none">
      <div :style="{ flex: leftPanelFlex }" class="p-4 flex flex-col">
        <h3>{{$t("common.fileContent")}}</h3>
        <div v-if="gridData.length" class="flex-auto relative">
          <div class="h-full w-full absolute overflow-scroll">
            <canvas-datagrid
                :data="gridData"
                :editable="true"
                @data-changed="handleDataChange"
            />
          </div>
        </div>
        <p v-else class="text-gray-500">{{$t("common.noContent")}}</p>
      </div>
      <div
          id="resizeHandle"
          :style="{ flex: centralPanelFlex }"
          class="cursor-col-resize flex items-center justify-center bg-gray-100"
          @mousedown="startResizing"
      >
        <p class="text-center text-sm font-medium text-gray-500">||</p>
      </div>
      <div :style="{ flex: rightPanelFlex }" class="p-4 flex flex-col">
        <h3>{{$t("common.svgView")}}</h3>
        <div v-if="svg"
             class="h-full flex-auto relative overflow-hidden rounded-2xl"
             @wheel.prevent="zoomSvg"
             @mousedown="startPan"
             @mousemove="panSvg"
             @mouseup="endPan"
             @mouseleave="endPan">
          <div
              v-html="svg"
              class="diagram h-full absolute"
              :style="svgTransform"
          />
        </div>
        <p v-else class="text-gray-500">{{$t("common.noContent")}}</p>
      </div>
    </div>
    <p>{{$t("common.Blocks")}}: {{blockCount}}, {{$t("common.Towers")}}: {{towerCount}}</p>
  </div>
</template>

<script setup>
import {generateMentalModelDiagram} from "~/diagrams/mental-model-diagram";
import {useDataStore} from "~/stores/dataStore";
import {onMounted} from "vue";
import { handleFileUpload } from "~/diagrams/fileUtils";
import { utils, writeFile } from "xlsx";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'

const dataStore = useDataStore();

// Access shared data from the Pinia store
const gridData = ref(dataStore.gridData);
const diagramData = ref(dataStore.diagramData);
const svg = ref(dataStore.svg);
const blockCount = ref(dataStore.blockCount);
const towerCount = ref(dataStore.towerCount);
const fileName = ref(dataStore.fileName);
const fileInput = ref(null);
//settings popup:
const isOpen = ref(false)

// Panel resizing state
let isResizing = false;
let startX = 0;
let leftPanelFlex = ref(0.495);
let rightPanelFlex = ref(0.495);
let centralPanelFlex = ref(0.01);

const svgScale = ref(1);
const svgOffset = ref({ x: 0,y:0 });
const isPanning = ref(false);
const panStart = ref({ x: 0, y:0 });
const svgTransform = computed(() => {
  const transform = `scale(${svgScale.value}) translate(${svgOffset.value.x}px, ${svgOffset.value.y}px)`;
  return {
    transform,
    transformOrigin: "0 0",
  };
});

function closeModal() {
  isOpen.value = false
  svg.value = generateMentalModelDiagram(diagramData.value, dataStore.settings);
}
function openModal() {
  isOpen.value = true
}

async function onFileChange(event) {
  try {
    const sheetData = await handleFileUpload(event);
    fileName.value = event.target.files[0].name.split(".")[0]; // Extract the file name
    gridData.value = sheetData;

    generateDiagram(sheetData);
    dataStore.updateFileName(fileName.value);
    dataStore.updateGridData(sheetData);

    console.log("File processed successfully:", sheetData);
  } catch (error) {
    console.error("Error uploading file:", error.message);
    alert(`File upload failed: ${error.message}`);
  }
}


onMounted(() => {
  if(gridData.value.length) {
    generateDiagram(gridData.value);
  }
})

// Watch for changes in gridData and regenerate the SVG
watch(
    gridData,
    (newData) => {
      generateDiagram(newData);
    },
    { deep: true }
);

function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click(); // Programmatically click the hidden input
  }
}

// Handle user edits to the grid data
function handleDataChange(newData) {
  gridData.value = newData; // Update the local and store state
  dataStore.updateGridData(newData);
}

// Methods for resizing panels
function startResizing(event) {
  isResizing = true;
  startX = event.clientX;
  document.addEventListener("mousemove", resizePanels);
  document.addEventListener("mouseup", stopResizing);
}

function resizePanels(event) {
  if (isResizing) {
    const deltaX = event.clientX - startX;
    const containerWidth = document.getElementById("panelcontainer").offsetWidth;
    const totalFlex = leftPanelFlex.value + rightPanelFlex.value;
    const newLeftFlex = leftPanelFlex.value + deltaX / containerWidth;
    const newRightFlex = totalFlex - newLeftFlex;
    if (newLeftFlex >= 0.1 && newRightFlex >= 0.1) {
      leftPanelFlex.value = newLeftFlex;
      rightPanelFlex.value = newRightFlex;
      startX = event.clientX;
    }
  }
}

function stopResizing() {
  isResizing = false;
  document.removeEventListener("mousemove", resizePanels);
  document.removeEventListener("mouseup", stopResizing);
}

function downloadSvg() {
  if (!diagramData.value) {
    alert("No SVG content to download.");
    return;
  }

  const svg = generateMentalModelDiagram(diagramData.value, dataStore.settings);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `${fileName.value}.svg`;
  link.click();
  URL.revokeObjectURL(url);
}

const downloadExcel = () => {
  if (!gridData.value.length) {
    alert("No data to download.");
    return;
  }

  const worksheet = utils.json_to_sheet(gridData.value, { skipHeader: true });
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  writeFile(workbook, `${fileName.value || "updated-diagram-data"}.xlsx`);
};

function generateDiagram(jsonData) {
  let newBlockCount = 0;
  let newTowerCount = 0;
  let block = null;
  let tower = null;
  const data = {};
  const cell = (row, idx) => row[idx] != null ? String(row[idx]).trim() : '';
  jsonData
  .slice(1)
  .forEach((row) => {
    const c0 = cell(row, 0);
    const c1 = cell(row, 1);
    const c2 = cell(row, 2);
    const c3 = cell(row, 3);
    const c4 = cell(row, 4);
    if (c0) {
      block = c0;
      data[block] = {};
      newBlockCount++;
    }
    if (c1) {
      tower = c1;
      data[block][tower] = { tasks: [], supports: [] };
      newTowerCount++;
    }
    if (block && tower) {
      if (c2) {
        data[block][tower].tasks.push(c2);
      }
      if (c3 && c4) {
        data[block][tower].supports.push({ type: c3, label: c4 });
      }
    }
  });
  // Generate the SVG and update the state
  diagramData.value = data;
  const opts = dataStore.settings
  svg.value = generateMentalModelDiagram(data, opts);
  blockCount.value = newBlockCount;
  towerCount.value = newTowerCount;

  dataStore.updateDiagramData(diagramData.value, svg.value, newBlockCount, newTowerCount);
}

function zoomSvg(event) {
  const zoomFactor = 1.1;
  const rect = event.currentTarget.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const zoomDirection = event.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
  svgScale.value *= zoomDirection;
}
function startPan(event) {
  isPanning.value = true;
  console.log(`${event.clientX}   ${svgOffset.value.x}   ${event.clientX / svgScale.value}`)
  panStart.value = {
    x: event.clientX / svgScale.value - svgOffset.value.x,
    y: event.clientY / svgScale.value - svgOffset.value.y
  };
}
function panSvg(event) {
  if (isPanning.value) {
    svgOffset.value = {
      x: event.clientX / svgScale.value - panStart.value.x,
      y: event.clientY / svgScale.value - panStart.value.y
    };
  }
}

function endPan() {
  isPanning.value = false;
}
</script>

<style>
.diagram svg {
  height: 100%;
}
</style>

<style scoped>
.content-container {
  width: 100%; /* Assure que la largeur correspond au parent */
  margin: 0 auto; /* Centre horizontalement */
  overflow-x: hidden; /* Évite les débordements horizontaux */
}
</style>
