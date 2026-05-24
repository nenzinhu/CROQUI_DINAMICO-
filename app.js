/**
 * CROQUI DINÂMICO - APP.JS REFATORIZADO
 * ============================================
 * Editor de croqui dinâmico com suporte a simulação
 */

// ============ CONSTANTS ============
const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1500;
const GRID_SIZE = 40;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;

// ============ STATE MANAGEMENT ============
const AppState = {
    zoom: 1,
    panX: 0,
    panY: 0,
    selectedElement: null,
    isGridVisible: true,
    isSnapEnabled: true,
    isPanning: false,
    elements: [],
    elementIdCounter: 0,
    
    addElement(element) {
        this.elements.push(element);
        return element;
    },
    
    removeElement(id) {
        this.elements = this.elements.filter(el => el.id !== id);
    },
    
    getElement(id) {
        return this.elements.find(el => el.id === id);
    },
    
    selectElement(id) {
        if (this.selectedElement?.id === id) return;
        this.selectedElement = this.getElement(id);
        updatePropertiesPanel();
    },
    
    deselectElement() {
        this.selectedElement = null;
        updatePropertiesPanel();
    }
};

// ============ LIBRARY DATA ============
const LibraryCategories = {
    vehicles: {
        name: 'Veículos',
        icon: '🚗',
        items: [
            { id: 'car-sedan', name: 'Carro Sedã', color: '#ff6b6b', width: 120, height: 60 },
            { id: 'car-suv', name: 'SUV', color: '#ff8c42', width: 140, height: 70 },
            { id: 'truck', name: 'Caminhão', color: '#ffd93d', width: 180, height: 80 },
            { id: 'bus', name: 'Ônibus', color: '#6bcf7f', width: 200, height: 90 },
            { id: 'motorcycle', name: 'Motocicleta', color: '#4d96ff', width: 80, height: 40 }
        ]
    },
    roads: {
        name: 'Vias',
        icon: '🛣️',
        items: [
            { id: 'road-h', name: 'Via Horizontal', color: '#757575', width: 400, height: 80 },
            { id: 'road-v', name: 'Via Vertical', color: '#757575', width: 80, height: 400 },
            { id: 'lane-white', name: 'Faixa Branca', color: '#ffffff', width: 300, height: 10 },
            { id: 'lane-yellow', name: 'Faixa Amarela', color: '#ffeb3b', width: 300, height: 10 }
        ]
    },
    traffic: {
        name: 'Sinalização',
        icon: '🚦',
        items: [
            { id: 'traffic-light', name: 'Semáforo', color: '#555555', width: 40, height: 100 },
            { id: 'stop-sign', name: 'Placa PARE', color: '#ff0000', width: 60, height: 60 },
            { id: 'yield-sign', name: 'Placa CEDA', color: '#ffffff', width: 60, height: 60 },
            { id: 'speed-limit', name: 'Limite de Vel.', color: '#ffffff', width: 50, height: 50 }
        ]
    },
    obstacles: {
        name: 'Obstáculos',
        icon: '🚧',
        items: [
            { id: 'cone', name: 'Cone', color: '#ff9800', width: 30, height: 50 },
            { id: 'barrier', name: 'Barreira', color: '#000000', width: 200, height: 30 },
            { id: 'pothole', name: 'Buraco', color: '#424242', width: 60, height: 60 },
            { id: 'water', name: 'Poça', color: '#2196f3', width: 100, height: 100 }
        ]
    }
};

const ColorPalette = [
    '#ff4757', '#ff6b6b', '#ff8c42', '#ffa502', '#ffeb3b',
    '#2ed573', '#26de81', '#20c997', '#00d4ff', '#00adb5',
    '#4d96ff', '#3b82f6', '#6c5ce7', '#a29bfe', '#ff006e',
    '#1a1a24', '#505050', '#9ca3af', '#ffffff'
];

