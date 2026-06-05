import { defineStore } from "pinia";


export const useDataStore = defineStore("dataStore", {
    state: () => ({
        fileName: "", // Holds the name of the uploaded file
        gridData: [], // Holds the parsed Excel data
        diagramData: undefined, // Holds the generated diagram data
        svg: "", // Holds the generated SVG content
        blockCount: 0, // Count of blocks
        towerCount: 0, // Count of towers
        globalDefaults: {
            globalBackgroundColor: "#f5f5f5",
            globalBorderColor: "#c8c8c8",
            globalFontFamily: "Arial",
            globalFontSize: 16,
            globalTextColor: "#000000",
        },
        settings: {
            block: {
                margin: 20,
                padding: 20,
                gap: 10,
                backgroundColor: "#f5f5f5",
                strokeColor: "#c8c8c8",
                fontFamily: "Arial",
                fontSize: 18,
                textColor: "#000000",
            },
            tower: {
                width: 200,
                padding: 10,
                gap: 20,
                backgroundColor: "#e6e6e6",
                strokeColor: "#c8c8c8",
                fontFamily: "Arial",
                fontSize: 16,
                textColor: "#000000",
            },
            box: {
                padding: 10,
                gap: 10,
                backgroundColor: "#ffffff",
                strokeColor: "#c8c8c8",
                fontFamily: "Arial",
                fontSize: 14,
                textColor: "#000000",
            },
            support: {
                padding: 8,
                gap: 8,
                backgroundColor: "#F2F3F4",
                strokeColor: "#c8c8c8",
                fontFamily: "Arial",
                fontSize: 12,
                textColor: "#333333",
            },
        },
    }),
    actions: {
        updateFileName(name) {
            this.fileName = name;
        },
        updateGridData(data) {
            this.gridData = data;
        },
        updateDiagramData(diagramData, svg, blockCount, towerCount) {
            this.diagramData = diagramData;
            this.svg = svg;
            this.blockCount = blockCount;
            this.towerCount = towerCount;
        },
        updateSettings(newSettings) {
            // Update block settings
            if (newSettings.block) {
                this.settings.block.backgroundColor = newSettings.block.backgroundColor ?? this.settings.block.backgroundColor;
                this.settings.block.strokeColor = newSettings.block.strokeColor ?? this.settings.block.strokeColor;
                this.settings.block.fontFamily = newSettings.block.fontFamily ?? this.settings.block.fontFamily;
                this.settings.block.fontSize = newSettings.block.fontSize ?? this.settings.block.fontSize;
                this.settings.block.textColor = newSettings.block.textColor ?? this.settings.block.textColor;
            }

            // Update tower settings
            if (newSettings.tower) {
                this.settings.tower.backgroundColor = newSettings.tower.backgroundColor ?? this.settings.tower.backgroundColor;
                this.settings.tower.strokeColor = newSettings.tower.strokeColor ?? this.settings.tower.strokeColor;
                this.settings.tower.fontFamily = newSettings.tower.fontFamily ?? this.settings.tower.fontFamily;
                this.settings.tower.fontSize = newSettings.tower.fontSize ?? this.settings.tower.fontSize;
                this.settings.tower.textColor = newSettings.tower.textColor ?? this.settings.tower.textColor;
            }

            // Update box settings
            if (newSettings.box) {
                this.settings.box.backgroundColor = newSettings.box.backgroundColor ?? this.settings.box.backgroundColor;
                this.settings.box.strokeColor = newSettings.box.strokeColor ?? this.settings.box.strokeColor;
                this.settings.box.fontFamily = newSettings.box.fontFamily ?? this.settings.box.fontFamily;
                this.settings.box.fontSize = newSettings.box.fontSize ?? this.settings.box.fontSize;
                this.settings.box.textColor = newSettings.box.textColor ?? this.settings.box.textColor;
            }

            // Update support settings
            if (newSettings.support) {
                this.settings.support.backgroundColor = newSettings.support.backgroundColor ?? this.settings.support.backgroundColor;
                this.settings.support.strokeColor = newSettings.support.strokeColor ?? this.settings.support.strokeColor;
                this.settings.support.fontFamily = newSettings.support.fontFamily ?? this.settings.support.fontFamily;
                this.settings.support.fontSize = newSettings.support.fontSize ?? this.settings.support.fontSize;
                this.settings.support.textColor = newSettings.support.textColor ?? this.settings.support.textColor;
            }
        },
        updateGlobalSettings(element, updated_value){
            console.log(element,"\n", updated_value)
            this.globalDefaults[element] = updated_value
            switch(element) {
                case "globalBackgroundColor":
                    this.settings.block.backgroundColor = updated_value
                    this.settings.box.backgroundColor = updated_value
                    this.settings.tower.backgroundColor = updated_value
                    break;
                case "globalBorderColor":
                    this.settings.block.strokeColor = updated_value
                    this.settings.box.strokeColor = updated_value
                    this.settings.tower.strokeColor = updated_value
                    break;
                case "globalTextColor":
                    this.settings.block.textColor = updated_value
                    this.settings.box.textColor = updated_value
                    this.settings.tower.textColor = updated_value
                    break;
                case "globalFontFamily":
                    this.settings.block.fontFamily = updated_value
                    this.settings.box.fontFamily = updated_value
                    this.settings.tower.fontFamily = updated_value
                    break;
                case "globalFontSize":
                    this.settings.block.fontSize = Number(updated_value)
                    this.settings.box.fontSize = Number(updated_value)
                    this.settings.tower.fontSize = Number(updated_value)
                    break;
                default:
                    console.log("Element unknown:", element)
            }

        },
        resetData() {
            this.fileName = "";
            this.gridData = [];
            this.diagramData = null;
            this.svg = null;
            this.blockCount = 0;
            this.towerCount = 0;
        },
    },
});