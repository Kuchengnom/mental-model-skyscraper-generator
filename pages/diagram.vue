<template>
  <div id="diagram" class="content-container gap-0">

    <!-- ── Toolbar ─────────────────────────────────────────── -->
    <div class="flex items-center justify-between mb-3 py-2 animate-fade-up">

      <div class="flex items-center gap-0.5">
        <input type="file" ref="fileInput" @change="onFileChange"
               accept=".xlsx" class="hidden" style="display: none;" />

        <button class="btn-primary" @click="triggerFileInput">
          <svg class="size-3 opacity-50" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1v9M4 6l4 4 4-4M2 13h12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          </svg>
          {{ $t("common.fileUpload") }}
        </button>

        <button class="btn-primary" @click="downloadExcel">
          <svg class="size-3 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <path d="M8 1v9M4 10l4 4 4-4M2 13h12"/>
          </svg>
          {{ $t("common.downloadExcel") }}
        </button>

        <div class="w-px h-4 bg-border mx-1.5"></div>

        <button class="btn-primary" @click="downloadSvg">
          <svg class="size-3 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <rect x="2" y="2" width="12" height="12" rx="1"/><path d="M5 6h6M5 10h4"/>
          </svg>
          {{ $t("common.downloadSVG") }}
        </button>
      </div>

      <button class="btn-primary" @click="openModal">
        <svg class="size-3 opacity-50" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"/>
        </svg>
        {{ $t("navbar.menu.settings") }}
      </button>
    </div>

    <!-- ── Settings modal ──────────────────────────────────── -->
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog @close="closeModal" class="relative z-50">

        <TransitionChild as="template"
          enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-150 ease-in"  leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-ink/20 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-6">
            <TransitionChild as="template"
              enter="duration-200 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
              leave="duration-150 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-screen-lg bg-surface border border-border rounded-sm
                       p-6 shadow-xl shadow-ink/10 overflow-hidden">
                <MMForm @form-submit="closeModal" />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- ── Panels ──────────────────────────────────────────── -->
    <div id="panelcontainer"
         class="w-full flex flex-row select-none animate-fade-up"
         style="height: calc(100vh - 148px); min-height: 360px;">

      <!-- Data grid -->
      <div :style="{ flex: leftPanelFlex }" class="panel-surface min-w-0">
        <div class="panel-label">
          <span class="panel-dot"></span>
          {{ $t("common.fileContent") }}
        </div>
        <div v-if="gridData.length" class="flex-1 relative overflow-hidden">
          <div class="absolute inset-0 overflow-auto">
            <canvas-datagrid :data="gridData" :editable="true" @data-changed="handleDataChange" />
          </div>
        </div>
        <div v-else class="flex-1 flex flex-col items-center justify-center gap-2">
          <svg class="size-8 text-ink-muted/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="1"/>
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
          </svg>
          <p class="text-[10px] uppercase tracking-[0.18em] m-0 text-text-muted">
            {{ $t("common.noContent") }}
          </p>
        </div>
      </div>

      <!-- Resize handle -->
      <div id="resizeHandle"
           :style="{ flex: centralPanelFlex }"
           class="cursor-col-resize flex items-center justify-center px-1 group shrink-0"
           @mousedown="startResizing">
        <div class="w-px h-10 bg-border group-hover:bg-amber/30 transition-colors duration-150"></div>
      </div>

      <!-- SVG preview -->
      <div :style="{ flex: rightPanelFlex }" class="panel-surface min-w-0">
        <div class="panel-label">
          <span class="panel-dot"></span>
          {{ $t("common.svgView") }}
        </div>
        <div v-if="svg"
             class="flex-1 relative overflow-hidden"
             @wheel.prevent="zoomSvg"
             @mousedown="startPan"
             @mousemove="panSvg"
             @mouseup="endPan"
             @mouseleave="endPan">
          <div v-html="svg" class="diagram absolute inset-0" :style="svgTransform" />
        </div>
        <div v-else class="flex-1 flex flex-col items-center justify-center gap-2">
          <svg class="size-8 text-ink-muted/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="1"/>
            <path d="M7 17V9M11 17V7M15 17v-6M19 17v-4" stroke-linecap="round"/>
          </svg>
          <p class="text-[10px] uppercase tracking-[0.18em] m-0 text-text-muted">
            {{ $t("common.noContent") }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── Status bar ──────────────────────────────────────── -->
    <div class="status-bar">
      <span>{{ $t("common.Blocks") }}&nbsp;<span class="status-value">{{ blockCount }}</span></span>
      <span class="status-divider"></span>
      <span>{{ $t("common.Towers") }}&nbsp;<span class="status-value">{{ towerCount }}</span></span>
    </div>

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

  let svgContent = generateMentalModelDiagram(diagramData.value, dataStore.settings);
  const scale = dataStore.globalDefaults.exportScale ?? 1;
  if (scale !== 1) {
    const match = svgContent.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    if (match) {
      const w = Math.round(parseFloat(match[1]) * scale);
      const h = Math.round(parseFloat(match[2]) * scale);
      svgContent = svgContent.replace('<svg ', `<svg width="${w}" height="${h}" `);
    }
  }

  const blob = new Blob([svgContent], { type: "image/svg+xml" });
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
      const conceptType = cell(row, 5);
      if (conceptType && !data[block][tower].supports.some(s => s.type === conceptType)) {
        data[block][tower].supports.push({ type: conceptType, label: conceptType });
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
  overflow-x: hidden;
}
</style>