// ============ DOM ELEMENTS ============
const elements = {
    canvas: document.getElementById('sketch-canvas'),
    elementsLayer: document.getElementById('elements-layer'),
    selectionLayer: document.getElementById('selection-layer'),
    canvasWrapper: document.getElementById('canvas-wrapper'),
    libraryPanel: document.getElementById('library-dynamic-items'),
    propertiesPanel: document.getElementById('prop-editor'),
    emptyState: document.getElementById('prop-empty-state'),
    // Buttons
    btnToggleGrid: document.getElementById('btn-toggle-grid'),
    btnToggleSnap: document.getElementById('btn-toggle-snap'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomReset: document.getElementById('btn-zoom-reset'),
    btnClear: document.getElementById('btn-clear'),
    btnExportSvg: document.getElementById('btn-export-svg'),
    btnExportPng: document.getElementById('btn-export-png'),
    btnScenarios: document.getElementById('btn-scenarios'),
    btnHelp: document.getElementById('btn-help'),
    btnDuplicate: document.getElementById('btn-duplicate-element'),
    btnDelete: document.getElementById('btn-delete-element'),
    // Inputs
    inputScale: document.getElementById('input-scale'),
    inputAngle: document.getElementById('input-angle'),
    inputCustomColor: document.getElementById('input-custom-color'),
    // Modals
    helpModal: document.getElementById('help-modal'),
    scenariosModal: document.getElementById('scenarios-modal'),
    loadingModal: document.getElementById('loading-modal'),
    zoomValue: document.getElementById('zoom-value')
};

// ============ INITIALIZATION ============
function init() {
    console.log('🚀 Inicializando Croqui Dinâmico');
    
    // Render library
    renderLibrary();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize canvas
    updateCanvasTransform();
    
    console.log('✅ Aplicação carregada');
}

// ============ LIBRARY RENDERING ============
function renderLibrary() {
    elements.libraryPanel.innerHTML = '';
    
    Object.values(LibraryCategories).forEach(category => {
        const categoryEl = document.createElement('details');
        categoryEl.className = 'category-group';
        categoryEl.open = true;
        
        const summaryEl = document.createElement('summary');
        summaryEl.className = 'category-header';
        summaryEl.innerHTML = `
            <div class="category-title-wrapper">
                <span class="category-icon">${category.icon}</span>
                <span class="category-name">${category.name}</span>
                <span class="category-counter">${category.items.length}</span>
            </div>
        `;
        
        const contentEl = document.createElement('div');
        contentEl.className = 'category-content';
        
        const gridEl = document.createElement('div');
        gridEl.className = 'grid-items';
        
        category.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'library-item';
            itemEl.draggable = true;
            itemEl.dataset.itemId = item.id;
            itemEl.dataset.color = item.color;
            itemEl.dataset.width = item.width;
            itemEl.dataset.height = item.height;
            
            itemEl.innerHTML = `
                <div class="item-preview">
                    <svg viewBox="0 0 100 60" width="80" height="50">
                        <rect width="100" height="60" fill="${item.color}" rx="4" opacity="0.8"/>
                        <text x="50" y="35" text-anchor="middle" font-size="10" fill="white" font-weight="bold">
                            ${item.id.substring(0, 3).toUpperCase()}
                        </text>
                    </svg>
                </div>
                <span class="item-name">${item.name}</span>
            `;
            
            itemEl.addEventListener('dragstart', handleDragStart);
            gridEl.appendChild(itemEl);
        });
        
        contentEl.appendChild(gridEl);
        categoryEl.appendChild(summaryEl);
        categoryEl.appendChild(contentEl);
        elements.libraryPanel.appendChild(categoryEl);
    });
}

// ============ DRAG & DROP ============
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = {
        id: e.currentTarget.dataset.itemId,
        color: e.currentTarget.dataset.color,
        width: parseInt(e.currentTarget.dataset.width),
        height: parseInt(e.currentTarget.dataset.height)
    };
    e.dataTransfer.effectAllowed = 'copy';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
    e.preventDefault();
    if (!draggedItem) return;
    
    const rect = elements.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - AppState.panX) / AppState.zoom;
    const y = (e.clientY - rect.top - AppState.panY) / AppState.zoom;
    
    createCanvasElement(draggedItem.id, x, y, draggedItem);
}

// ============ ELEMENT CREATION ============
function createCanvasElement(type, x, y, itemData) {
    const element = {
        id: `el-${++AppState.elementIdCounter}`,
        type: type,
        x: x,
        y: y,
        width: itemData.width,
        height: itemData.height,
        rotation: 0,
        scale: 1,
        color: itemData.color,
        zIndex: AppState.elements.length
    };
    
    AppState.addElement(element);
    renderCanvasElement(element);
}

function renderCanvasElement(element) {
    const groupEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    groupEl.id = element.id;
    groupEl.classList.add('canvas-element');
    groupEl.dataset.elementId = element.id;
    
    const rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectEl.setAttribute('x', -element.width / 2);
    rectEl.setAttribute('y', -element.height / 2);
    rectEl.setAttribute('width', element.width * element.scale);
    rectEl.setAttribute('height', element.height * element.scale);
    rectEl.setAttribute('fill', element.color);
    rectEl.setAttribute('rx', '4');
    rectEl.setAttribute('filter', 'url(#element-shadow)');
    
    groupEl.setAttribute('transform', 
        `translate(${element.x}, ${element.y}) rotate(${element.rotation}) scale(${element.scale})`
    );
    
    groupEl.appendChild(rectEl);
    groupEl.addEventListener('click', (e) => {
        e.stopPropagation();
        AppState.selectElement(element.id);
    });
    
    elements.elementsLayer.appendChild(groupEl);
}

// ============ PROPERTIES PANEL ============
function updatePropertiesPanel() {
    const el = AppState.selectedElement;
    
    if (!el) {
        elements.emptyState.classList.remove('hidden');
        elements.propertiesPanel.classList.add('hidden');
        return;
    }
    
    elements.emptyState.classList.add('hidden');
    elements.propertiesPanel.classList.remove('hidden');
    
    // Update values
    document.getElementById('info-element-type').textContent = el.type.toUpperCase();
    document.getElementById('info-element-id').textContent = `ID: ${el.id}`;
    
    elements.inputScale.value = el.scale;
    document.getElementById('val-scale').textContent = `${el.scale.toFixed(2)}x`;
    
    elements.inputAngle.value = el.rotation;
    document.getElementById('val-angle').textContent = `${el.rotation}°`;
    
    elements.inputCustomColor.value = el.color;
    
    // Highlight color in palette
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.color === el.color);
    });
}

// ============ ZOOM & PAN ============
function updateZoomDisplay() {
    elements.zoomValue.textContent = `${Math.round(AppState.zoom * 100)}%`;
}

function updateCanvasTransform() {
    elements.canvas.style.transform = 
        `translate(${AppState.panX}px, ${AppState.panY}px) scale(${AppState.zoom})`;
}

function handleZoom(delta) {
    const oldZoom = AppState.zoom;
    AppState.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, AppState.zoom + delta));
    
    // Adjust pan to zoom towards center
    const zoomRatio = AppState.zoom / oldZoom;
    const centerX = elements.canvasWrapper.clientWidth / 2;
    const centerY = elements.canvasWrapper.clientHeight / 2;
    
    AppState.panX = centerX - (centerX - AppState.panX) * zoomRatio;
    AppState.panY = centerY - (centerY - AppState.panY) * zoomRatio;
    
    updateCanvasTransform();
    updateZoomDisplay();
}

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    // Canvas interactions
    elements.canvasWrapper.addEventListener('dragover', handleDragOver);
    elements.canvasWrapper.addEventListener('drop', handleDrop);
    elements.canvasWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        handleZoom(e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP);
    });
    
    // Pan
    let panStartX, panStartY, panStartPanX, panStartPanY;
    elements.canvasWrapper.addEventListener('mousedown', (e) => {
        if (e.button === 1 || (e.button === 0 && e.code === 'Space')) {
            elements.canvasWrapper.classList.add('panning');
            AppState.isPanning = true;
            panStartX = e.clientX;
            panStartY = e.clientY;
            panStartPanX = AppState.panX;
            panStartPanY = AppState.panY;
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (AppState.isPanning) {
            AppState.panX = panStartPanX + (e.clientX - panStartX);
            AppState.panY = panStartPanY + (e.clientY - panStartY);
            updateCanvasTransform();
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (AppState.isPanning) {
            elements.canvasWrapper.classList.remove('panning');
            AppState.isPanning = false;
        }
    });
    
    // Grid toggle
    elements.btnToggleGrid.addEventListener('click', () => {
        AppState.isGridVisible = !AppState.isGridVisible;
        document.getElementById('canvas-grid').style.opacity = 
            AppState.isGridVisible ? 1 : 0;
        elements.btnToggleGrid.classList.toggle('active');
    });
    
    // Zoom controls
    elements.btnZoomIn.addEventListener('click', () => handleZoom(ZOOM_STEP));
    elements.btnZoomOut.addEventListener('click', () => handleZoom(-ZOOM_STEP));
    elements.btnZoomReset.addEventListener('click', () => {
        AppState.zoom = 1;
        AppState.panX = 0;
        AppState.panY = 0;
        updateCanvasTransform();
        updateZoomDisplay();
    });
    
    // Clear
    elements.btnClear.addEventListener('click', () => {
        if (confirm('Limpar todo o canvas?')) {
            AppState.elements = [];
            AppState.elementIdCounter = 0;
            elements.elementsLayer.innerHTML = '';
            AppState.deselectElement();
        }
    });
    
    // Export
    elements.btnExportSvg.addEventListener('click', exportSVG);
    elements.btnExportPng.addEventListener('click', exportPNG);
    
    // Properties panel
    elements.inputScale.addEventListener('input', (e) => {
        if (!AppState.selectedElement) return;
        AppState.selectedElement.scale = parseFloat(e.target.value);
        document.getElementById('val-scale').textContent = `${AppState.selectedElement.scale.toFixed(2)}x`;
        updateElementDOM(AppState.selectedElement);
    });
    
    elements.inputAngle.addEventListener('input', (e) => {
        if (!AppState.selectedElement) return;
        AppState.selectedElement.rotation = parseInt(e.target.value);
        document.getElementById('val-angle').textContent = `${AppState.selectedElement.rotation}°`;
        updateElementDOM(AppState.selectedElement);
    });
    
    elements.inputCustomColor.addEventListener('input', (e) => {
        if (!AppState.selectedElement) return;
        AppState.selectedElement.color = e.target.value;
        updateElementDOM(AppState.selectedElement);
    });
    
    // Delete & Duplicate
    elements.btnDelete.addEventListener('click', () => {
        if (!AppState.selectedElement) return;
        const id = AppState.selectedElement.id;
        AppState.removeElement(id);
        document.getElementById(id)?.remove();
        AppState.deselectElement();
    });
    
    elements.btnDuplicate.addEventListener('click', () => {
        if (!AppState.selectedElement) return;
        const el = AppState.selectedElement;
        createCanvasElement(el.type, el.x + 50, el.y + 50, {
            color: el.color,
            width: el.width,
            height: el.height
        });
    });
    
    // Modals
    elements.btnHelp.addEventListener('click', () => {
        elements.helpModal.classList.remove('hidden');
    });
    
    elements.btnScenarios.addEventListener('click', () => {
        elements.scenariosModal.classList.remove('hidden');
    });
    
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            AppState.deselectElement();
        }
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (AppState.selectedElement) {
                elements.btnDelete.click();
            }
        }
        if (e.key === 'd' && e.ctrlKey) {
            e.preventDefault();
            if (AppState.selectedElement) {
                elements.btnDuplicate.click();
            }
        }
    });
    
    // Color palette
    renderColorPalette();
}

function renderColorPalette() {
    const paletteEl = document.getElementById('color-palette-options');
    paletteEl.innerHTML = '';
    
    ColorPalette.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.dataset.color = color;
        swatch.addEventListener('click', () => {
            if (!AppState.selectedElement) return;
            AppState.selectedElement.color = color;
            elements.inputCustomColor.value = color;
            updateElementDOM(AppState.selectedElement);
            updatePropertiesPanel();
        });
        paletteEl.appendChild(swatch);
    });
}

function updateElementDOM(element) {
    const groupEl = document.getElementById(element.id);
    if (!groupEl) return;
    
    groupEl.setAttribute('transform', 
        `translate(${element.x}, ${element.y}) rotate(${element.rotation}) scale(${element.scale})`
    );
    
    const rectEl = groupEl.querySelector('rect');
    if (rectEl) {
        rectEl.setAttribute('fill', element.color);
    }
}

// ============ EXPORT ============
function exportSVG() {
    const svgClone = elements.canvas.cloneNode(true);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `croqui-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
}

function exportPNG() {
    elements.loadingModal.classList.remove('hidden');
    
    setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#0f1419';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        const svgString = new XMLSerializer().serializeToString(elements.canvas);
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `croqui-${Date.now()}.png`;
            link.click();
            elements.loadingModal.classList.add('hidden');
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    }, 500);
}

// ============ STARTUP ============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
