/* ==========================================================================
   LÓGICA DA APLICAÇÃO - CROQUI DINÂMICO DE TRÂNSITO
   ========================================================================== */

// 1. DEFINIÇÃO DE MODELOS VETORIAIS (SVG TEMPLATES)
const ELEMENT_TEMPLATES = {
    // --- CATEGORIA: PISTAS ---
    'road-straight': {
        name: 'Pista Reta',
        category: 'road',
        width: 240,
        height: 160,
        svg: `
            <!-- Asfalto -->
            <rect x="-120" y="-80" width="240" height="160" fill="#2c2c35"/>
            <!-- Calçada (Opcional - Estética) -->
            <rect x="-120" y="-105" width="240" height="25" fill="#3e3e4a" opacity="0.4"/>
            <rect x="-120" y="80" width="240" height="25" fill="#3e3e4a" opacity="0.4"/>
            <!-- Guias (Meio-Fio) -->
            <line x1="-120" y1="-80" x2="120" y2="-80" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-120" y1="80" x2="120" y2="80" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas de Bordo (Laterais Brancas) -->
            <line x1="-120" y1="-74" x2="120" y2="-74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="-120" y1="74" x2="120" y2="74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <!-- Faixa Central Amarela (Dupla Amarela Contínua ou Tracejada) -->
            <line x1="-120" y1="-2" x2="120" y2="-2" stroke="#ffd54f" stroke-width="2"/>
            <line x1="-120" y1="2" x2="120" y2="2" stroke="#ffd54f" stroke-width="2"/>
        `,
        paintable: false
    },
    'road-straight-dashed': {
        name: 'Pista Reta Tracejada',
        category: 'road',
        width: 240,
        height: 160,
        svg: `
            <!-- Asfalto -->
            <rect x="-120" y="-80" width="240" height="160" fill="#2c2c35"/>
            <!-- Calçada (Opcional - Estética) -->
            <rect x="-120" y="-105" width="240" height="25" fill="#3e3e4a" opacity="0.4"/>
            <rect x="-120" y="80" width="240" height="25" fill="#3e3e4a" opacity="0.4"/>
            <!-- Guias (Meio-Fio) -->
            <line x1="-120" y1="-80" x2="120" y2="-80" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-120" y1="80" x2="120" y2="80" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas de Bordo (Laterais Brancas) -->
            <line x1="-120" y1="-74" x2="120" y2="-74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="-120" y1="74" x2="120" y2="74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <!-- Faixa Central Tracejada Amarela -->
            <line x1="-120" y1="0" x2="120" y2="0" stroke="#ffd54f" stroke-width="3" stroke-dasharray="15,12"/>
        `,
        paintable: false
    },
    'road-straight-clean': {
        name: 'Pista Reta sem Faixa',
        category: 'road',
        width: 240,
        height: 160,
        svg: `
            <!-- Asfalto -->
            <rect x="-120" y="-80" width="240" height="160" fill="#2c2c35"/>
            <!-- Calçada (Opcional - Estética) -->
            <rect x="-120" y="-105" width="240" height="25" fill="#3e3e4a" opacity="0.4"/>
            <rect x="-120" y="80" width="240" height="25" fill="#3e3e4a" opacity="0.4"/>
            <!-- Guias (Meio-Fio) -->
            <line x1="-120" y1="-80" x2="120" y2="-80" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-120" y1="80" x2="120" y2="80" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas de Bordo (Laterais Brancas) -->
            <line x1="-120" y1="-74" x2="120" y2="-74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="-120" y1="74" x2="120" y2="74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
        `,
        paintable: false
    },
    'road-curve': {
        name: 'Curva 90°',
        category: 'road',
        width: 280,
        height: 280,
        svg: `
            <!-- Curva centrada em (-140, -140) localmente, de forma que o centro do objeto fique em (0,0) -->
            <!-- Asfalto -->
            <path d="M-140,0 A140,140 0 0,1 0,-140 L140,-140 A280,280 0 0,0 -140,140 Z" fill="#2c2c35"/>
            <!-- Meio-fio interno e externo -->
            <path d="M-140,0 A140,140 0 0,1 0,-140" fill="none" stroke="#7a7a8c" stroke-width="3"/>
            <path d="M-140,140 A280,280 0 0,0 140,-140" fill="none" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas de bordo -->
            <path d="M-140,6 A146,146 0 0,1 -6,-140" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <path d="M-140,134 A274,274 0 0,0 134,-140" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <!-- Faixa amarela dupla central (Raio = 210) -->
            <path d="M-140,68 A208,208 0 0,1 -68,-140" fill="none" stroke="#ffd54f" stroke-width="2"/>
            <path d="M-140,72 A212,212 0 0,1 -72,-140" fill="none" stroke="#ffd54f" stroke-width="2"/>
        `,
        paintable: false
    },
    'road-intersection': {
        name: 'Cruzamento',
        category: 'road',
        width: 320,
        height: 320,
        svg: `
            <!-- Área de asfalto -->
            <rect x="-160" y="-160" width="320" height="320" fill="#2c2c35"/>
            <!-- Calçadas nos cantos -->
            <path d="M -160,-160 L -80,-160 L -80,-100 Q -80,-80 -100,-80 L -160,-80 Z" fill="#3e3e4a" opacity="0.3"/>
            <path d="M 160,-160 L 80,-160 L 80,-100 Q 80,-80 100,-80 L 160,-80 Z" fill="#3e3e4a" opacity="0.3"/>
            <path d="M -160,160 L -80,160 L -80,100 Q -80,80 -100,80 L -160,80 Z" fill="#3e3e4a" opacity="0.3"/>
            <path d="M 160,160 L 80,160 L 80,100 Q 80,80 100,80 L 160,80 Z" fill="#3e3e4a" opacity="0.3"/>
            <!-- Meio-fio -->
            <path d="M -160,-80 L -100,-80 Q -80,-80 -80,-100 L -80,-160" stroke="#7a7a8c" stroke-width="3" fill="none"/>
            <path d="M 160,-80 L 100,-80 Q 80,-80 80,-100 L 80,-160" stroke="#7a7a8c" stroke-width="3" fill="none"/>
            <path d="M -160,80 L -100,80 Q -80,80 -80,100 L -80,160" stroke="#7a7a8c" stroke-width="3" fill="none"/>
            <path d="M 160,80 L 100,80 Q 80,80 80,100 L 80,160" stroke="#7a7a8c" stroke-width="3" fill="none"/>
            <!-- Linhas amarelas dividindo -->
            <line x1="-160" y1="0" x2="-80" y2="0" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <line x1="80" y1="0" x2="160" y2="0" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <line x1="0" y1="-160" x2="0" y2="-80" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <line x1="0" y1="80" x2="0" y2="160" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <!-- Faixas de Pedestres (Avançadas) -->
            <line x1="-110" y1="-75" x2="-110" y2="75" stroke="#ffffff" stroke-width="12" stroke-dasharray="12,8" opacity="0.85"/>
            <line x1="110" y1="-75" x2="110" y2="75" stroke="#ffffff" stroke-width="12" stroke-dasharray="12,8" opacity="0.85"/>
            <line x1="-75" y1="-110" x2="75" y2="-110" stroke="#ffffff" stroke-width="12" stroke-dasharray="12,8" opacity="0.85"/>
            <line x1="-75" y1="110" x2="75" y2="110" stroke="#ffffff" stroke-width="12" stroke-dasharray="12,8" opacity="0.85"/>
        `,
        paintable: false
    },
    'road-roundabout': {
        name: 'Rotatória',
        category: 'road',
        width: 480,
        height: 480,
        svg: `
            <!-- Conexões de pistas (Estrutura em cruz) -->
            <rect x="-240" y="-80" width="480" height="160" fill="#2c2c35"/>
            <rect x="-80" y="-240" width="160" height="480" fill="#2c2c35"/>
            <!-- Guias externas das conexões -->
            <line x1="-240" y1="-80" x2="-160" y2="-80" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-240" y1="80" x2="-160" y2="80" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="160" y1="-80" x2="240" y2="-80" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="160" y1="80" x2="240" y2="80" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-80" y1="-240" x2="-80" y2="-160" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="80" y1="-240" x2="80" y2="-160" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-80" y1="160" x2="-80" y2="240" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="80" y1="160" x2="80" y2="240" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas amarelas das conexões -->
            <line x1="-240" y1="0" x2="-160" y2="0" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <line x1="160" y1="0" x2="240" y2="0" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <line x1="0" y1="-240" x2="0" y2="-160" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <line x1="0" y1="160" x2="0" y2="240" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <!-- Corpo circular da rotatória -->
            <circle cx="0" cy="0" r="170" fill="#2c2c35" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Ilha central verde com guias elevadas -->
            <circle cx="0" cy="0" r="85" fill="#2e7d32" stroke="#8a8a9e" stroke-width="6"/>
            <!-- Detalhe da grama interna -->
            <circle cx="0" cy="0" r="80" fill="#388e3c"/>
            <!-- Faixas circulares internas (Linhas tracejadas brancas) -->
            <circle cx="0" cy="0" r="128" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="15,10" opacity="0.8"/>
            <!-- Ilhas direcionais de canalização simples nas entradas -->
            <path d="M-150,-30 L-110,0 L-150,30 Z" fill="#3e3e4a" stroke="#7a7a8c" stroke-width="2" opacity="0.5"/>
            <path d="M150,-30 L110,0 L150,30 Z" fill="#3e3e4a" stroke="#7a7a8c" stroke-width="2" opacity="0.5"/>
            <path d="M-30,-150 L0,-110 L30,-150 Z" fill="#3e3e4a" stroke="#7a7a8c" stroke-width="2" opacity="0.5"/>
            <path d="M-30,150 L0,110 L30,150 Z" fill="#3e3e4a" stroke="#7a7a8c" stroke-width="2" opacity="0.5"/>
        `,
        paintable: false
    },
    'road-roundabout-3way': {
        name: 'Rotatória 3 Vias',
        category: 'road',
        width: 480,
        height: 480,
        svg: `
            <!-- Asfalto (Estrutura em T) -->
            <rect x="-240" y="-80" width="480" height="160" fill="#2c2c35"/>
            <rect x="-80" y="80" width="160" height="160" fill="#2c2c35"/>
            
            <!-- Guias externas (Meio-fio) -->
            <!-- Topo contínuo (já que não há via superior) -->
            <line x1="-240" y1="-80" x2="240" y2="-80" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Laterais inferiores das vias horizontais -->
            <line x1="-240" y1="80" x2="-160" y2="80" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="160" y1="80" x2="240" y2="80" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Guias da via vertical inferior -->
            <line x1="-80" y1="160" x2="-80" y2="240" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="80" y1="160" x2="80" y2="240" stroke="#7a7a8c" stroke-width="3"/>
            
            <!-- Linhas de bordo brancas -->
            <line x1="-240" y1="-74" x2="240" y2="-74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="-240" y1="74" x2="-160" y2="74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="160" y1="74" x2="240" y2="74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="-74" y1="160" x2="-74" y2="240" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="74" y1="160" x2="74" y2="240" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>

            <!-- Linhas amarelas contínuas das conexões (Entradas) -->
            <line x1="-240" y1="0" x2="-160" y2="0" stroke="#ffd54f" stroke-width="2.5"/>
            <line x1="160" y1="0" x2="240" y2="0" stroke="#ffd54f" stroke-width="2.5"/>
            <line x1="0" y1="160" x2="0" y2="240" stroke="#ffd54f" stroke-width="2.5"/>
            
            <!-- Corpo circular da rotatória -->
            <circle cx="0" cy="0" r="170" fill="#2c2c35" stroke="#7a7a8c" stroke-width="3"/>
            
            <!-- Ilha central verde com guias elevadas -->
            <circle cx="0" cy="0" r="85" fill="#2e7d32" stroke="#8a8a9e" stroke-width="6"/>
            <!-- Detalhe da grama interna -->
            <circle cx="0" cy="0" r="80" fill="#388e3c"/>
            
            <!-- FAIXA CONTÍNUA AMARELA circular interna -->
            <circle cx="0" cy="0" r="128" fill="none" stroke="#ffd54f" stroke-width="3" opacity="0.95"/>
            
            <!-- Ilhas direcionais de canalização nas 3 entradas -->
            <path d="M-150,-30 L-110,0 L-150,30 Z" fill="#3e3e4a" stroke="#7a7a8c" stroke-width="2" opacity="0.5"/>
            <path d="M150,-30 L110,0 L150,30 Z" fill="#3e3e4a" stroke="#7a7a8c" stroke-width="2" opacity="0.5"/>
            <path d="M-30,150 L0,110 L30,150 Z" fill="#3e3e4a" stroke="#7a7a8c" stroke-width="2" opacity="0.5"/>
        `,
        paintable: false
    },
    'road-t-junction': {
        name: 'Entroncamento T',
        category: 'road',
        width: 320,
        height: 240,
        svg: `
            <!-- Asfalto -->
            <path d="M-160,-80 L160,-80 L160,80 L80,80 L80,160 L-80,160 L-80,80 L-160,80 Z" fill="#2c2c35"/>
            <!-- Calçadas nos cantos e topo -->
            <rect x="-160" y="-105" width="320" height="25" fill="#3e3e4a" opacity="0.3"/>
            <path d="M -160,160 L -80,160 L -80,100 Q -80,80 -100,80 L -160,80 Z" fill="#3e3e4a" opacity="0.3"/>
            <path d="M 160,160 L 80,160 L 80,100 Q 80,80 100,80 L 160,80 Z" fill="#3e3e4a" opacity="0.3"/>
            <!-- Meio-fio -->
            <line x1="-160" y1="-80" x2="160" y2="-80" stroke="#7a7a8c" stroke-width="3"/>
            <path d="M -160,80 L -100,80 Q -80,80 -80,100 L -80,160" stroke="#7a7a8c" stroke-width="3" fill="none"/>
            <path d="M 160,80 L 100,80 Q 80,80 80,100 L 80,160" stroke="#7a7a8c" stroke-width="3" fill="none"/>
            <!-- Linhas divisórias amarelas -->
            <line x1="-160" y1="0" x2="-40" y2="0" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <line x1="40" y1="0" x2="160" y2="0" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <line x1="0" y1="80" x2="0" y2="160" stroke="#ffd54f" stroke-width="2" stroke-dasharray="10,6"/>
            <!-- Faixa de pedestres na via de baixo -->
            <line x1="-75" y1="110" x2="75" y2="110" stroke="#ffffff" stroke-width="12" stroke-dasharray="12,8" opacity="0.85"/>
        `,
        paintable: false
    },
    'road-t-junction-island': {
        name: 'T com Ilha',
        category: 'road',
        width: 320,
        height: 240,
        svg: `
            <!-- Asfalto -->
            <path d="M-160,-80 L160,-80 L160,80 L80,80 L80,160 L-80,160 L-80,80 L-160,80 Z" fill="#2c2c35"/>
            <!-- Calçadas nos cantos e topo -->
            <rect x="-160" y="-105" width="320" height="25" fill="#3e3e4a" opacity="0.3"/>
            <path d="M -160,160 L -80,160 L -80,100 Q -80,80 -100,80 L -160,80 Z" fill="#3e3e4a" opacity="0.3"/>
            <path d="M 160,160 L 80,160 L 80,100 Q 80,80 100,80 L 160,80 Z" fill="#3e3e4a" opacity="0.3"/>
            <!-- Meio-fio -->
            <line x1="-160" y1="-80" x2="160" y2="-80" stroke="#7a7a8c" stroke-width="3"/>
            <path d="M -160,80 L -100,80 Q -80,80 -80,100 L -80,160" stroke="#7a7a8c" stroke-width="3" fill="none"/>
            <path d="M 160,80 L 100,80 Q 80,80 80,100 L 80,160" stroke="#7a7a8c" stroke-width="3" fill="none"/>
            
            <!-- Linhas de bordo brancas -->
            <line x1="-160" y1="-74" x2="160" y2="-74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <path d="M-160,74 L-100,74 Q-74,74 -74,100 L-74,160" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <path d="M160,74 L100,74 Q74,74 74,100 L74,160" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>

            <!-- Linhas divisórias amarelas na via principal -->
            <line x1="-160" y1="0" x2="-60" y2="0" stroke="#ffd54f" stroke-width="2"/>
            <line x1="60" y1="0" x2="160" y2="0" stroke="#ffd54f" stroke-width="2"/>
            
            <!-- Canalização Pintada no asfalto da via principal (Zebrado Amarelo - Diamond) -->
            <polygon points="-60,0 0,-14 60,0 0,14" fill="#2c2c35" stroke="#ffd54f" stroke-width="2" />
            <g stroke="#ffd54f" stroke-width="2" opacity="0.8">
                <line x1="-45" y1="-3.5" x2="-35" y2="5.8" />
                <line x1="-30" y1="-7" x2="-20" y2="9.3" />
                <line x1="-15" y1="-10.5" x2="-5" y2="12.8" />
                <line x1="0" y1="-14" x2="10" y2="11.6" />
                <line x1="15" y1="-10.5" x2="25" y2="8.1" />
                <line x1="30" y1="-7" x2="40" y2="4.6" />
            </g>

            <!-- Ilha de trânsito física (canteiro central de grama) no acesso perpendicular -->
            <path d="M 0,84 C 18,102 18,160 18,160 L -18,160 C -18,160 -18,102 0,84 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M 0,88 C 14,104 14,156 14,156 L -14,156 C -14,156 -14,104 0,88 Z" fill="#388e3c" />

            <!-- Sinalização horizontal de setas direcionais nas faixas do acesso -->
            <!-- Faixa da direita: entrada no cruzamento (aponta para cima) -->
            <path d="M 45,145 L 45,120 M 41,128 L 45,120 L 49,128" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
            <!-- Faixa da esquerda: saída do cruzamento (aponta para baixo) -->
            <path d="M -45,120 L -45,145 M -49,137 L -45,145 L -41,137" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
        `,
        paintable: false
    },
    'road-u-turn-pocket': {
        name: 'Recuo de Retorno',
        category: 'road',
        width: 320,
        height: 240,
        svg: `
            <!-- Asfalto -->
            <rect x="-160" y="-120" width="320" height="240" fill="#2c2c35"/>
            <!-- Calçada -->
            <rect x="-160" y="-135" width="320" height="15" fill="#3e3e4a" opacity="0.4"/>
            <rect x="-160" y="120" width="320" height="15" fill="#3e3e4a" opacity="0.4"/>
            <!-- Guias (Meio-Fio) -->
            <line x1="-160" y1="-120" x2="160" y2="-120" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-160" y1="120" x2="160" y2="120" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas de Bordo (Laterais Brancas) -->
            <line x1="-160" y1="-114" x2="160" y2="-114" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="-160" y1="114" x2="160" y2="114" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            
            <!-- Canteiros Centrais Verdes -->
            <!-- Esquerdo (Estreito para deixar espaço para a faixa de retorno) -->
            <path d="M-160,-25 L-60,-25 Q-45,-25 -45,-10 Q-45,5 -60,5 L-160,5 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M-158,-21 L-60,-21 Q-49,-21 -49,-10 Q-49,1 -60,1 L-158,1 Z" fill="#388e3c"/>
            <!-- Direito -->
            <path d="M160,-25 L60,-25 Q45,-25 45,0 Q45,25 60,25 L160,25 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M158,-21 L60,-21 Q49,-21 49,0 Q49,21 60,21 L158,21 Z" fill="#388e3c"/>
            
            <!-- Linhas de Faixas das pistas principais -->
            <line x1="-160" y1="-72" x2="160" y2="-72" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="10,8" opacity="0.7"/>
            <line x1="-160" y1="72" x2="160" y2="72" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="10,8" opacity="0.7"/>
            
            <!-- Linhas divisórias da faixa de retorno -->
            <line x1="-140" y1="25" x2="-70" y2="25" stroke="#ffffff" stroke-width="1.8" stroke-dasharray="8,5" opacity="0.8"/>
            <line x1="-70" y1="25" x2="-45" y2="25" stroke="#ffffff" stroke-width="1.8" opacity="0.8"/>
            
            <!-- Canalização virtual (linha guia de conversão) -->
            <path d="M-45,15 A 35,35 0 0,0 -45,-55" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.6"/>
            
            <!-- Setas direcionais estéticas de fluxo -->
            <path d="M 40,-96 L 20,-96 M 28,-100 L 20,-96 L 28,-92" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <path d="M 40,-48 L 20,-48 M 28,-52 L 20,-48 L 28,-44" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <path d="M -40,48 L -20,48 M -28,44 L -20,48 L -28,52" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <path d="M -40,96 L -20,96 M -28,92 L -20,96 L -28,100" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            
            <!-- Seta de retorno pintada no asfalto do recuo -->
            <g transform="translate(-75, 12) rotate(90) scale(0.65)" fill="#ffffff" opacity="0.85">
                <path d="M 8,25 L 8,-8 C 8,-18 -12,-18 -12,-8 L -12,-2 L -18,-2 L -10,8 L -2,-2 L -8,-2 L -8,-8 C -8,-12 0,-12 0,-8 L 0,25 Z"/>
            </g>
        `,
        paintable: false
    },
    'road-u-turn-single': {
        name: 'Retorno 180° (1 Via)',
        category: 'road',
        width: 240,
        height: 240,
        svg: `
            <!-- Asfalto em U-Shape -->
            <path d="M -120,120 L -120,0 A 120,120 0 0,1 120,0 L 120,120 L 40,120 L 40,0 A 40,40 0 0,0 -40,0 L -40,120 Z" fill="#2c2c35"/>
            <!-- Calçadas Externas -->
            <path d="M -120,120 L -120,0 A 120,120 0 0,1 120,0 L 120,120 L 135,120 L 135,0 A 135,135 0 0,0 -135,0 L -135,120 Z" fill="#3e3e4a" opacity="0.4"/>
            <!-- Calçada Interna (Ilha Central) -->
            <path d="M -40,120 L -40,0 A 40,40 0 0,1 40,0 L 40,120 L 25,120 L 25,0 A 25,25 0 0,0 -25,0 L -25,120 Z" fill="#3e3e4a" opacity="0.4"/>
            <!-- Meio-fio Externo -->
            <path d="M -120,120 L -120,0 A 120,120 0 0,1 120,0 L 120,120" fill="none" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Meio-fio Interno -->
            <path d="M -40,120 L -40,0 A 40,40 0 0,1 40,0 L 40,120" fill="none" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas de Bordo Brancas -->
            <path d="M -114,120 L -114,0 A 114,114 0 0,1 114,0 L 114,120" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <path d="M -46,120 L -46,0 A 46,46 0 0,1 46,0 L 46,120" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <!-- Setas Indicativas de Fluxo (Entra pela direita, sai pela esquerda) -->
            <g fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.6">
                <!-- Direita (Entrada - Sobe) -->
                <path d="M 80,80 L 80,45 M 74,55 L 80,45 L 86,55" />
                <!-- Esquerda (Saída - Desce) -->
                <path d="M -80,45 L -80,80 M -86,70 L -80,80 L -74,70" />
            </g>
        `,
        paintable: false
    },
    'road-u-turn-lane': {
        name: 'Faixa de Retorno',
        category: 'road',
        width: 240,
        height: 80,
        svg: `
            <!-- Asfalto -->
            <rect x="-120" y="-40" width="240" height="80" fill="#2c2c35"/>
            <!-- Linhas de Bordo -->
            <line x1="-120" y1="-34" x2="120" y2="-34" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="12,10" opacity="0.7"/>
            <line x1="-120" y1="34" x2="120" y2="34" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <!-- Seta de Retorno Central -->
            <g transform="translate(0, 0) scale(0.65)" fill="#ffffff" opacity="0.85">
                <path d="M 8,25 L 8,-8 C 8,-18 -12,-18 -12,-8 L -12,-2 L -18,-2 L -10,8 L -2,-2 L -8,-2 L -8,-8 C -8,-12 0,-12 0,-8 L 0,25 Z"/>
            </g>
        `,
        paintable: false
    },
    'structure-median-grass': {
        name: 'Canteiro Central',
        category: 'structure',
        width: 240,
        height: 40,
        svg: `
            <!-- Meio-fio de concreto -->
            <rect x="-120" y="-20" width="240" height="40" rx="4" fill="#3e3e4a" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Gramado -->
            <rect x="-116" y="-16" width="232" height="32" rx="2" fill="#2e7d32"/>
            <!-- Textura / Detalhes de vegetação -->
            <rect x="-112" y="-12" width="224" height="24" rx="1.5" fill="#388e3c"/>
            <circle cx="-70" cy="-3" r="2.5" fill="#2e7d32" opacity="0.7"/>
            <circle cx="-30" cy="4" r="1.8" fill="#2e7d32" opacity="0.7"/>
            <circle cx="20" cy="-2" r="2.2" fill="#2e7d32" opacity="0.7"/>
            <circle cx="70" cy="3" r="2.5" fill="#2e7d32" opacity="0.7"/>
        `,
        paintable: false
    },
    'road-u-turn-45': {
        name: 'Retorno 45°',
        category: 'road',
        width: 320,
        height: 240,
        svg: `
            <!-- Asfalto Principal -->
            <rect x="-160" y="-120" width="320" height="240" fill="#2c2c35"/>
            <!-- Calçadas Externas -->
            <rect x="-160" y="-135" width="320" height="15" fill="#3e3e4a" opacity="0.4"/>
            <rect x="-160" y="120" width="320" height="15" fill="#3e3e4a" opacity="0.4"/>
            <!-- Guias Externas (Meio-Fio) -->
            <line x1="-160" y1="-120" x2="160" y2="-120" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-160" y1="120" x2="160" y2="120" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas de Bordo Laterais -->
            <line x1="-160" y1="-114" x2="160" y2="-114" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="-160" y1="114" x2="160" y2="114" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            
            <!-- Faixas pontilhadas das vias principais -->
            <line x1="-160" y1="-70" x2="160" y2="-70" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="10,8" opacity="0.5"/>
            <line x1="-160" y1="70" x2="160" y2="70" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="10,8" opacity="0.5"/>
            
            <!-- Medians com Abertura Diagonal de 45° -->
            <!-- Canteiro Esquerdo -->
            <path d="M -160,-20 L -15,-20 L -55,20 L -160,20 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M -158,-16 L -19,-16 L -53,16 L -158,16 Z" fill="#388e3c"/>
            <!-- Canteiro Direito -->
            <path d="M 160,-20 L 45,-20 L 5,20 L 160,20 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M 158,-16 L 41,-16 L 9,16 L 158,16 Z" fill="#388e3c"/>
            
            <!-- Linhas Guia da Faixa de Retorno Diagonal -->
            <line x1="-10" y1="-20" x2="-50" y2="20" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
            <line x1="40" y1="-20" x2="0" y2="20" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
            
            <!-- Setas Indicativas nas Vias Principais -->
            <!-- Topo (Esquerda para Direita) -->
            <path d="M -90,-95 L -75,-95 M -82,-99 L -75,-95 L -82,-91" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <path d="M 90,-45 L 105,-45 M 98,-49 L 105,-45 L 98,-41" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <!-- Baixo (Direita para Esquerda) -->
            <path d="M -90,45 L -105,45 M -98,41 L -105,45 L -98,49" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <path d="M 90,95 L 75,95 M 82,91 L 75,95 L 82,99" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            
            <!-- Seta na Pista de Retorno Diagonal (Angulada) -->
            <g transform="translate(15, 0) rotate(225) scale(0.6)" fill="#ffffff" opacity="0.85">
                <path d="M-4,25 L4,25 L4,-5 L10,-5 L0,-25 L-10,-5 L-4,-5 Z"/>
            </g>
        `,
        paintable: false
    },
    'road-u-turn-45-single': {
        name: 'Retorno 45° (1 Via/Lado)',
        category: 'road',
        width: 320,
        height: 160,
        svg: `
            <!-- Asfalto Principal -->
            <rect x="-160" y="-80" width="320" height="160" fill="#2c2c35"/>
            <!-- Calçadas Externas -->
            <rect x="-160" y="-95" width="320" height="15" fill="#3e3e4a" opacity="0.4"/>
            <rect x="-160" y="80" width="320" height="15" fill="#3e3e4a" opacity="0.4"/>
            <!-- Guias Externas (Meio-Fio) -->
            <line x1="-160" y1="-80" x2="160" y2="-80" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-160" y1="80" x2="160" y2="80" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas de Bordo Laterais -->
            <line x1="-160" y1="-74" x2="160" y2="-74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="-160" y1="74" x2="160" y2="74" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            
            <!-- Medians com Abertura Diagonal de 45° -->
            <!-- Canteiro Esquerdo -->
            <path d="M -160,-20 L -15,-20 L -55,20 L -160,20 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M -158,-16 L -19,-16 L -53,16 L -158,16 Z" fill="#388e3c"/>
            <!-- Canteiro Direito -->
            <path d="M 160,-20 L 45,-20 L 5,20 L 160,20 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M 158,-16 L 41,-16 L 9,16 L 158,16 Z" fill="#388e3c"/>
            
            <!-- Linhas Guia da Faixa de Retorno Diagonal -->
            <line x1="-10" y1="-20" x2="-50" y2="20" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
            <line x1="40" y1="-20" x2="0" y2="20" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
            
            <!-- Seta na Pista de Retorno Diagonal (Angulada) -->
            <g transform="translate(15, 0) rotate(225) scale(0.6)" fill="#ffffff" opacity="0.85">
                <path d="M-4,25 L4,25 L4,-5 L10,-5 L0,-25 L-10,-5 L-4,-5 Z"/>
            </g>
        `,
        paintable: false
    },
    'road-u-turn-90': {
        name: 'Retorno 90°',
        category: 'road',
        width: 320,
        height: 240,
        svg: `
            <!-- Asfalto Principal -->
            <rect x="-160" y="-120" width="320" height="240" fill="#2c2c35"/>
            <!-- Calçadas Externas -->
            <rect x="-160" y="-135" width="320" height="15" fill="#3e3e4a" opacity="0.4"/>
            <rect x="-160" y="120" width="320" height="15" fill="#3e3e4a" opacity="0.4"/>
            <!-- Guias Externas (Meio-Fio) -->
            <line x1="-160" y1="-120" x2="160" y2="-120" stroke="#7a7a8c" stroke-width="3"/>
            <line x1="-160" y1="120" x2="160" y2="120" stroke="#7a7a8c" stroke-width="3"/>
            <!-- Linhas de Bordo Laterais -->
            <line x1="-160" y1="-114" x2="160" y2="-114" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            <line x1="-160" y1="114" x2="160" y2="114" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>
            
            <!-- Faixas pontilhadas das vias principais -->
            <line x1="-160" y1="-70" x2="160" y2="-70" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="10,8" opacity="0.5"/>
            <line x1="-160" y1="70" x2="160" y2="70" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="10,8" opacity="0.5"/>
            
            <!-- Medians com Abertura Perpendicular de 90° -->
            <!-- Canteiro Esquerdo -->
            <path d="M -160,-20 L -30,-20 L -30,20 L -160,20 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M -158,-16 L -34,-16 L -34,16 L -158,16 Z" fill="#388e3c"/>
            <!-- Canteiro Direito -->
            <path d="M 160,-20 L 30,-20 L 30,20 L 160,20 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M 158,-16 L 34,-16 L 34,16 L 158,16 Z" fill="#388e3c"/>
            
            <!-- Linhas Guia da Faixa de Retorno Vertical -->
            <line x1="-30" y1="-20" x2="-30" y2="20" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
            <line x1="30" y1="-20" x2="30" y2="20" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
            
            <!-- Setas Indicativas nas Vias Principais -->
            <!-- Topo (Esquerda para Direita) -->
            <path d="M -90,-95 L -75,-95 M -82,-99 L -75,-95 L -82,-91" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <path d="M 90,-45 L 105,-45 M 98,-49 L 105,-45 L 98,-41" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <!-- Baixo (Direita para Esquerda) -->
            <path d="M -90,45 L -105,45 M -98,41 L -105,45 L -98,49" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            <path d="M 90,95 L 75,95 M 82,91 L 75,95 L 82,99" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.4"/>
            
            <!-- Seta de Retorno (U-Turn 180° mas disposta para fazer retorno na abertura) -->
            <g transform="translate(0, 0) rotate(90) scale(0.65)" fill="#ffffff" opacity="0.85">
                <path d="M 8,25 L 8,-8 C 8,-18 -12,-18 -12,-8 L -12,-2 L -18,-2 L -10,8 L -2,-2 L -8,-2 L -8,-8 C -8,-12 0,-12 0,-8 L 0,25 Z"/>
            </g>
        `,
        paintable: false
    },
    'road-crosswalk': {
        name: 'Faixa Pedestres',
        category: 'road',
        width: 160,
        height: 160,
        svg: `
            <!-- Transparente, serve para colocar em cima de qualquer pista -->
            <rect x="-80" y="-80" width="160" height="160" fill="none"/>
            <g opacity="0.9">
                <rect x="-70" y="-60" width="16" height="120" fill="#ffffff" rx="1"/>
                <rect x="-44" y="-60" width="16" height="120" fill="#ffffff" rx="1"/>
                <rect x="-18" y="-60" width="16" height="120" fill="#ffffff" rx="1"/>
                <rect x="8" y="-60" width="16" height="120" fill="#ffffff" rx="1"/>
                <rect x="34" y="-60" width="16" height="120" fill="#ffffff" rx="1"/>
                <rect x="60" y="-60" width="16" height="120" fill="#ffffff" rx="1"/>
            </g>
        `,
        paintable: false
    },

    // --- CATEGORIA: SINALIZAÇÃO ---
    'sign-stop': {
        name: 'Placa PARE',
        category: 'sign',
        width: 44,
        height: 80,
        svg: `
            <!-- Haste/Poste cinza da placa -->
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <!-- Sombra da placa octogonal -->
            <polygon points="-19,-8 -8,-19 8,-19 19,-8 19,8 8,19 -8,19 -19,8" fill="#111115" opacity="0.3" transform="translate(1, 2)"/>
            <!-- Placa Octogonal Vermelha -->
            <polygon points="-18,-7 -7,-18 7,-18 18,-7 18,7 7,18 -7,18 -18,7" fill="#d32f2f" stroke="#ffffff" stroke-width="1.8"/>
            <!-- Texto PARE -->
            <text x="0" y="5" font-family="'Outfit', sans-serif" font-weight="900" font-size="10.5" fill="#ffffff" text-anchor="middle">PARE</text>
        `,
        paintable: false
    },
    'sign-no-left-turn': {
        name: 'Proibido Esquerda (R-4a)',
        category: 'sign',
        width: 44,
        height: 80,
        svg: `
            <!-- Haste/Poste cinza da placa -->
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <!-- Sombra da placa circular -->
            <circle cx="1" cy="2" r="19" fill="#111115" opacity="0.3"/>
            <!-- Placa Redonda R-4a -->
            <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#d32f2f" stroke-width="3.5"/>
            <!-- Seta para a Esquerda -->
            <g transform="translate(0, 0)">
                <!-- Haste da seta curvando para a esquerda -->
                <path d="M 5,8 L 5,-2 A 5,5 0 0,0 0,-7 L -6,-7" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="square"/>
                <!-- Cabeça da seta -->
                <polygon points="-5,-10.5 -10,-7 -5,-3.5" fill="#000000"/>
            </g>
            <!-- Faixa vermelha de proibição -->
            <line x1="-12.7" y1="-12.7" x2="12.7" y2="12.7" stroke="#d32f2f" stroke-width="3.5"/>
        `,
        paintable: false
    },
    'marking-stop-horizontal': {
        name: 'PARE no Asfalto',
        category: 'sign',
        width: 120,
        height: 80,
        svg: `
            <rect x="-60" y="-40" width="120" height="80" fill="none"/>
            <!-- Faixa de Retenção Branca Espessa -->
            <rect x="-50" y="-30" width="100" height="10" fill="#ffffff" opacity="0.9"/>
            <!-- Texto PARE Distorcido/Alongado Verticalmente (Perspectiva real de trânsito) -->
            <g transform="translate(0, 10) scale(0.9, 2.5)">
                <text x="0" y="3" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle" letter-spacing="1">PARE</text>
            </g>
        `,
        paintable: false
    },
    'marking-arrow-straight': {
        name: 'Seta Reta',
        category: 'sign',
        width: 24,
        height: 60,
        svg: `
            <rect x="-12" y="-30" width="24" height="60" fill="none"/>
            <!-- Corpo e ponta da seta branca -->
            <path d="M-4,25 L4,25 L4,-5 L10,-5 L0,-25 L-10,-5 L-4,-5 Z" fill="#ffffff" opacity="0.85"/>
        `,
        paintable: false
    },
    'marking-arrow-turn': {
        name: 'Seta Curva',
        category: 'sign',
        width: 40,
        height: 60,
        svg: `
            <rect x="-20" y="-30" width="40" height="60" fill="none"/>
            <!-- Seta curva para a direita (girável para a esquerda) -->
            <path d="M-5,25 L3,25 L3,2 C3,-2 5,-5 9,-5 L9,-1 L17,-7 L9,-13 L9,-9 C2,-9 -5,-4 -5,25 Z" fill="#ffffff" opacity="0.85"/>
        `,
        paintable: false
    },
    'marking-arrow-u-turn': {
        name: 'Seta de Retorno',
        category: 'sign',
        width: 40,
        height: 60,
        svg: `
            <rect x="-20" y="-30" width="40" height="60" fill="none" pointer-events="all"/>
            <path class="paintable-element" d="M 8,25 L 8,-8 C 8,-18 -12,-18 -12,-8 L -12,-2 L -18,-2 L -10,8 L -2,-2 L -8,-2 L -8,-8 C -8,-12 0,-12 0,-8 L 0,25 Z" fill="#ffffff" opacity="0.85"/>
        `,
        paintable: true,
        defaultColor: '#ffffff'
    },
    'marking-channel-triangular': {
        name: 'Canalização Triangular',
        category: 'sign',
        width: 120,
        height: 100,
        svg: `
            <!-- Fundo transparente para seleção -->
            <polygon points="-60,45 60,45 0,-45" fill="none" stroke="none" pointer-events="all"/>
            <!-- Linha de contorno (borda) -->
            <polygon class="paintable-element" points="-55,42 55,42 0,-38" fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>
            <!-- Faixas zebradas internas -->
            <g class="paintable-element" stroke="#ffffff" stroke-width="3" opacity="0.9" stroke-linecap="round">
                <line x1="-38" y1="36" x2="-22" y2="16"/>
                <line x1="-28" y1="36" x2="-2" y2="5"/>
                <line x1="-18" y1="36" x2="18" y2="-5"/>
                <line x1="-8" y1="36" x2="30" y2="-10"/>
                <line x1="2" y1="36" x2="42" y2="16"/>
                <line x1="12" y1="36" x2="32" y2="16"/>
                <line x1="22" y1="36" x2="38" y2="20"/>
            </g>
        `,
        paintable: true,
        defaultColor: '#ffffff'
    },
    'marking-channel-triangular-yellow': {
        name: 'Canalização Triangular Amarela',
        category: 'sign',
        width: 120,
        height: 100,
        svg: `
            <!-- Fundo transparente para seleção -->
            <polygon points="-60,45 60,45 0,-45" fill="none" stroke="none" pointer-events="all"/>
            <!-- Linha de contorno (borda) -->
            <polygon class="paintable-element" points="-55,42 55,42 0,-38" fill="none" stroke="#ffd54f" stroke-width="3" stroke-linejoin="round"/>
            <!-- Faixas zebradas internas -->
            <g class="paintable-element" stroke="#ffd54f" stroke-width="3" opacity="0.9" stroke-linecap="round">
                <line x1="-38" y1="36" x2="-22" y2="16"/>
                <line x1="-28" y1="36" x2="-2" y2="5"/>
                <line x1="-18" y1="36" x2="18" y2="-5"/>
                <line x1="-8" y1="36" x2="30" y2="-10"/>
                <line x1="2" y1="36" x2="42" y2="16"/>
                <line x1="12" y1="36" x2="32" y2="16"/>
                <line x1="22" y1="36" x2="38" y2="20"/>
            </g>
        `,
        paintable: true,
        defaultColor: '#ffd54f'
    },
    'marking-channel-chevron': {
        name: 'Canalização Chevron',
        category: 'sign',
        width: 160,
        height: 40,
        svg: `
            <!-- Fundo transparente para clique -->
            <rect x="-80" y="-20" width="160" height="40" fill="none" pointer-events="all"/>
            <!-- Moldura externa pintável -->
            <rect class="paintable-element" x="-75" y="-15" width="150" height="30" fill="none" stroke="#ffffff" stroke-width="2.5" rx="2"/>
            <!-- Listras diagonais internas -->
            <g class="paintable-element" stroke="#ffffff" stroke-width="2.5" opacity="0.9" stroke-linecap="round">
                <line x1="-65" y1="10" x2="-45" y2="-10"/>
                <line x1="-45" y1="10" x2="-25" y2="-10"/>
                <line x1="-25" y1="10" x2="-5" y2="-10"/>
                <line x1="-5" y1="10" x2="15" y2="-10"/>
                <line x1="15" y1="10" x2="35" y2="-10"/>
                <line x1="35" y1="10" x2="55" y2="-10"/>
                <line x1="55" y1="10" x2="70" y2="-5"/>
            </g>
        `,
        paintable: true,
        defaultColor: '#ffffff'
    },
    'marking-channel-yellow': {
        name: 'Canalização Amarela',
        category: 'sign',
        width: 240,
        height: 40,
        svg: `
            <!-- Fundo transparente para clique -->
            <rect x="-120" y="-20" width="240" height="40" fill="none" pointer-events="all"/>
            <!-- Moldura externa pintável -->
            <rect class="paintable-element" x="-115" y="-15" width="230" height="30" fill="none" stroke="#ffd54f" stroke-width="2.5" rx="2"/>
            <!-- Listras diagonais internas -->
            <g class="paintable-element" stroke="#ffd54f" stroke-width="2.5" opacity="0.9" stroke-linecap="round">
                <line x1="-115" y1="5" x2="-100" y2="-10"/>
                <line x1="-100" y1="10" x2="-80" y2="-10"/>
                <line x1="-80" y1="10" x2="-60" y2="-10"/>
                <line x1="-60" y1="10" x2="-40" y2="-10"/>
                <line x1="-40" y1="10" x2="-20" y2="-10"/>
                <line x1="-20" y1="10" x2="0" y2="-10"/>
                <line x1="0" y1="10" x2="20" y2="-10"/>
                <line x1="20" y1="10" x2="40" y2="-10"/>
                <line x1="40" y1="10" x2="60" y2="-10"/>
                <line x1="60" y1="10" x2="80" y2="-10"/>
                <line x1="80" y1="10" x2="100" y2="-10"/>
                <line x1="100" y1="10" x2="115" y2="-5"/>
            </g>
        `,
        paintable: true,
        defaultColor: '#ffd54f'
    },
    'marking-line-dashed-white': {
        name: 'Faixa Tracejada Branca',
        category: 'sign',
        width: 240,
        height: 12,
        svg: `
            <!-- Fundo invisível para fácil seleção -->
            <rect x="-120" y="-6" width="240" height="12" fill="none" pointer-events="all"/>
            <!-- Faixa Tracejada -->
            <line class="paintable-element" x1="-120" y1="0" x2="120" y2="0" stroke="#ffffff" stroke-width="3" stroke-dasharray="15,12"/>
        `,
        paintable: true,
        defaultColor: '#ffffff'
    },
    'marking-line-dashed-yellow': {
        name: 'Faixa Tracejada Amarela',
        category: 'sign',
        width: 240,
        height: 12,
        svg: `
            <!-- Fundo invisível para fácil seleção -->
            <rect x="-120" y="-6" width="240" height="12" fill="none" pointer-events="all"/>
            <!-- Faixa Tracejada -->
            <line class="paintable-element" x1="-120" y1="0" x2="120" y2="0" stroke="#ffd54f" stroke-width="3" stroke-dasharray="15,12"/>
        `,
        paintable: true,
        defaultColor: '#ffd54f'
    },
    'marking-line-continuous-white': {
        name: 'Faixa Contínua Branca',
        category: 'sign',
        width: 240,
        height: 12,
        svg: `
            <!-- Fundo invisível para fácil seleção -->
            <rect x="-120" y="-6" width="240" height="12" fill="none" pointer-events="all"/>
            <!-- Faixa Contínua -->
            <line class="paintable-element" x1="-120" y1="0" x2="120" y2="0" stroke="#ffffff" stroke-width="3"/>
        `,
        paintable: true,
        defaultColor: '#ffffff'
    },
    'marking-line-continuous-yellow': {
        name: 'Faixa Contínua Amarela',
        category: 'sign',
        width: 240,
        height: 12,
        svg: `
            <!-- Fundo invisível para fácil seleção -->
            <rect x="-120" y="-6" width="240" height="12" fill="none" pointer-events="all"/>
            <!-- Faixa Contínua -->
            <line class="paintable-element" x1="-120" y1="0" x2="120" y2="0" stroke="#ffd54f" stroke-width="3"/>
        `,
        paintable: true,
        defaultColor: '#ffd54f'
    },
    'sign-traffic-light': {
        name: 'Semáforo',
        category: 'sign',
        width: 24,
        height: 80,
        svg: `
            <!-- Haste/Poste -->
            <line x1="0" y1="20" x2="0" y2="40" stroke="#68707a" stroke-width="3"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <!-- Caixa do Semáforo -->
            <rect x="-10" y="-30" width="20" height="52" rx="3.5" fill="#1b1b22" stroke="#374151" stroke-width="1.5"/>
            <!-- Luzes -->
            <circle cx="0" cy="-19" r="5" fill="#ff1744" filter="drop-shadow(0 0 3px #ff1744)"/> <!-- Vermelho aceso -->
            <circle cx="0" cy="-4" r="5" fill="#504500"/> <!-- Amarelo apagado -->
            <circle cx="0" cy="11" r="5" fill="#004d20"/> <!-- Verde apagado -->
            <!-- Viseiras -->
            <path d="M-8,-23 Q0,-27 8,-23" fill="none" stroke="#374151" stroke-width="1.5"/>
            <path d="M-8,-8 Q0,-12 8,-8" fill="none" stroke="#374151" stroke-width="1.5"/>
            <path d="M-8,7 Q0,3 8,7" fill="none" stroke="#374151" stroke-width="1.5"/>
        `,
        paintable: false
    },

    // --- CATEGORIA: ESTRUTURAS ---
    'structure-jersey-barrier': {
        name: 'Barreira Jersey',
        category: 'structure',
        width: 80,
        height: 18,
        svg: `
            <!-- Corpo de concreto cinza claro -->
            <rect class="paintable-element" x="-40" y="-9" width="80" height="18" rx="2" fill="#bcbccb" stroke="#77778b" stroke-width="1"/>
            <!-- Topo inclinado (3D top-down) -->
            <rect x="-35" y="-5" width="70" height="10" rx="1" fill="#cdcdde" opacity="0.8"/>
            <line x1="-40" y1="0" x2="40" y2="0" stroke="#9999aa" stroke-width="1" stroke-dasharray="6,4"/>
            <!-- Pinos de conexão extremidades -->
            <circle cx="-40" cy="0" r="2.5" fill="#555566"/>
            <circle cx="40" cy="0" r="2.5" fill="#555566"/>
        `,
        paintable: true,
        defaultColor: '#bcbccb'
    },
    'structure-delineator-yellow': {
        name: 'Delineador de Barreira',
        category: 'structure',
        width: 20,
        height: 12,
        svg: `
            <!-- Base metálica de fixação (preta) -->
            <rect x="-10" y="-5" width="20" height="3" fill="#1f2937" rx="0.5"/>
            <!-- Suporte angular / Sombra do refletor -->
            <polygon points="-8,-2 8,-2 6,4 -6,4" fill="#111827" opacity="0.5"/>
            <!-- Placa refletiva amarela -->
            <rect class="paintable-element" x="-8" y="-2" width="16" height="6" fill="#ffd54f" stroke="#d97706" stroke-width="1" rx="1"/>
            <!-- Faixa refletiva interna brilhante -->
            <rect x="-6" y="0" width="12" height="2" fill="#ffffff" opacity="0.6"/>
        `,
        paintable: true,
        defaultColor: '#ffd54f'
    },
    'structure-island-triangular': {
        name: 'Ilha Canalização',
        category: 'structure',
        width: 120,
        height: 100,
        svg: `
            <!-- Canteiro externo cinza (Meio-fio) -->
            <polygon points="-60,45 60,45 0,-45" fill="#2c2c35" stroke="#7a7a8c" stroke-width="4" stroke-linejoin="round"/>
            <!-- Interior com faixa de canalização zebrada -->
            <polygon points="-52,39 52,39 0,-39" fill="#1e1e24"/>
            <g stroke="#ffffff" stroke-width="3" opacity="0.8" stroke-linecap="round">
                <line x1="-38" y1="36" x2="-22" y2="16"/>
                <line x1="-28" y1="36" x2="-2" y2="5"/>
                <line x1="-18" y1="36" x2="18" y2="-5"/>
                <line x1="-8" y1="36" x2="30" y2="-10"/>
                <line x1="2" y1="36" x2="42" y2="16"/>
                <line x1="12" y1="36" x2="32" y2="16"/>
                <line x1="22" y1="36" x2="38" y2="20"/>
            </g>
        `,
        paintable: false
    },
    'structure-island-teardrop': {
        name: 'Ilha Direcional',
        category: 'structure',
        width: 60,
        height: 120,
        svg: `
            <!-- Formato gota (triângulo com ponta e fundo redondo) -->
            <!-- Canteiro de grama / meio-fio -->
            <path d="M0,-50 C22,-15 22,25 0,45 C-22,25 -22,-15 0,-50 Z" fill="#2e7d32" stroke="#8a8a9e" stroke-width="4" stroke-linejoin="round"/>
            <!-- Gramado texturizado -->
            <path d="M0,-44 C17,-12 17,21 0,39 C-17,21 -17,-12 0,-44 Z" fill="#388e3c"/>
            <circle cx="-5" cy="0" r="1.5" fill="#2e7d32" opacity="0.5"/>
            <circle cx="6" cy="15" r="1.2" fill="#2e7d32" opacity="0.5"/>
            <circle cx="3" cy="-18" r="1.5" fill="#2e7d32" opacity="0.5"/>
        `,
        paintable: false
    },
    'structure-cone': {
        name: 'Cone Trânsito',
        category: 'structure',
        width: 22,
        height: 22,
        svg: `
            <!-- Base quadrada preta -->
            <rect x="-10" y="-10" width="20" height="20" rx="1.5" fill="#1b1b22"/>
            <!-- Cone circular laranja -->
            <circle cx="0" cy="0" r="8" fill="#ff5722"/>
            <!-- Anel branco reflexivo -->
            <circle cx="0" cy="0" r="5" fill="#ffffff"/>
            <!-- Topo laranja -->
            <circle cx="0" cy="0" r="3" fill="#ff5722"/>
            <!-- Furo central do cone -->
            <circle cx="0" cy="0" r="1.2" fill="#000000"/>
        `,
        paintable: false
    },

    // --- CATEGORIA: VEÍCULOS ---
    'vehicle-car-sedan': {
        name: 'Carro Sedan',
        category: 'vehicle',
        width: 42,
        height: 84,
        svg: `
            <!-- Rodas pretas -->
            <rect x="-21" y="-32" width="5" height="13" fill="#111" rx="1"/>
            <rect x="16" y="-32" width="5" height="13" fill="#111" rx="1"/>
            <rect x="-21" y="20" width="5" height="13" fill="#111" rx="1"/>
            <rect x="16" y="20" width="5" height="13" fill="#111" rx="1"/>
            
            <!-- Corpo Principal -->
            <rect class="paintable-element" x="-19" y="-36" width="38" height="72" rx="9" fill="#00adb5"/>
            
            <!-- Vidros e Colunas -->
            <rect x="-16" y="-19" width="32" height="34" rx="2" fill="#1e1e24"/>
            <!-- Para-brisa Dianteiro -->
            <path d="M-15,-12 L15,-12 L12,-22 L-12,-22 Z" fill="#222730"/>
            <!-- Vidro Traseiro -->
            <path d="M-15,10 L15,10 L12,18 L-12,18 Z" fill="#222730"/>
            
            <!-- Teto (Mesmo tom do corpo) -->
            <rect class="paintable-element" x="-13" y="-10" width="26" height="20" rx="3.5" fill="#00adb5"/>
            <!-- Reflexo/Luz no teto -->
            <rect x="-13" y="-10" width="26" height="20" rx="3.5" fill="#ffffff" opacity="0.15"/>
            
            <!-- Retrovisores Laterais -->
            <rect class="paintable-element" x="-22" y="-18" width="4" height="7" rx="1" fill="#00adb5"/>
            <rect class="paintable-element" x="18" y="-18" width="4" height="7" rx="1" fill="#00adb5"/>
            
            <!-- Faróis Dianteiros -->
            <rect x="-15" y="-36" width="5" height="3" fill="#fffee0" rx="0.5"/>
            <rect x="10" y="-36" width="5" height="3" fill="#fffee0" rx="0.5"/>
            <!-- Lanternas Traseiras (Freio) -->
            <rect x="-15" y="33" width="5" height="3" fill="#ff1744" rx="0.5"/>
            <rect x="10" y="33" width="5" height="3" fill="#ff1744" rx="0.5"/>
        `,
        paintable: true,
        defaultColor: '#00adb5'
    },
    'vehicle-car-hatch': {
        name: 'Carro Hatch',
        category: 'vehicle',
        width: 42,
        height: 74,
        svg: `
            <!-- Rodas pretas -->
            <rect x="-21" y="-28" width="5" height="13" fill="#111" rx="1"/>
            <rect x="16" y="-28" width="5" height="13" fill="#111" rx="1"/>
            <rect x="-21" y="16" width="5" height="13" fill="#111" rx="1"/>
            <rect x="16" y="16" width="5" height="13" fill="#111" rx="1"/>
            
            <!-- Corpo Principal -->
            <rect class="paintable-element" x="-19" y="-32" width="38" height="64" rx="8" fill="#e53935"/>
            
            <!-- Vidros e Teto -->
            <rect x="-16" y="-16" width="32" height="31" rx="2" fill="#1e1e24"/>
            <!-- Para-brisa Dianteiro -->
            <path d="M-15,-9 L15,-9 L12,-18 L-12,-18 Z" fill="#222730"/>
            <!-- Vidro Traseiro (Mais próximo da traseira no Hatch) -->
            <path d="M-15,12 L15,12 L13,17 L-13,17 Z" fill="#222730"/>
            
            <!-- Teto -->
            <rect class="paintable-element" x="-13" y="-7" width="26" height="19" rx="3" fill="#e53935"/>
            <rect x="-13" y="-7" width="26" height="19" rx="3" fill="#ffffff" opacity="0.15"/>
            
            <!-- Retrovisores Laterais -->
            <rect class="paintable-element" x="-22" y="-14" width="4" height="7" rx="1" fill="#e53935"/>
            <rect class="paintable-element" x="18" y="-14" width="4" height="7" rx="1" fill="#e53935"/>
            
            <!-- Faróis -->
            <rect x="-15" y="-32" width="5" height="3" fill="#fffee0" rx="0.5"/>
            <rect x="10" y="-32" width="5" height="3" fill="#fffee0" rx="0.5"/>
            <rect x="-15" y="29" width="5" height="3" fill="#ff1744" rx="0.5"/>
            <rect x="10" y="29" width="5" height="3" fill="#ff1744" rx="0.5"/>
        `,
        paintable: true,
        defaultColor: '#e53935'
    },
    'vehicle-motorcycle': {
        name: 'Moto',
        category: 'vehicle',
        width: 22,
        height: 48,
        svg: `
            <!-- Rodas -->
            <rect x="-2" y="-20" width="4" height="12" fill="#111" rx="1"/>
            <rect x="-2" y="10" width="4" height="12" fill="#111" rx="1"/>
            
            <!-- Quadro e Escapamento -->
            <rect x="-3" y="-10" width="6" height="22" fill="#374151" rx="1"/>
            <line x1="3" y1="5" x2="3.5" y2="16" stroke="#9ca3af" stroke-width="1.8" stroke-linecap="round"/>
            
            <!-- Guidão -->
            <line x1="-10" y1="-10" x2="10" y2="-10" stroke="#111827" stroke-width="2.5" stroke-linecap="round"/>
            <!-- Manoplas -->
            <circle cx="-10" cy="-10" r="1.5" fill="#374151"/>
            <circle cx="10" cy="-10" r="1.5" fill="#374151"/>
            
            <!-- Tanque e Carenagem (Pintável) -->
            <path class="paintable-element" d="M-4,-12 L4,-12 L5,4 L-5,4 Z" fill="#ffeb3b" stroke="#000" stroke-width="0.5"/>
            
            <!-- Motoqueiro (Ombros e Jaqueta) -->
            <ellipse cx="0" cy="0" rx="7.5" ry="6" fill="#1e293b"/>
            <!-- Capacete (Corpo principal do veículo para controle fácil) -->
            <circle class="paintable-element" cx="0" cy="0" r="5.5" fill="#ffeb3b" stroke="#1e293b" stroke-width="0.5"/>
            <!-- Visor do Capacete -->
            <path d="M-3.5,-2.5 L3.5,-2.5 L3,-0.5 L-3,-0.5 Z" fill="#0f172a"/>
            
            <!-- Farol frontal -->
            <circle cx="0" cy="-21" r="2.2" fill="#fffee0"/>
            <!-- Lanterna traseira -->
            <rect x="-2.5" y="21" width="5" height="1.8" fill="#ff1744"/>
        `,
        paintable: true,
        defaultColor: '#ffeb3b'
    },
    'vehicle-truck': {
        name: 'Caminhão',
        category: 'vehicle',
        width: 46,
        height: 120,
        svg: `
            <!-- Rodas (Traseiras duplas) -->
            <rect x="-24" y="-45" width="5.5" height="14" fill="#111" rx="1"/>
            <rect x="18.5" y="-45" width="5.5" height="14" fill="#111" rx="1"/>
            
            <rect x="-24" y="15" width="5.5" height="14" fill="#111" rx="1"/>
            <rect x="18.5" y="15" width="5.5" height="14" fill="#111" rx="1"/>
            
            <rect x="-24" y="34" width="5.5" height="14" fill="#111" rx="1"/>
            <rect x="18.5" y="34" width="5.5" height="14" fill="#111" rx="1"/>
            
            <!-- Chassi Traseiro cinza escuro -->
            <rect x="-14" y="-20" width="28" height="74" fill="#374151" rx="1"/>
            
            <!-- Carroceria / Baú (Pintável) -->
            <rect class="paintable-element" x="-21" y="-22" width="42" height="76" rx="2" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1"/>
            <!-- Listras na Carroceria para visual 3D -->
            <line x1="-16" y1="-22" x2="-16" y2="54" stroke="#e5e7eb" stroke-width="1"/>
            <line x1="16" y1="-22" x2="16" y2="54" stroke="#e5e7eb" stroke-width="1"/>
            <line x1="0" y1="-22" x2="0" y2="54" stroke="#e5e7eb" stroke-width="1"/>
            
            <!-- Cabine Dianteira -->
            <rect x="-20" y="-55" width="40" height="34" rx="4" fill="#1e3a8a"/>
            <!-- Vidro Para-brisa -->
            <rect x="-17" y="-49" width="34" height="10" rx="1" fill="#111827"/>
            <path d="M-17,-43 L17,-43 L14,-49 L-14,-49 Z" fill="#1f2937"/>
            <!-- Teto da cabine -->
            <rect x="-14" y="-39" width="28" height="16" rx="1" fill="#1e3a8a"/>
            
            <!-- Retrovisores de Caminhão grandes -->
            <rect x="-23" y="-47" width="3" height="9" rx="1" fill="#111827"/>
            <rect x="20" y="-47" width="3" height="9" rx="1" fill="#111827"/>
            <line x1="-20" y1="-43" x2="-23" y2="-43" stroke="#111827" stroke-width="1"/>
            <line x1="20" y1="-43" x2="23" y2="-43" stroke="#111827" stroke-width="1"/>
            
            <!-- Faróis -->
            <rect x="-17" y="-55" width="5" height="3" fill="#fffee0" rx="0.5"/>
            <rect x="12" y="-55" width="5" height="3" fill="#fffee0" rx="0.5"/>
            <rect x="-20" y="52" width="6" height="3" fill="#ff1744" rx="0.5"/>
            <rect x="14" y="52" width="6" height="3" fill="#ff1744" rx="0.5"/>
        `,
        paintable: true,
        defaultColor: '#f3f4f6'
    },
    'vehicle-truck-semi': {
        name: 'Carreta Articulada',
        category: 'vehicle',
        width: 48,
        height: 160,
        svg: `
            <!-- CABINE/TRATOR (Cavalo) -->
            <g transform="translate(0, -45)">
                <!-- Rodas Dianteiras Cavalo -->
                <rect x="-23" y="-28" width="5.5" height="13" fill="#111" rx="1"/>
                <rect x="17.5" y="-28" width="5.5" height="13" fill="#111" rx="1"/>
                <!-- Rodas Traseiras Cavalo -->
                <rect x="-23" y="-2" width="5.5" height="13" fill="#111" rx="1"/>
                <rect x="17.5" y="-2" width="5.5" height="13" fill="#111" rx="1"/>
                <!-- Cabine Principal (Pintável) -->
                <rect class="paintable-element" x="-19" y="-32" width="38" height="32" rx="4" fill="#0284c7"/>
                <rect x="-16" y="-26" width="32" height="9" rx="1" fill="#111827"/>
                <path d="M-15,-20 L15,-20 L12,-26 L-12,-26 Z" fill="#222"/>
                <!-- Retrovisores Cavalo -->
                <rect x="-22" y="-24" width="3" height="8" rx="0.5" fill="#111"/>
                <rect x="19" y="-24" width="3" height="8" rx="0.5" fill="#111"/>
            </g>
            
            <!-- Braço de Engate Quinta Roda -->
            <rect x="-4" y="-45" width="8" height="14" fill="#4b5563"/>
            
            <!-- REBOQUE (Trailer) -->
            <g transform="translate(0, 15)">
                <!-- Baú Reboque -->
                <rect x="-22" y="-50" width="44" height="100" rx="3" fill="#eeeeee" stroke="#9ca3af" stroke-width="1.5"/>
                <!-- Frisos no teto do baú -->
                <line x1="-14" y1="-44" x2="-14" y2="44" stroke="#d1d5db" stroke-width="1"/>
                <line x1="-7" y1="-44" x2="-7" y2="44" stroke="#d1d5db" stroke-width="1"/>
                <line x1="0" y1="-44" x2="0" y2="44" stroke="#d1d5db" stroke-width="1"/>
                <line x1="7" y1="-44" x2="7" y2="44" stroke="#d1d5db" stroke-width="1"/>
                <line x1="14" y1="-44" x2="14" y2="44" stroke="#d1d5db" stroke-width="1"/>
                
                <!-- Rodas traseiras duplas do Reboque -->
                <rect x="-24.5" y="18" width="5.5" height="14" fill="#111" rx="1"/>
                <rect x="19" y="18" width="5.5" height="14" fill="#111" rx="1"/>
                <rect x="-24.5" y="34" width="5.5" height="14" fill="#111" rx="1"/>
                <rect x="19" y="34" width="5.5" height="14" fill="#111" rx="1"/>
                
                <!-- Para-choque e lanternas traseiras -->
                <rect x="-22" y="50" width="44" height="4" fill="#374151"/>
                <rect x="-18" y="50" width="6" height="2.5" fill="#ff1744"/>
                <rect x="12" y="50" width="6" height="2.5" fill="#ff1744"/>
            </g>
        `,
        paintable: true,
        defaultColor: '#0284c7'
    },
    'vehicle-bus': {
        name: 'Ônibus',
        category: 'vehicle',
        width: 44,
        height: 140,
        svg: `
            <!-- Rodas -->
            <rect x="-23" y="-52" width="5.5" height="15" fill="#111" rx="1"/>
            <rect x="17.5" y="-52" width="5.5" height="15" fill="#111" rx="1"/>
            <rect x="-23" y="36" width="5.5" height="15" fill="#111" rx="1"/>
            <rect x="17.5" y="36" width="5.5" height="15" fill="#111" rx="1"/>
            
            <!-- Corpo Ônibus (Pintável) -->
            <rect class="paintable-element" x="-20" y="-62" width="40" height="124" rx="7" fill="#eab308"/>
            
            <!-- Vidro Parabrisa frontal largo -->
            <path d="M-17,-55 L17,-55 L14,-60 L-14,-60 Z" fill="#111827"/>
            <rect x="-17" y="-55" width="34" height="6" rx="0.5" fill="#111827"/>
            
            <!-- Janelas laterais escuras -->
            <g fill="#1f2937">
                <rect x="-21.5" y="-42" width="2" height="12" rx="0.5"/>
                <rect x="-21.5" y="-26" width="2" height="12" rx="0.5"/>
                <rect x="-21.5" y="-10" width="2" height="12" rx="0.5"/>
                <rect x="-21.5" y="6" width="2" height="12" rx="0.5"/>
                <rect x="-21.5" y="22" width="2" height="12" rx="0.5"/>
                <rect x="-21.5" y="38" width="2" height="12" rx="0.5"/>
                
                <rect x="19.5" y="-42" width="2" height="12" rx="0.5"/>
                <rect x="19.5" y="-26" width="2" height="12" rx="0.5"/>
                <rect x="19.5" y="-10" width="2" height="12" rx="0.5"/>
                <rect x="19.5" y="6" width="2" height="12" rx="0.5"/>
                <rect x="19.5" y="22" width="2" height="12" rx="0.5"/>
                <rect x="19.5" y="38" width="2" height="12" rx="0.5"/>
            </g>
            
            <!-- Teto Clarabóias -->
            <rect x="-6" y="-20" width="12" height="14" rx="1.5" fill="#ffffff" opacity="0.25"/>
            <rect x="-6" y="10" width="12" height="14" rx="1.5" fill="#ffffff" opacity="0.25"/>
            
            <!-- Retrovisores de ônibus -->
            <rect x="-22.5" y="-55" width="2.5" height="7" rx="0.5" fill="#111"/>
            <rect x="20" y="-55" width="2.5" height="7" rx="0.5" fill="#111"/>
            
            <!-- Luzes -->
            <circle cx="-16" cy="-61" r="2" fill="#ffffff"/>
            <circle cx="16" cy="-61" r="2" fill="#ffffff"/>
            <rect x="-16" y="60.5" width="5" height="2" fill="#ff1744" rx="0.5"/>
            <rect x="11" y="60.5" width="5" height="2" fill="#ff1744" rx="0.5"/>
        `,
        paintable: true,
        defaultColor: '#eab308'
    },
    'text-label': {
        name: 'Texto Livre',
        category: 'text',
        width: 160,
        height: 40,
        svg: `
            <!-- Fundo transparente para seleção e arrastamento fácil -->
            <rect x="-80" y="-20" width="160" height="40" fill="none" pointer-events="all"/>
            <!-- Texto editável e pintável -->
            <text x="0" y="6" font-family="'Outfit', sans-serif" font-weight="700" font-size="16" fill="#ffffff" text-anchor="middle" class="text-element paintable-element">Texto</text>
        `,
        paintable: true,
        defaultColor: '#ffffff',
        textEditable: true,
        defaultText: 'Texto'
    },
    'sign-street-name': {
        name: 'Nome de Rua',
        category: 'sign',
        width: 120,
        height: 36,
        svg: `
            <!-- Placa Retangular Azul de Rua -->
            <rect class="paintable-element" x="-60" y="-18" width="120" height="36" rx="4" fill="#0d47a1" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Linha interna decorativa branca -->
            <rect x="-56" y="-14" width="112" height="28" rx="2" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.8"/>
            <!-- Texto da rua -->
            <text x="0" y="4" font-family="'Outfit', sans-serif" font-weight="600" font-size="10.5" fill="#ffffff" text-anchor="middle" class="street-text">RUA</text>
        `,
        paintable: true,
        defaultColor: '#0d47a1',
        textEditable: true,
        defaultText: 'RUA'
    },
    'sign-street-laura': {
        name: 'Placa Laura Duarte',
        category: 'sign',
        width: 220,
        height: 36,
        svg: `
            <!-- Placa Retangular Azul de Rua -->
            <rect class="paintable-element" x="-110" y="-18" width="220" height="36" rx="4" fill="#0d47a1" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Linha interna decorativa branca -->
            <rect x="-106" y="-14" width="212" height="28" rx="2" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.8"/>
            <!-- Texto da rua -->
            <text x="0" y="4" font-family="'Outfit', sans-serif" font-weight="600" font-size="10" fill="#ffffff" text-anchor="middle">Rua Laura Duarte dos Prazeres</text>
        `,
        paintable: true,
        defaultColor: '#0d47a1',
        textEditable: true,
        defaultText: 'Rua Laura Duarte dos Prazeres'
    },
    'sign-highway-sc401': {
        name: 'Placa SC-401',
        category: 'sign',
        width: 60,
        height: 60,
        svg: `
            <!-- Escudo da Rodovia SC-401 -->
            <path d="M-25,-25 L25,-25 C25,-25 25,5 25,12 C25,24 0,34 0,34 C0,34 -25,24 -25,12 C-25,5 -25,-25 -25,-25 Z" fill="#000000" opacity="0.3" transform="translate(1.5, 2)"/>
            <path class="paintable-element" d="M-25,-25 L25,-25 C25,-25 25,5 25,12 C25,24 0,34 0,34 C0,34 -25,24 -25,12 C-25,5 -25,-25 -25,-25 Z" fill="#ffffff" stroke="#111827" stroke-width="3" stroke-linejoin="round"/>
            <line x1="-23" y1="-7" x2="23" y2="-7" stroke="#111827" stroke-width="2"/>
            <text x="0" y="16" font-family="'Outfit', sans-serif" font-weight="900" font-size="19" fill="#111827" text-anchor="middle">401</text>
            <text x="0" y="-12" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#111827" text-anchor="middle">SC</text>
        `,
        paintable: true,
        defaultColor: '#ffffff',
        textEditable: true,
        defaultText: '401'
    },
    'sign-highway-sc405': {
        name: 'Placa SC-405',
        category: 'sign',
        width: 60,
        height: 60,
        svg: `
            <!-- Escudo da Rodovia SC-405 -->
            <path d="M-25,-25 L25,-25 C25,-25 25,5 25,12 C25,24 0,34 0,34 C0,34 -25,24 -25,12 C-25,5 -25,-25 -25,-25 Z" fill="#000000" opacity="0.3" transform="translate(1.5, 2)"/>
            <path class="paintable-element" d="M-25,-25 L25,-25 C25,-25 25,5 25,12 C25,24 0,34 0,34 C0,34 -25,24 -25,12 C-25,5 -25,-25 -25,-25 Z" fill="#ffffff" stroke="#111827" stroke-width="3" stroke-linejoin="round"/>
            <line x1="-23" y1="-7" x2="23" y2="-7" stroke="#111827" stroke-width="2"/>
            <text x="0" y="16" font-family="'Outfit', sans-serif" font-weight="900" font-size="19" fill="#111827" text-anchor="middle">405</text>
            <text x="0" y="-12" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#111827" text-anchor="middle">SC</text>
        `,
        paintable: true,
        defaultColor: '#ffffff',
        textEditable: true,
        defaultText: '405'
    },
    'building-atacadista': {
        name: 'Brasil Atacadista',
        category: 'building',
        width: 180,
        height: 120,
        svg: `
            <!-- Sombra do prédio -->
            <rect x="-90" y="-60" width="180" height="120" rx="6" fill="#000000" opacity="0.35" transform="translate(3, 4)"/>
            <!-- Estrutura Externa Pintável -->
            <rect class="paintable-element" x="-90" y="-60" width="180" height="120" rx="6" fill="#1e3a8a" stroke="#ffffff" stroke-width="2"/>
            <!-- Telhado Interno Cinza Escuro -->
            <rect x="-82" y="-52" width="164" height="104" rx="4" fill="#2c2c35"/>
            <!-- Linha interna de detalhe -->
            <rect x="-78" y="-48" width="156" height="96" rx="2" fill="none" stroke="#3f3f4e" stroke-width="1.5"/>
            <!-- Detalhes Estéticos de Ar Condicionado (HVAC) no teto -->
            <g fill="#4e4e5a" opacity="0.8">
                <rect x="-65" y="-35" width="16" height="16" rx="1.5"/>
                <circle cx="-57" cy="-27" r="4.5" fill="#1a1a24"/>
                <rect x="49" y="19" width="16" height="16" rx="1.5"/>
                <circle cx="57" cy="27" r="4.5" fill="#1a1a24"/>
            </g>
            <!-- Marquise de Entrada (Amarela) -->
            <path d="M-40,60 L-30,70 L30,70 L40,60 Z" fill="#ffd54f" stroke="#ffffff" stroke-width="1.2"/>
            <!-- Nome do Estabelecimento -->
            <text x="0" y="6" font-family="'Outfit', sans-serif" font-weight="800" font-size="11.5" fill="#ffffff" text-anchor="middle">Brasil Atacadista</text>
        `,
        paintable: true,
        defaultColor: '#1e3a8a',
        textEditable: true,
        defaultText: 'Brasil Atacadista'
    },
    'building-casas-agua': {
        name: 'Casas da Água',
        category: 'building',
        width: 180,
        height: 120,
        svg: `
            <!-- Sombra do prédio -->
            <rect x="-90" y="-60" width="180" height="120" rx="6" fill="#000000" opacity="0.35" transform="translate(3, 4)"/>
            <!-- Estrutura Externa Pintável -->
            <rect class="paintable-element" x="-90" y="-60" width="180" height="120" rx="6" fill="#0284c7" stroke="#ffffff" stroke-width="2"/>
            <!-- Telhado Interno Cinza Escuro -->
            <rect x="-82" y="-52" width="164" height="104" rx="4" fill="#2c2c35"/>
            <!-- Linha interna de detalhe -->
            <rect x="-78" y="-48" width="156" height="96" rx="2" fill="none" stroke="#3f3f4e" stroke-width="1.5"/>
            <!-- Detalhes Estéticos de Ar Condicionado (HVAC) no teto -->
            <g fill="#4e4e5a" opacity="0.8">
                <rect x="-65" y="-35" width="16" height="16" rx="1.5"/>
                <circle cx="-57" cy="-27" r="4.5" fill="#1a1a24"/>
                <rect x="49" y="19" width="16" height="16" rx="1.5"/>
                <circle cx="57" cy="27" r="4.5" fill="#1a1a24"/>
            </g>
            <!-- Marquise de Entrada (Vermelha) -->
            <path d="M-40,60 L-30,70 L30,70 L40,60 Z" fill="#e53935" stroke="#ffffff" stroke-width="1.2"/>
            <!-- Nome do Estabelecimento -->
            <text x="0" y="6" font-family="'Outfit', sans-serif" font-weight="800" font-size="11.5" fill="#ffffff" text-anchor="middle">Casas da Água</text>
        `,
        paintable: true,
        defaultColor: '#0284c7',
        textEditable: true,
        defaultText: 'Casas da Água'
    },
    'building-generic': {
        name: 'Estabelecimento',
        category: 'building',
        width: 180,
        height: 120,
        svg: `
            <!-- Sombra do prédio -->
            <rect x="-90" y="-60" width="180" height="120" rx="6" fill="#000000" opacity="0.35" transform="translate(3, 4)"/>
            <!-- Estrutura Externa Pintável -->
            <rect class="paintable-element" x="-90" y="-60" width="180" height="120" rx="6" fill="#475569" stroke="#ffffff" stroke-width="2"/>
            <!-- Telhado Interno Cinza Escuro -->
            <rect x="-82" y="-52" width="164" height="104" rx="4" fill="#2c2c35"/>
            <!-- Linha interna de detalhe -->
            <rect x="-78" y="-48" width="156" height="96" rx="2" fill="none" stroke="#3f3f4e" stroke-width="1.5"/>
            <!-- Detalhes Estéticos de Ar Condicionado (HVAC) no teto -->
            <g fill="#4e4e5a" opacity="0.8">
                <rect x="-65" y="-35" width="16" height="16" rx="1.5"/>
                <circle cx="-57" cy="-27" r="4.5" fill="#1a1a24"/>
                <rect x="49" y="19" width="16" height="16" rx="1.5"/>
                <circle cx="57" cy="27" r="4.5" fill="#1a1a24"/>
            </g>
            <!-- Marquise de Entrada (Cinza Escuro) -->
            <path d="M-40,60 L-30,70 L30,70 L40,60 Z" fill="#334155" stroke="#ffffff" stroke-width="1.2"/>
            <!-- Nome do Estabelecimento -->
            <text x="0" y="6" font-family="'Outfit', sans-serif" font-weight="800" font-size="11.5" fill="#ffffff" text-anchor="middle">Mercado / Loja</text>
        `,
        paintable: true,
        defaultColor: '#475569',
        textEditable: true,
        defaultText: 'Mercado / Loja'
    },
    // --- NOVAS PLACAS DE REGULAMENTAÇÃO ---
    'sign-reg-giveway': {
        name: 'Placa R-2 Preferência',
        category: 'sign-reg',
        width: 44,
        height: 80,
        svg: `
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <polygon points="0,18 -18,-15 18,-15" fill="#ffffff" stroke="#d32f2f" stroke-width="3.5" stroke-linejoin="round"/>
        `,
        paintable: false
    },
    'sign-reg-no-entry': {
        name: 'Placa R-3 Sentido Proibido',
        category: 'sign-reg',
        width: 44,
        height: 80,
        svg: `
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <circle cx="0" cy="0" r="18" fill="#d32f2f" stroke="#ffffff" stroke-width="1.5"/>
            <rect x="-12" y="-3.5" width="24" height="7" fill="#ffffff" rx="1"/>
        `,
        paintable: false
    },
    'sign-reg-no-right-turn': {
        name: 'Placa R-4b Proib. Direita',
        category: 'sign-reg',
        width: 44,
        height: 80,
        svg: `
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#d32f2f" stroke-width="3.5"/>
            <path d="M -5,8 L -5,-2 A 5,5 0 0,1 0,-7 L 6,-7" fill="none" stroke="#000000" stroke-width="3"/>
            <polygon points="5,-10 9,-7 5,-4" fill="#000000"/>
            <line x1="-12.7" y1="12.7" x2="12.7" y2="-12.7" stroke="#d32f2f" stroke-width="3.5"/>
        `,
        paintable: false
    },
    'sign-reg-speed-limit': {
        name: 'Placa R-19 Velocidade',
        category: 'sign-reg',
        width: 44,
        height: 80,
        svg: `
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#d32f2f" stroke-width="3.5"/>
            <text x="0" y="3.5" font-family="'Outfit', sans-serif" font-weight="800" font-size="11" fill="#000000" text-anchor="middle">80</text>
            <text x="0" y="11" font-family="'Outfit', sans-serif" font-weight="700" font-size="5.5" fill="#000000" text-anchor="middle">km/h</text>
        `,
        paintable: false,
        textEditable: true,
        defaultText: '80'
    },
    // --- NOVAS PLACAS DE ADVERTÊNCIA ---
    'sign-adv-curve-left': {
        name: 'Placa A-1a Curva Esq.',
        category: 'sign-adv',
        width: 46,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect x="-15" y="-15" width="30" height="30" fill="#ffd54f" stroke="#000000" stroke-width="1.8" transform="rotate(45)" rx="2"/>
            <path d="M 5,7 L 5,-2 A 4,4 0 0,0 1,-6 L -6,-6" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
            <polygon points="-4,-9 -9,-6 -4,-3" fill="#000000"/>
        `,
        paintable: false
    },
    'sign-adv-curve-right': {
        name: 'Placa A-1b Curva Dir.',
        category: 'sign-adv',
        width: 46,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect x="-15" y="-15" width="30" height="30" fill="#ffd54f" stroke="#000000" stroke-width="1.8" transform="rotate(45)" rx="2"/>
            <path d="M -5,7 L -5,-2 A 4,4 0 0,1 -1,-6 L 6,-6" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round"/>
            <polygon points="4,-9 9,-6 4,-3" fill="#000000"/>
        `,
        paintable: false
    },
    'sign-adv-stop-ahead': {
        name: 'Placa A-15 PARE à Frente',
        category: 'sign-adv',
        width: 46,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect x="-15" y="-15" width="30" height="30" fill="#ffd54f" stroke="#000000" stroke-width="1.8" transform="rotate(45)" rx="2"/>
            <polygon points="-6,2 -2,-2 2,-2 6,2 6,6 2,10 -2,10 -6,6" fill="#d32f2f" stroke="#ffffff" stroke-width="0.8"/>
            <text x="0" y="5.5" font-family="'Outfit', sans-serif" font-weight="900" font-size="3" fill="#ffffff" text-anchor="middle">PARE</text>
            <path d="M 0,-5 L 0,-11 M -3,-8 L 0,-11 L 3,-8" fill="none" stroke="#000000" stroke-width="1.8" stroke-linecap="round"/>
        `,
        paintable: false
    },
    'sign-adv-school-zone': {
        name: 'Placa A-33a Escolares',
        category: 'sign-adv',
        width: 46,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect x="-15" y="-15" width="30" height="30" fill="#ffd54f" stroke="#000000" stroke-width="1.8" transform="rotate(45)" rx="2"/>
            <g fill="#000000" transform="scale(0.8) translate(-2, -2)">
                <circle cx="-2" cy="-5" r="2.2"/>
                <path d="M-4.5,-2 L0.5,-2 L-0.5,6 L-3.5,6 Z"/>
                <circle cx="4" cy="-1" r="1.8"/>
                <path d="M2,2 L6,2 L5.5,7 L3,7 Z"/>
            </g>
        `,
        paintable: false
    },
    'sign-adv-dual-lane': {
        name: 'Placa A-42a Pista Dupla',
        category: 'sign-adv',
        width: 46,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect x="-15" y="-15" width="30" height="30" fill="#ffd54f" stroke="#000000" stroke-width="1.8" transform="rotate(45)" rx="2"/>
            <g fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round">
                <path d="M-6,8 L-6,-6 M-9,-3 L-6,-6 L-3,-3"/>
                <path d="M6,-6 L6,8 M3,5 L6,8 L9,5"/>
            </g>
            <path d="M0,-8 C3,-8 5,-5 5,-3 L-5,-3 C-5,-5 -3,-8 0,-8 Z" fill="#000000"/>
        `,
        paintable: false
    },
    // --- NOVAS PLACAS DE INDICAÇÃO & EDUCATIVAS ---
    'sign-ind-highway-br': {
        name: 'Placa Rodovia BR',
        category: 'sign-ind',
        width: 46,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <path d="M-15,-15 L15,-15 C15,-15 15,3 15,8 C15,16 0,22 0,22 C0,22 -15,16 -15,8 C-15,3 -15,-15 -15,-15 Z" fill="#ffffff" stroke="#111827" stroke-width="2"/>
            <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#111827" stroke-width="1.5"/>
            <text x="0" y="-7" font-family="'Outfit', sans-serif" font-weight="900" font-size="7" fill="#111827" text-anchor="middle">BR-101</text>
            <text x="0" y="11" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="#111827" text-anchor="middle">101</text>
        `,
        paintable: false,
        textEditable: true,
        defaultText: 'BR-101'
    },
    'sign-ind-highway-sc': {
        name: 'Placa Rodovia SC',
        category: 'sign-ind',
        width: 46,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <path d="M-15,-15 L15,-15 C15,-15 15,3 15,8 C15,16 0,22 0,22 C0,22 -15,16 -15,8 C-15,3 -15,-15 -15,-15 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
            <rect x="-15" y="-15" width="30" height="7" fill="#0d47a1"/>
            <text x="0" y="-9" font-family="'Outfit', sans-serif" font-weight="800" font-size="6" fill="#ffffff" text-anchor="middle">SC-401</text>
            <text x="0" y="10" font-family="'Outfit', sans-serif" font-weight="900" font-size="11" fill="#111827" text-anchor="middle">401</text>
        `,
        paintable: false,
        textEditable: true,
        defaultText: 'SC-401'
    },
    'sign-ind-city-name': {
        name: 'Placa Limite Município',
        category: 'sign-ind',
        width: 120,
        height: 80,
        svg: `
            <line x1="-35" y1="15" x2="-35" y2="40" stroke="#68707a" stroke-width="2.5"/>
            <line x1="35" y1="15" x2="35" y2="40" stroke="#68707a" stroke-width="2.5"/>
            <rect class="paintable-element" x="-55" y="-20" width="110" height="38" rx="3" fill="#0d47a1" stroke="#ffffff" stroke-width="1.8"/>
            <text x="0" y="-6" font-family="'Outfit', sans-serif" font-weight="800" font-size="8" fill="#ffffff" text-anchor="middle">FLORIANÓPOLIS</text>
            <line x1="-50" y1="2" x2="50" y2="2" stroke="#ffffff" stroke-width="0.8" opacity="0.8"/>
            <text x="0" y="12" font-family="'Outfit', sans-serif" font-weight="600" font-size="6.5" fill="#ffffff" text-anchor="middle">Limite de Município</text>
        `,
        paintable: true,
        defaultColor: '#0d47a1',
        textEditable: true,
        defaultText: 'FLORIANÓPOLIS'
    },
    'sign-ind-educational': {
        name: 'Placa Educativa',
        category: 'sign-ind',
        width: 140,
        height: 80,
        svg: `
            <line x1="-40" y1="15" x2="-40" y2="40" stroke="#68707a" stroke-width="2.5"/>
            <line x1="40" y1="15" x2="40" y2="40" stroke="#68707a" stroke-width="2.5"/>
            <rect class="paintable-element" x="-65" y="-20" width="130" height="38" fill="#0d47a1" stroke="#ffffff" stroke-width="2" rx="3"/>
            <text x="0" y="-4" font-family="'Outfit', sans-serif" font-weight="800" font-size="7.5" fill="#ffffff" text-anchor="middle">USE CINTO DE SEGURANÇA</text>
        `,
        paintable: true,
        defaultColor: '#0d47a1',
        textEditable: true,
        defaultText: 'USE CINTO DE SEGURANÇA'
    },
    'sign-ind-destination': {
        name: 'Placa de Destino',
        category: 'sign-ind',
        width: 130,
        height: 80,
        svg: `
            <line x1="-35" y1="15" x2="-35" y2="40" stroke="#68707a" stroke-width="2.5"/>
            <line x1="35" y1="15" x2="35" y2="40" stroke="#68707a" stroke-width="2.5"/>
            <rect class="paintable-element" x="-60" y="-20" width="120" height="38" fill="#1b5e20" stroke="#ffffff" stroke-width="1.8" rx="2"/>
            <text x="-15" y="4" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="#ffffff" text-anchor="start">CENTRO</text>
            <path d="M -42,0 L -30,0 M -36,-5 L -42,0 L -36,5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        `,
        paintable: true,
        defaultColor: '#1b5e20',
        textEditable: true,
        defaultText: 'CENTRO'
    },
    // --- NOVAS PLACAS DE SERVIÇOS AUXILIARES ---
    'sign-serv-parking': {
        name: 'Placa Estacionamento',
        category: 'sign-serv',
        width: 44,
        height: 80,
        svg: `
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect class="paintable-element" x="-15" y="-20" width="30" height="38" rx="2.5" fill="#0d47a1" stroke="#ffffff" stroke-width="1.8"/>
            <text x="0" y="7" font-family="'Outfit', sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">E</text>
        `,
        paintable: true,
        defaultColor: '#0d47a1'
    },
    'sign-serv-mechanic': {
        name: 'Placa Mecânico',
        category: 'sign-serv',
        width: 44,
        height: 80,
        svg: `
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect class="paintable-element" x="-15" y="-20" width="30" height="38" rx="2.5" fill="#0d47a1" stroke="#ffffff" stroke-width="1.8"/>
            <g fill="#ffffff" transform="translate(-10, -10) scale(0.8)">
                <path d="M19.3,2.7 C18,1.4 16,-0.1 14.5,0.4 C13,0.9 11.5,2.9 12.3,4.6 L3.7,13.2 C2.9,12.5 1.5,12.5 0.7,13.3 C-0.2,14.2 -0.2,15.7 0.7,16.5 L7.8,23.6 C8.6,24.4 10.1,24.4 11,23.6 C11.8,22.8 11.8,21.4 11.1,20.6 L19.7,12 C21.4,12.8 23.4,11.3 23.9,9.8 C24.4,8.3 22.9,6.3 21.6,5 L19.3,2.7 Z"/>
            </g>
        `,
        paintable: true,
        defaultColor: '#0d47a1'
    },
    'sign-serv-gas-station': {
        name: 'Placa Combustível',
        category: 'sign-serv',
        width: 44,
        height: 80,
        svg: `
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect class="paintable-element" x="-15" y="-20" width="30" height="38" rx="2.5" fill="#0d47a1" stroke="#ffffff" stroke-width="1.8"/>
            <path d="M-8,8 L-8,-8 C-8,-10 -6,-10 -6,-8 L-6,8 Z M-2,8 L-2,1 C-2,-1 4,-1 4,1 L4,8 Z" fill="#ffffff" transform="scale(0.8) translate(-1, -1)"/>
        `,
        paintable: true,
        defaultColor: '#0d47a1'
    },
    'sign-serv-hospital': {
        name: 'Placa Hospital',
        category: 'sign-serv',
        width: 44,
        height: 80,
        svg: `
            <line x1="0" y1="15" x2="0" y2="40" stroke="#68707a" stroke-width="3"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect class="paintable-element" x="-15" y="-20" width="30" height="38" rx="2.5" fill="#0d47a1" stroke="#ffffff" stroke-width="1.8"/>
            <rect x="-10" y="-12" width="20" height="20" fill="#ffffff" rx="1"/>
            <path d="M-3,-7 L3,-7 L3,-3 L7,-3 L7,3 L3,3 L3,7 L-3,7 L-3,3 L-7,3 L-7,-3 L-3,-3 Z" fill="#d32f2f" transform="scale(0.8)"/>
        `,
        paintable: true,
        defaultColor: '#0d47a1'
    },
    // --- NOVAS PLACAS DE TURISMO ---
    'sign-tour-beach': {
        name: 'Placa Atrativo Praia',
        category: 'sign-tour',
        width: 50,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect class="paintable-element" x="-20" y="-20" width="40" height="38" rx="3" fill="#5d4037" stroke="#ffffff" stroke-width="1.5"/>
            <text x="0" y="14" font-family="'Outfit', sans-serif" font-weight="800" font-size="5.5" fill="#ffffff" text-anchor="middle">PRAIA</text>
            <path d="M-10,-5 Q-5,-10 0,-5 Q5,-10 10,-5" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <circle cx="0" cy="-11" r="3.5" fill="#ffffff"/>
        `,
        paintable: true,
        defaultColor: '#5d4037',
        textEditable: true,
        defaultText: 'PRAIA'
    },
    'sign-tour-museum': {
        name: 'Placa Atrativo Museu',
        category: 'sign-tour',
        width: 50,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect class="paintable-element" x="-20" y="-20" width="40" height="38" rx="3" fill="#5d4037" stroke="#ffffff" stroke-width="1.5"/>
            <text x="0" y="14" font-family="'Outfit', sans-serif" font-weight="800" font-size="5.5" fill="#ffffff" text-anchor="middle">MUSEU</text>
            <polygon points="-12,-3 12,-3 0,-10" fill="#ffffff"/>
            <rect x="-10" y="-2" width="20" height="2" fill="#ffffff"/>
            <line x1="-8" y1="-2" x2="-8" y2="5" stroke="#ffffff" stroke-width="2.2"/>
            <line x1="-3" y1="-2" x2="-3" y2="5" stroke="#ffffff" stroke-width="2.2"/>
            <line x1="3" y1="-2" x2="3" y2="5" stroke="#ffffff" stroke-width="2.2"/>
            <line x1="8" y1="-2" x2="8" y2="5" stroke="#ffffff" stroke-width="2.2"/>
            <rect x="-12" y="5" width="24" height="2" fill="#ffffff"/>
        `,
        paintable: true,
        defaultColor: '#5d4037',
        textEditable: true,
        defaultText: 'MUSEU'
    },
    // --- NOVAS PLACAS DE SINALIZAÇÃO DE OBRAS ---
    'sign-works-roadwork': {
        name: 'Placa Obras Trabalhador',
        category: 'sign-works',
        width: 46,
        height: 80,
        svg: `
            <line x1="0" y1="18" x2="0" y2="40" stroke="#68707a" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="40" r="3" fill="#2d3035"/>
            <rect x="-15" y="-15" width="30" height="30" fill="#f57c00" stroke="#000000" stroke-width="1.8" transform="rotate(45)" rx="2"/>
            <g fill="#000000" transform="translate(-1, 0) scale(0.9)">
                <circle cx="0" cy="-6" r="2"/>
                <path d="M-4,-3 L2,-3 L0,3 L-3,3 Z"/>
                <line x1="1" y1="-2" x2="6" y2="4" stroke="#000000" stroke-width="1.8"/>
                <polygon points="5,3 8,6 4,6" fill="#000000"/>
            </g>
        `,
        paintable: false
    },
    'sign-works-text': {
        name: 'Placa Obras Retangular',
        category: 'sign-works',
        width: 120,
        height: 80,
        svg: `
            <line x1="-35" y1="15" x2="-35" y2="40" stroke="#68707a" stroke-width="2.5"/>
            <line x1="35" y1="15" x2="35" y2="40" stroke="#68707a" stroke-width="2.5"/>
            <rect class="paintable-element" x="-55" y="-20" width="110" height="38" fill="#f57c00" stroke="#000000" stroke-width="2" rx="3"/>
            <text x="0" y="3" font-family="'Outfit', sans-serif" font-weight="900" font-size="9" fill="#000000" text-anchor="middle">DESVIO A 100m</text>
        `,
        paintable: true,
        defaultColor: '#f57c00',
        textEditable: true,
        defaultText: 'DESVIO A 100m'
    },
    // --- NOVAS SINALIZAÇÕES HORIZONTAIS ---
    'marking-arrow-straight-turn': {
        name: 'Seta Reta e Curva',
        category: 'marking',
        width: 46,
        height: 60,
        svg: `
            <rect x="-23" y="-30" width="46" height="60" fill="none"/>
            <g fill="#ffffff" opacity="0.85">
                <path d="M-10,25 L-4,25 L-4,-5 L-7,-5 L-1,-15 L5,-5 L2,-5 L2,25 L-4,25 Z"/>
                <path d="M2,12 Q9,12 12,9 L12,12 L18,7 L12,2 L12,5 Q7,5 2,10 Z"/>
            </g>
        `,
        paintable: false
    },
    'marking-cycle-lane': {
        name: 'Símbolo Ciclofaixa',
        category: 'marking',
        width: 80,
        height: 100,
        svg: `
            <rect class="paintable-element" x="-40" y="-50" width="80" height="100" fill="#c62828" opacity="0.8"/>
            <g fill="none" stroke="#ffffff" stroke-width="2.5" transform="translate(0, 0) scale(0.8)">
                <circle cx="-12" cy="8" r="7"/>
                <circle cx="12" cy="8" r="7"/>
                <path d="M-12,8 L-2,-5 L10,-5 L12,8 M-2,-5 L6,8 M-8,-12 L-2,-5 M6,-12 L10,-5" />
            </g>
        `,
        paintable: true,
        defaultColor: '#c62828'
    },
    'marking-vaga-pcd': {
        name: 'Vaga Cadeirante',
        category: 'marking',
        width: 80,
        height: 90,
        svg: `
            <rect class="paintable-element" x="-35" y="-40" width="70" height="80" fill="#0d47a1" opacity="0.85"/>
            <rect x="-31" y="-36" width="62" height="72" fill="none" stroke="#ffffff" stroke-width="2"/>
            <g fill="#ffffff" transform="translate(0, 0) scale(0.7)">
                <circle cx="0" cy="-14" r="3.5"/>
                <path d="M-6,-4 C-6,-8 -3,-9 0,-9 C3,-9 5,-7 5,-4 L5,4 C5,6 3,7 0,7 C-3,7 -6,5 -6,2" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
                <path d="M-6,2 Q-10,2 -10,-4" fill="none" stroke="#ffffff" stroke-width="2.5"/>
            </g>
        `,
        paintable: true,
        defaultColor: '#0d47a1'
    },
    // --- NOVOS ESTABELECIMENTOS CUSTOMIZÁVEIS ---
    'building-house': {
        name: 'Casa / Residência',
        category: 'building',
        width: 120,
        height: 120,
        svg: `
            <rect x="-60" y="-60" width="120" height="120" rx="4" fill="#000000" opacity="0.3" transform="translate(3, 3)"/>
            <rect class="paintable-element" x="-50" y="-30" width="100" height="80" fill="#8d6e63" stroke="#ffffff" stroke-width="1.5" rx="3"/>
            <polygon class="paintable-element" points="-60,-30 0,-60 60,-30" fill="#a73a3a" stroke="#ffffff" stroke-width="1.5"/>
            <rect x="-35" y="-10" width="20" height="20" fill="#334155" stroke="#ffffff" stroke-width="1" rx="1"/>
            <rect x="15" y="-10" width="20" height="20" fill="#334155" stroke="#ffffff" stroke-width="1" rx="1"/>
            <rect x="-10" y="20" width="20" height="30" fill="#5d4037" stroke="#ffffff" stroke-width="1"/>
            <text x="0" y="-38" font-family="'Outfit', sans-serif" font-weight="800" font-size="8" fill="#ffffff" text-anchor="middle">Casa 12</text>
        `,
        paintable: true,
        defaultColor: '#8d6e63',
        textEditable: true,
        defaultText: 'Casa 12'
    },
    'building-gas-station': {
        name: 'Posto de Gasolina',
        category: 'building',
        width: 200,
        height: 140,
        svg: `
            <rect x="-100" y="-70" width="200" height="140" fill="#000000" opacity="0.25" rx="5" transform="translate(3, 3)"/>
            <rect class="paintable-element" x="-90" y="-60" width="180" height="40" fill="#00838f" stroke="#ffffff" stroke-width="1.5" rx="3"/>
            <text x="0" y="-36" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle">POSTO</text>
            <rect x="-70" y="-20" width="12" height="70" fill="#b0bec5"/>
            <rect x="58" y="-20" width="12" height="70" fill="#b0bec5"/>
            <rect x="-20" y="10" width="14" height="24" fill="#d32f2f" stroke="#ffffff" stroke-width="1"/>
            <rect x="6" y="10" width="14" height="24" fill="#0d47a1" stroke="#ffffff" stroke-width="1"/>
        `,
        paintable: true,
        defaultColor: '#00838f',
        textEditable: true,
        defaultText: 'POSTO'
    },
    // --- CATEGORIA: ELEMENTOS DE ACIDENTE E ESTRUTURAS ---
    'structure-guard-rail': {
        name: 'Defensa Metálica (Guard-rail)',
        category: 'structure',
        width: 160,
        height: 16,
        svg: `
            <!-- Trilho metálico -->
            <rect x="-80" y="-8" width="160" height="16" fill="#90a4ae" stroke="#37474f" stroke-width="1.5" rx="2"/>
            <!-- Ondas e parafusos de união -->
            <line x1="-80" y1="0" x2="80" y2="0" stroke="#cfd8dc" stroke-width="1.5"/>
            <rect x="-50" y="-6" width="6" height="12" fill="#37474f" rx="1"/>
            <rect x="0" y="-6" width="6" height="12" fill="#37474f" rx="1"/>
            <rect x="50" y="-6" width="6" height="12" fill="#37474f" rx="1"/>
        `,
        paintable: false
    },
    'structure-guard-rail-damaged': {
        name: 'Defensa Danificada (Impacto)',
        category: 'structure',
        width: 160,
        height: 32,
        svg: `
            <!-- Trilho metálico danificado/amassado -->
            <path d="M-80,-4 L-30,-4 Q0,18 10,-4 L80,-4" fill="none" stroke="#78909c" stroke-width="6" stroke-linecap="round"/>
            <path d="M-80,2 L-30,2 Q0,24 10,2 L80,2" fill="none" stroke="#b0bec5" stroke-width="2" stroke-linecap="round"/>
            <path d="M-80,-8 L-30,-8 Q0,12 10,-8 L80,-8" fill="none" stroke="#37474f" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Postes de fixação entortados -->
            <rect x="-50" y="-2" width="6" height="12" fill="#37474f" rx="1" transform="rotate(-15, -47, 4)"/>
            <rect x="-5" y="8" width="6" height="12" fill="#37474f" rx="1" transform="rotate(45, -2, 14)"/>
            <rect x="50" y="-2" width="6" height="12" fill="#37474f" rx="1" transform="rotate(10, 53, 4)"/>
        `,
        paintable: false
    },
    'vehicle-car-damaged': {
        name: 'Carro Danificado (Colisão)',
        category: 'vehicle',
        width: 80,
        height: 44,
        svg: `
            <!-- Sombra do carro -->
            <rect x="-40" y="-22" width="80" height="44" fill="#000000" opacity="0.3" rx="6" transform="translate(2, 2)"/>
            <!-- Corpo pintável do carro -->
            <rect class="paintable-element" x="-36" y="-20" width="72" height="40" fill="#db2777" stroke="#ffffff" stroke-width="1.5" rx="5"/>
            <!-- Para-brisas e Vidros -->
            <rect x="-10" y="-16" width="32" height="32" fill="#1e293b" rx="2"/>
            <rect x="-24" y="-15" width="10" height="30" fill="#1e293b" rx="2"/>
            <!-- Amassado frontal (Deformação por colisão) -->
            <path d="M30,-20 L36,-20 L30,-12 L35,-4 L28,4 L36,12 L30,20 L25,20 L28,10 Q24,0 28,-10 Z" fill="#37474f" stroke="#1e293b" stroke-width="1.5"/>
            <!-- Fumaça ou faísca indicativa -->
            <path d="M28,-8 Q35,-15 45,-12 Q52,-5 42,2 Q48,15 35,12 Z" fill="#cfd8dc" opacity="0.5"/>
        `,
        paintable: true,
        defaultColor: '#db2777'
    },
    'vehicle-car-overturned': {
        name: 'Carro Tombado/Capotado',
        category: 'vehicle',
        width: 80,
        height: 48,
        svg: `
            <!-- Sombra projetada do carro deitado de lado -->
            <ellipse cx="0" cy="12" rx="42" ry="12" fill="#000000" opacity="0.35"/>
            <!-- Corpo pintável visto de lado/teto -->
            <path class="paintable-element" d="M-36,-16 L36,-16 C38,-16 40,-12 38,-4 L32,16 C31,18 29,20 27,20 L-27,20 C-29,20 -31,18 -32,16 L-38,-4 C-40,-12 -38,-16 -36,-16 Z" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
            <!-- Vidro lateral (Deitado, mostra o teto enclinado) -->
            <path d="M-22,-10 L22,-10 L18,8 L-18,8 Z" fill="#1e293b"/>
            <!-- Rodas suspensas no ar (vistas de baixo/lado) -->
            <rect x="-28" y="-22" width="12" height="7" fill="#1a1a24" rx="1.5"/>
            <rect x="16" y="-22" width="12" height="7" fill="#1a1a24" rx="1.5"/>
            <!-- Rodas no chão achatadas -->
            <rect x="-26" y="18" width="10" height="5" fill="#1a1a24" rx="1"/>
            <rect x="18" y="18" width="10" height="5" fill="#1a1a24" rx="1"/>
        `,
        paintable: true,
        defaultColor: '#dc2626'
    },
    'marking-skid-straight': {
        name: 'Marcas de Frenagem (Reta)',
        category: 'marking',
        width: 160,
        height: 36,
        svg: `
            <!-- Duas linhas paralelas pretas simulando marcas de pneu arrastado no asfalto -->
            <line x1="-80" y1="-14" x2="80" y2="-14" stroke="#000000" stroke-width="4.5" stroke-dasharray="25,10" opacity="0.65"/>
            <line x1="-80" y1="14" x2="80" y2="14" stroke="#000000" stroke-width="4.5" stroke-dasharray="25,10" opacity="0.65"/>
        `,
        paintable: false
    },
    'marking-skid-curve': {
        name: 'Marcas de Frenagem (Curva)',
        category: 'marking',
        width: 160,
        height: 60,
        svg: `
            <!-- Duas linhas paralelas curvas simulando frenagem descontrolada -->
            <path d="M-80,-20 Q0,10 80,20" fill="none" stroke="#000000" stroke-width="4.5" stroke-dasharray="20,8" opacity="0.65"/>
            <path d="M-80,10 Q0,40 80,50" fill="none" stroke="#000000" stroke-width="4.5" stroke-dasharray="20,8" opacity="0.65"/>
        `,
        paintable: false
    },
    'marking-impact-burst': {
        name: 'Ponto de Impacto (Colisão)',
        category: 'marking',
        width: 50,
        height: 50,
        svg: `
            <!-- Estrela de impacto vermelha/amarela -->
            <polygon points="0,-24 6,-8 22,-16 10,0 24,6 8,10 16,24 0,14 -16,24 -8,10 -24,6 -10,0 -22,-16 -6,-8" fill="#ffeb3b" stroke="#f44336" stroke-width="2.5"/>
            <polygon points="0,-14 3,-4 13,-9 6,0 14,3 5,6 10,14 0,8 -10,14 -5,6 -14,3 -6,0 -13,-9 -3,-4" fill="#ff5722"/>
        `,
        paintable: false
    },
    'structure-cone': {
        name: 'Cone de Trânsito',
        category: 'structure',
        width: 20,
        height: 20,
        svg: `
            <!-- Sombra do cone -->
            <ellipse cx="0" cy="6" rx="10" ry="4" fill="#000000" opacity="0.3"/>
            <!-- Base quadrada preta -->
            <polygon points="-8,6 8,6 6,9 -6,9" fill="#1a1a24"/>
            <!-- Corpo cônico laranja e branco -->
            <polygon points="-5,5 5,5 0,-10" fill="#ea580c"/>
            <!-- Faixas brancas -->
            <polygon points="-3.2,0 3.2,0 2.2,3 -2.2,3" fill="#ffffff"/>
            <polygon points="-1.8,-5 1.8,-5 1.2,-3 -1.2,-3" fill="#ffffff"/>
        `,
        paintable: false
    }
};

// Cores premium pré-definidas para veículos
const CAR_COLORS = [
    { name: 'Branco', hex: '#ffffff' },
    { name: 'Preto', hex: '#1a1a24' },
    { name: 'Cinza Prata', hex: '#94a3b8' },
    { name: 'Vermelho Real', hex: '#dc2626' },
    { name: 'Azul Escuro', hex: '#1d4ed8' },
    { name: 'Verde Floresta', hex: '#15803d' },
    { name: 'Amarelo Táxi', hex: '#eab308' },
    { name: 'Laranja Alerta', hex: '#ea580c' },
    { name: 'Ciano Especial', hex: '#06b6d4' },
    { name: 'Rosa Chiclete', hex: '#db2777' }
];

// 2. ESTADO GLOBAL DA APLICAÇÃO
const state = {
    elements: [],            // Array de elementos inseridos no canvas
    selectedId: null,        // ID do elemento atualmente selecionado
    zoom: 1.0,               // Nível de zoom do canvas
    panX: 0,                 // Rolagem panorâmica X
    panY: 0,                 // Rolagem panorâmica Y
    isSnapEnabled: true,     // Ajuste em grade ativado
    isGridEnabled: true,     // Exibição da grade de fundo
    gridSize: 20,            // Tamanho do grid (em pixels) para snap
    
    // Variáveis auxiliares de interação
    isPanning: false,
    panStart: { x: 0, y: 0 },
    
    isDragging: false,
    dragType: null,          // 'move', 'rotate', 'resize'
    dragStart: { x: 0, y: 0 },
    draggedElementInitial: {}, // Posição/escala/ângulo inicial do item arrastado
    
    counter: 0,               // Contador incremental para gerar IDs únicos
    spacePressed: false,
    
    // Variáveis do motor de simulação dinâmica animada
    isSimulationPlaying: false,
    simulationTick: 0,
    simulationFrameId: null,
    activeScenario: null,
    simElements: {}           // Dicionário de IDs dos elementos dinâmicos criados
};

// 3. REFERÊNCIAS DO DOM
const svgCanvas = document.getElementById('sketch-canvas');
const elementsLayer = document.getElementById('elements-layer');
const selectionLayer = document.getElementById('selection-layer');
const canvasWrapper = document.getElementById('canvas-wrapper');
const propEmptyState = document.getElementById('prop-empty-state');
const propEditor = document.getElementById('prop-editor');

// Inputs do inspetor
const inputScale = document.getElementById('input-scale');
const valScale = document.getElementById('val-scale');
const inputAngle = document.getElementById('input-angle');
const valAngle = document.getElementById('val-angle');
const colorPaletteOptions = document.getElementById('color-palette-options');
const inputCustomColor = document.getElementById('input-custom-color');
const propGroupColor = document.getElementById('prop-group-color');
const propGroupText = document.getElementById('prop-group-text');
const propGroupSimulation = document.getElementById('prop-group-simulation');
const inputSimSpeed = document.getElementById('input-sim-speed');
const valSimSpeed = document.getElementById('val-sim-speed');
const selectSimBehavior = document.getElementById('select-sim-behavior');
const inputElementText = document.getElementById('input-element-text');
const badgeType = document.getElementById('info-element-type');
const infoId = document.getElementById('info-element-id');

// Botões rápidos do topo e rodapé
const btnToggleGrid = document.getElementById('btn-toggle-grid');
const btnToggleSnap = document.getElementById('btn-toggle-snap');
const zoomDisplay = document.getElementById('zoom-value');
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnZoomReset = document.getElementById('btn-zoom-reset');
const btnClear = document.getElementById('btn-clear');
const btnExportSvg = document.getElementById('btn-export-svg');
const btnExportPng = document.getElementById('btn-export-png');
const btnHelp = document.getElementById('btn-help');
const helpModal = document.getElementById('help-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCloseHelp = document.getElementById('btn-close-help');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');

// Referências do modal de simulação/cenários
const btnScenarios = document.getElementById('btn-scenarios');
const scenariosModal = document.getElementById('scenarios-modal');
const btnCloseScenariosModal = document.getElementById('btn-close-scenarios-modal');

// 4. INICIALIZAÇÃO E GERAÇÃO DAS PREVIEWS DA BIBLIOTECA
// 4. INICIALIZAÇÃO E GERAÇÃO DAS PREVIEWS DA BIBLIOTECA
function init() {
    // Injetar Drawer Overlay dinamicamente no body se não existir
    if (!document.querySelector('.drawer-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        document.body.appendChild(overlay);
        
        // Clicar no overlay fecha qualquer drawer aberto
        overlay.addEventListener('click', closeDrawers);
    }
    
    // Configurar busca na biblioteca
    const searchInput = document.getElementById('library-search');
    if (searchInput) {
        searchInput.addEventListener('input', generateLibraryPreviews);
    }
    

    // Configurar botões Mobile de Drawer
    const btnMobileLib = document.getElementById('btn-mobile-library');
    const btnMobileProp = document.getElementById('btn-mobile-properties');
    const btnCloseLib = document.getElementById('btn-close-library-drawer');
    const btnCloseProp = document.getElementById('btn-close-properties-drawer');
    
    if (btnMobileLib) {
        btnMobileLib.addEventListener('click', () => {
            openDrawer('library-panel');
        });
    }
    
    if (btnMobileProp) {
        btnMobileProp.addEventListener('click', () => {
            if (!btnMobileProp.classList.contains('disabled')) {
                openDrawer('properties-panel');
            }
        });
    }
    
    if (btnCloseLib) btnCloseLib.addEventListener('click', closeDrawers);
    if (btnCloseProp) btnCloseProp.addEventListener('click', closeDrawers);

    // Configurar botões Desktop de Colapso e Restauração de Sidebars
    const btnCollapseLib = document.getElementById('btn-collapse-library');
    const btnRestoreLib = document.getElementById('btn-restore-library');
    const btnCollapseProp = document.getElementById('btn-collapse-properties');
    const btnRestoreProp = document.getElementById('btn-restore-properties');
    const libraryPanel = document.getElementById('library-panel');
    const propertiesPanel = document.getElementById('properties-panel');

    if (btnCollapseLib && libraryPanel && btnRestoreLib) {
        btnCollapseLib.addEventListener('click', () => {
            libraryPanel.classList.add('collapsed');
            btnRestoreLib.classList.remove('hidden');
        });
    }

    if (btnRestoreLib && libraryPanel) {
        btnRestoreLib.addEventListener('click', () => {
            libraryPanel.classList.remove('collapsed');
            btnRestoreLib.classList.add('hidden');
        });
    }

    if (btnCollapseProp && propertiesPanel && btnRestoreProp) {
        btnCollapseProp.addEventListener('click', () => {
            propertiesPanel.classList.add('collapsed');
            btnRestoreProp.classList.remove('hidden');
        });
    }

    if (btnRestoreProp && propertiesPanel) {
        btnRestoreProp.addEventListener('click', () => {
            propertiesPanel.classList.remove('collapsed');
            btnRestoreProp.classList.add('hidden');
        });
    }

    generateLibraryPreviews();
    setupCanvasTransforms();
    setupEventListeners();
    generateInspectorColorPalette();
    
    // Inserir elementos demonstrativos iniciais para guiar o usuário
    addDemoElements();
}

// Funções para gerenciar o estado dos Drawers Mobile (Bottom Sheets)
function closeDrawers() {
    const libraryPanel = document.getElementById('library-panel');
    const propertiesPanel = document.getElementById('properties-panel');
    const overlay = document.querySelector('.drawer-overlay');
    
    if (libraryPanel) libraryPanel.classList.remove('open');
    if (propertiesPanel) propertiesPanel.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));
}

function openDrawer(panelId) {
    closeDrawers();
    
    const panel = document.getElementById(panelId);
    const overlay = document.querySelector('.drawer-overlay');
    
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('active');
    
    if (panelId === 'library-panel') {
        const btn = document.getElementById('btn-mobile-library');
        if (btn) btn.classList.add('active');
    } else if (panelId === 'properties-panel') {
        const btn = document.getElementById('btn-mobile-properties');
        if (btn) btn.classList.add('active');
    }
}

// Gera previews em SVG na barra lateral dinamicamente de acordo com as templates do JS, com suporte a filtro e busca
// Constantes de categorias e ícones para a biblioteca em cascata
const CATEGORY_INFO = {
    'road': { name: 'Vias e Pistas', icon: '🛣️' },
    'sign-reg': { name: 'Sinalização Regulamentação', icon: '🛑' },
    'sign-adv': { name: 'Sinalização Advertência', icon: '⚠️' },
    'sign-ind': { name: 'Sinalização Indicação', icon: 'ℹ️' },
    'sign-serv': { name: 'Serviços Auxiliares', icon: '⛽' },
    'sign-tour': { name: 'Atrativos Turísticos', icon: '🏞️' },
    'sign-works': { name: 'Sinalização de Obras', icon: '🚧' },
    'marking': { name: 'Sinalização Horizontal', icon: '➖' },
    'building': { name: 'Estabelecimentos e Comércio', icon: '🏪' },
    'vehicle': { name: 'Veículos e Agentes', icon: '🚗' },
    'structure': { name: 'Estruturas e Obstáculos', icon: '🌳' }
};

// Retorna o ID da categoria correta do item
function getItemCategory(type, template) {
    let cat = template.category;
    if (cat === 'sign') {
        cat = 'sign-reg'; // Fallback
    }
    // Tratamento especial para marcação horizontal e semáforos
    if (type.startsWith('marking-') || type.startsWith('sign-traffic-light')) {
        cat = 'marking';
    }
    return cat;
}

// Gera a biblioteca de itens em cascata inteligente (Accordion)
function generateLibraryPreviews() {
    const container = document.getElementById('library-dynamic-items');
    if (!container) return;
    container.innerHTML = '';
    
    // Obter termo de busca
    const searchVal = document.getElementById('library-search')?.value.toLowerCase() || '';
    
    // Objeto temporário para agrupar itens filtrados por categoria
    const groupedItems = {};
    for (const catId of Object.keys(CATEGORY_INFO)) {
        groupedItems[catId] = [];
    }
    
    // Filtrar e agrupar itens
    for (const [type, template] of Object.entries(ELEMENT_TEMPLATES)) {
        // Filtrar por busca (nome ou tipo do item)
        if (searchVal && !template.name.toLowerCase().includes(searchVal) && !type.toLowerCase().includes(searchVal)) {
            continue;
        }
        
        const cat = getItemCategory(type, template);
        if (groupedItems[cat]) {
            groupedItems[cat].push({ type, template });
        }
    }
    
    // Criar a estrutura do Accordion na interface
    let isFirstCategory = true;
    for (const [catId, info] of Object.entries(CATEGORY_INFO)) {
        const items = groupedItems[catId];
        if (items.length === 0) {
            // Se houver busca, esconde categorias sem correspondência
            continue;
        }
        
        // Criar elemento de details do acordeão
        const details = document.createElement('details');
        details.className = 'category-group';
        
        // Se houver busca, abre automaticamente o acordeão. Caso contrário, abre apenas a primeira categoria ("Vias") por padrão
        if (searchVal || isFirstCategory) {
            details.setAttribute('open', 'true');
            if (!searchVal) isFirstCategory = false; // Apenas a primeira sem busca
        }
        
        // Criar sumário (cabeçalho)
        const summary = document.createElement('summary');
        summary.className = 'category-header';
        
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'category-title-wrapper';
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'category-icon';
        iconSpan.textContent = info.icon;
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'category-name';
        nameSpan.textContent = info.name;
        
        const counterSpan = document.createElement('span');
        counterSpan.className = 'category-counter';
        counterSpan.textContent = items.length;
        
        titleWrapper.appendChild(iconSpan);
        titleWrapper.appendChild(nameSpan);
        titleWrapper.appendChild(counterSpan);
        summary.appendChild(titleWrapper);
        details.appendChild(summary);
        
        // Criar contêiner de grade para os itens desta categoria
        const grid = document.createElement('div');
        grid.className = 'category-content grid-items';
        
        // Criar itens
        items.forEach(({ type, template }) => {
            const item = document.createElement('div');
            item.className = 'library-item';
            item.dataset.type = type;
            item.setAttribute('draggable', 'true');
            
            // Preview do item
            const preview = document.createElement('div');
            preview.className = 'item-preview';
            
            const previewSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const pad = 12;
            const w = template.width + pad * 2;
            const h = template.height + pad * 2;
            previewSvg.setAttribute('viewBox', `-${w/2} -${h/2} ${w} ${h}`);
            previewSvg.setAttribute('width', '100%');
            previewSvg.setAttribute('height', '100%');
            previewSvg.innerHTML = template.svg;
            
            if (template.paintable) {
                const paintables = previewSvg.querySelectorAll('.paintable-element');
                paintables.forEach(el => el.setAttribute('fill', template.defaultColor));
            }
            if (template.textEditable) {
                const textNode = previewSvg.querySelector('text');
                if (textNode) textNode.textContent = template.defaultText || '';
            }
            
            preview.appendChild(previewSvg);
            
            const nameLabel = document.createElement('span');
            nameLabel.className = 'item-name';
            nameLabel.textContent = template.name;
            nameLabel.title = template.name;
            
            item.appendChild(preview);
            item.appendChild(nameLabel);
            
            // Configurar Drag Start
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', type);
                state.draggedLibraryType = type;
            });
            
            // Clique rápido para celular/tablet ou para adição fácil (insere no centro da tela)
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeDrawers();
                }
                
                // Inserir elemento no centro da área visível do canvas
                const wrapperRect = canvasWrapper.getBoundingClientRect();
                const screenCenterX = wrapperRect.left + wrapperRect.width / 2;
                const screenCenterY = wrapperRect.top + wrapperRect.height / 2;
                const coords = screenToSVGCoords(screenCenterX, screenCenterY);
                
                let targetX = coords.x;
                let targetY = coords.y;
                if (state.isSnapEnabled) {
                    targetX = Math.round(targetX / state.gridSize) * state.gridSize;
                    targetY = Math.round(targetY / state.gridSize) * state.gridSize;
                }
                
                addElement(type, targetX, targetY);
            });
            
            grid.appendChild(item);
        });
        
        details.appendChild(grid);
        container.appendChild(details);
    }
}

// Popula paleta de cores padrão no inspetor
function generateInspectorColorPalette() {
    colorPaletteOptions.innerHTML = '';
    CAR_COLORS.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color.hex;
        swatch.title = color.name;
        swatch.dataset.hex = color.hex;
        swatch.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            inputCustomColor.value = color.hex;
            updateSelectedElementProperty('color', color.hex);
        });
        colorPaletteOptions.appendChild(swatch);
    });
}

// Insere alguns elementos na pista ao abrir pela primeira vez
function addDemoElements() {
    // Adiciona uma pista reta no meio
    addElement('road-straight', 600, 350, 0, 1.2);
    addElement('road-straight', 888, 350, 0, 1.2);
    // Adiciona uma rotatória à esquerda
    addElement('road-roundabout', 250, 350, 0, 0.95);
    // Carro azul
    addElement('vehicle-car-sedan', 620, 310, 90, 1.0, '#00adb5');
    // Carro Hatch Vermelho freando/virando
    addElement('vehicle-car-hatch', 520, 385, 270, 1.0, '#dc2626');
    // Uma moto amarela na rotatória
    addElement('vehicle-motorcycle', 290, 260, 45, 1.0, '#eab308');
    // Barreira jersey de obras
    addElement('structure-jersey-barrier', 740, 240, 0, 1.0, '#ea580c'); // Laranja de obras!
    // Placa de pare
    addElement('sign-stop', 420, 245, 0, 1.1);
    
    // Zoom inicial fit
    fitCanvas();
}

// Limpa o canvas e redefine o estado da aplicação
function clearCanvas(showConfirm = true) {
    if (!showConfirm || confirm('Tem certeza que deseja limpar o croqui atual e excluir todos os itens?')) {
        // Parar a simulação e limpar o cenário ativo
        stopSimulation();
        const btnPlaySim = document.getElementById('btn-play-simulation');
        if (btnPlaySim) {
            btnPlaySim.classList.add('hidden');
        }
        
        elementsLayer.innerHTML = '';
        selectionLayer.innerHTML = '';
        state.elements = [];
        selectElement(null);
        state.activeScenario = null;
        state.simElements = {};
        return true;
    }
    return false;
}

// Adiciona um elemento com opacidade customizada (usado nas simulações)
function addElementWithOpacity(type, x, y, angle = 0, scale = 1.0, color = null, text = '', opacity = 1.0) {
    const id = addElement(type, x, y, angle, scale, color, text);
    const el = state.elements.find(e => e.id === id);
    if (el) {
        el.opacity = opacity;
        const node = document.getElementById(id);
        if (node) node.setAttribute('opacity', opacity);
    }
    return id;
}

// Carrega cenários de simulação pré-definidos (colisão, capotamento, retorno e fluxo)
function loadPresetScenario(id) {
    // Parar qualquer simulação rodando antes de carregar
    stopSimulation();
    
    // Limpar o canvas sem confirmação interna
    clearCanvas(false);
    
    state.activeScenario = id;
    state.simElements = {};
    
    if (id === 1) {
        // --- CENÁRIO 1: Colisão Frontal (Invasão de Contramão na Ultrapassagem) ---
        // Vias estáticas (pistas simples com faixas tracejadas)
        addElement('road-straight-dashed', 300, 350, 0, 1.2);
        addElement('road-straight-dashed', 588, 350, 0, 1.2);
        addElement('road-straight-dashed', 876, 350, 0, 1.2);

        // Elementos dinâmicos da simulação
        state.simElements = {
            // Carro de contrafluxo azul (vem da direita para a esquerda na faixa de cima)
            carContra: addElement('vehicle-car-sedan', 850, 310, 270, 1.0, '#1d4ed8'),
            // Carro vermelho que ultrapassa (vem da esquerda para a direita na faixa de baixo, depois desvia)
            carOver: addElement('vehicle-car-sedan', 200, 390, 90, 1.0, '#dc2626'),
            // Carro azul danificado (invisível)
            carContraDamaged: addElementWithOpacity('vehicle-car-damaged', 525, 310, 270, 1.0, '#1d4ed8', '', 0),
            // Carro vermelho danificado (invisível)
            carOverDamaged: addElementWithOpacity('vehicle-car-damaged', 445, 310, 90, 1.0, '#dc2626', '', 0),
            // Veículo lento ultrapassado (táxi amarelo)
            carSlow: addElement('vehicle-car-sedan', 420, 390, 90, 1.0, '#eab308'),
            // Marcas de frenagem (invisíveis)
            skidMark1: addElementWithOpacity('marking-skid-straight', 480, 310, 0, 0.9, null, '', 0),
            skidMark2: addElementWithOpacity('marking-skid-straight', 580, 310, 0, 0.9, null, '', 0),
            // Estrela de colisão (invisível)
            impactBurst: addElementWithOpacity('marking-impact-burst', 485, 310, 0, 1.0, null, '', 0)
        };
    } 
    else if (id === 2) {
        // --- CENÁRIO 2: Colisão Traseira e Engavetamento (Múltiplos Veículos) ---
        // Vias
        addElement('road-straight', 300, 350, 0, 1.2);
        addElement('road-straight', 588, 350, 0, 1.2);
        addElement('road-straight', 876, 350, 0, 1.2);

        // Elementos dinâmicos
        state.simElements = {
            // Carro azul dianteiro (freia forte)
            carFront: addElement('vehicle-car-sedan', 800, 390, 90, 1.0, '#1d4ed8'),
            // Carro vermelho intermediário (bate no azul)
            carMid: addElement('vehicle-car-sedan', 500, 390, 90, 1.0, '#dc2626'),
            // Carro vermelho danificado (invisível)
            carMidDamaged: addElementWithOpacity('vehicle-car-damaged', 730, 390, 90, 1.0, '#dc2626', '', 0),
            // Carro branco traseiro (bate no vermelho)
            carBack: addElement('vehicle-car-sedan', 200, 390, 90, 1.0, '#ffffff'),
            // Carro branco danificado (invisível)
            carBackDamaged: addElementWithOpacity('vehicle-car-damaged', 660, 390, 90, 1.0, '#ffffff', '', 0),
            // Frenagens
            skidMarkFront: addElementWithOpacity('marking-skid-straight', 710, 390, 0, 0.8, null, '', 0),
            skidMarkMid: addElementWithOpacity('marking-skid-straight', 620, 390, 0, 0.8, null, '', 0),
            skidMarkBack: addElementWithOpacity('marking-skid-straight', 450, 390, 0, 0.8, null, '', 0),
            // Impactos (invisíveis)
            impact1: addElementWithOpacity('marking-impact-burst', 765, 390, 0, 0.8, null, '', 0),
            impact2: addElementWithOpacity('marking-impact-burst', 695, 390, 0, 0.8, null, '', 0)
        };
    } 
    else if (id === 3) {
        // --- CENÁRIO 3: Colisão Lateral/Transversal em Cruzamento ---
        // Cruzamento 90 graus
        addElement('road-intersection', 500, 350, 0, 1.25);
        
        // Sinalização vertical e cones
        addElement('sign-stop', 370, 480, 0, 1.1);
        addElement('structure-cone', 610, 240);
        
        // Elementos dinâmicos
        state.simElements = {
            // Carro azul preferencial (via horizontal indo para a direita)
            carHorizontal: addElement('vehicle-car-sedan', 200, 395, 90, 1.0, '#1d4ed8'),
            // Carro azul danificado/arremessado (invisível)
            carHorizontalDamaged: addElementWithOpacity('vehicle-car-damaged', 460, 395, 115, 1.0, '#1d4ed8', '', 0),
            // Carro vermelho invasor (via vertical subindo)
            carVertical: addElement('vehicle-car-sedan', 455, 590, 0, 1.0, '#dc2626'),
            // Carro vermelho danificado (invisível)
            carVerticalDamaged: addElementWithOpacity('vehicle-car-damaged', 455, 395, 0, 1.0, '#dc2626', '', 0),
            // Impacto
            impact: addElementWithOpacity('marking-impact-burst', 460, 395, 0, 1.0, null, '', 0)
        };
    } 
    else if (id === 4) {
        // --- CENÁRIO 4: Colisão Transversal em Rotatória (Desrespeito à Preferencial) ---
        // Rotatória
        addElement('road-roundabout', 500, 350, 0, 1.15);
        
        // Elementos dinâmicos
        state.simElements = {
            // Carro azul circulando (está na rotatória)
            carCirc: addElement('vehicle-car-sedan', 500, 210, 270, 1.0, '#1d4ed8'),
            // Carro azul danificado (invisível)
            carCircDamaged: addElementWithOpacity('vehicle-car-damaged', 600, 260, 330, 1.0, '#1d4ed8', '', 0),
            // Carro vermelho que entra sem ceder a vez
            carEnter: addElement('vehicle-car-sedan', 790, 395, 270, 1.0, '#dc2626'),
            // Carro vermelho danificado (invisível)
            carEnterDamaged: addElementWithOpacity('vehicle-car-damaged', 665, 395, 270, 1.0, '#dc2626', '', 0),
            // Impacto
            impact: addElementWithOpacity('marking-impact-burst', 635, 330, 45, 0.9, null, '', 0)
        };
    } 
    else if (id === 5) {
        // --- CENÁRIO 5: Saída de Pista e Choque contra Barreira Jersey ---
        // Curva
        addElement('road-curve', 450, 450, 0, 1.25);
        addElement('road-straight', 770, 305, 0, 1.25);
        addElement('road-straight', 305, 770, 90, 1.25);

        // Barreiras jersey e cones
        state.simElements = {
            // Barreira normal que será atingida
            jerseyNormal: addElement('structure-jersey-barrier', 430, 205, 0, 1.0),
            // Barreira deslocada (invisível)
            jerseyDisplaced: addElementWithOpacity('structure-jersey-barrier', 410, 195, -15, 1.0, null, '', 0),
            // Carro vermelho que corre
            carRed: addElement('vehicle-car-sedan', 770, 280, 270, 1.0, '#dc2626'),
            // Carro vermelho danificado/batido (invisível)
            carRedDamaged: addElementWithOpacity('vehicle-car-damaged', 430, 245, 290, 1.0, '#dc2626', '', 0),
            // Frenagem derrapagem
            skidMark: addElementWithOpacity('marking-skid-curve', 530, 290, 10, 1.0, null, '', 0),
            // Impacto
            impact: addElementWithOpacity('marking-impact-burst', 430, 215, 0, 1.0, null, '', 0)
        };
    } 
    else if (id === 6) {
        // --- CENÁRIO 6: Circulação Contínua em Rotatória ---
        // Rotatória
        addElement('road-roundabout', 500, 350, 0, 1.15);
        
        // Elementos dinâmicos em loop continuo
        state.simElements = {
            // Carro amarelo (táxi) - circulando
            taxiCirc: addElement('vehicle-car-sedan', 500, 210, 270, 1.0, '#eab308'),
            // Carro azul - entrando e cedendo preferência
            carBlue: addElement('vehicle-car-sedan', 790, 395, 270, 1.0, '#1d4ed8'),
            // Carro verde - em outra faixa circulando
            carGreen: addElement('vehicle-car-sedan', 315, 350, 0, 1.0, '#15803d')
        };
    } 
    else if (id === 7) {
        // --- CENÁRIO 7: Retorno 180° em Rodovia de Pista Dupla ---
        // Recuo e pistas retas
        addElement('road-u-turn-pocket', 500, 330, 0, 1.25);
        addElement('road-straight', 798, 247, 0, 1.25);
        addElement('road-straight', 798, 413, 0, 1.25);

        // Elementos dinâmicos em loop continuo
        state.simElements = {
            // Táxi amarelo na reta superior
            taxiTop: addElement('vehicle-car-sedan', 650, 197, 270, 1.0, '#eab308'),
            // Carro cinza na reta superior
            carGrayTop: addElement('vehicle-car-sedan', 980, 197, 270, 1.0, '#94a3b8'),
            // Carro verde na reta inferior
            carGreenBottom: addElement('vehicle-car-sedan', 320, 463, 90, 1.0, '#15803d'),
            // Carro branco fazendo retorno
            carReturn: addElement('vehicle-car-sedan', 880, 197, 270, 1.0, '#ffffff'),
            // Carro laranja aguardando no recuo
            carWait: addElement('vehicle-car-sedan', 580, 365, 90, 1.0, '#ea580c')
        };
    }
    
    // Mostrar o botão flutuante de simulação
    const btnPlaySim = document.getElementById('btn-play-simulation');
    if (btnPlaySim) {
        btnPlaySim.classList.remove('hidden');
        document.getElementById('play-sim-icon').textContent = '▶️';
        document.getElementById('play-sim-text').textContent = 'Iniciar Dinâmica';
    }
    
    // Auto-ajustar canvas para o novo cenário
    fitCanvas();
}

function startSimulation() {
    if (state.isSimulationPlaying) return;
    state.isSimulationPlaying = true;
    state.simulationTick = 0;
    
    // Salvar posição inicial de TODOS os elementos para restaurar ao resetar
    state.simSnapshot = state.elements.map(el => ({
        id: el.id,
        x: el.x,
        y: el.y,
        angle: el.angle,
        opacity: el.opacity ?? 1.0
    }));
    
    // Altera interface do botão
    const simIcon = document.getElementById('play-sim-icon');
    const simText = document.getElementById('play-sim-text');
    if (simIcon) simIcon.textContent = '⏹️';
    if (simText) simText.textContent = 'Parar / Reset';
    
    // Inicia o loop
    state.simulationFrameId = requestAnimationFrame(animateSimulation);
}

function stopSimulation() {
    if (state.simulationFrameId) {
        cancelAnimationFrame(state.simulationFrameId);
        state.simulationFrameId = null;
    }
    
    if (!state.isSimulationPlaying) return;
    state.isSimulationPlaying = false;
    state.simulationTick = 0;
    
    // Altera interface do botão
    const simIcon = document.getElementById('play-sim-icon');
    const simText = document.getElementById('play-sim-text');
    if (simIcon) simIcon.textContent = '▶️';
    if (simText) simText.textContent = 'Iniciar Dinâmica';
    
    // Se for cenário pré-montado, recarrega do início
    if (state.activeScenario) {
        loadPresetScenario(state.activeScenario);
        return;
    }
    
    // Para simulação personalizada: restaura posições e ângulos originais de todos os elementos
    if (state.simSnapshot) {
        state.simSnapshot.forEach(snap => {
            const el = state.elements.find(e => e.id === snap.id);
            if (el) {
                el.x = snap.x;
                el.y = snap.y;
                el.angle = snap.angle;
                el.opacity = snap.opacity;
                const node = document.getElementById(snap.id);
                if (node) {
                    updateElementNodeTransform(node, snap.x, snap.y, snap.angle, el.scale);
                    node.setAttribute('opacity', snap.opacity);
                }
            }
        });
        state.simSnapshot = null;
    }
}

// Função auxiliar para atualizar o DOM e o Estado de um elemento na simulação
function updateSimElement(id, x, y, angle, opacity = null) {
    const el = state.elements.find(e => e.id === id);
    if (!el) return;
    
    el.x = x;
    el.y = y;
    el.angle = angle;
    if (opacity !== null) el.opacity = opacity;
    
    const node = document.getElementById(id);
    if (node) {
        updateElementNodeTransform(node, x, y, angle, el.scale);
        if (opacity !== null) node.setAttribute('opacity', opacity);
    }
}

function animateSimulation() {
    if (!state.isSimulationPlaying) return;
    state.simulationTick++;
    const t = state.simulationTick;
    
    const ids = state.simElements;
    
    if (state.activeScenario === 1) {
        // --- CENÁRIO 1: Colisão Frontal (Invasão de Contramão na Ultrapassagem) ---
        // Carro contrafluxo azul (direita para esquerda)
        let xContra = 850 - t * 4.0;
        let yContra = 310;
        let rContra = 270;
        
        // Carro vermelho ultrapassando (esquerda para direita)
        let xOver = 0;
        let yOver = 390;
        let rOver = 90;
        
        if (t <= 15) {
            xOver = 200 + t * 4.0;
        } 
        else if (t > 15 && t <= 45) {
            const dt = t - 15;
            xOver = 260 + dt * 5.0;
            yOver = 390 - dt * 2.66; // Sobe para a contramão (y=310)
            rOver = 90 - Math.sin((dt / 30) * Math.PI) * 15; // Leve desvio visual
        } 
        else {
            const dt = t - 45;
            xOver = 410 + dt * 4.5;
            yOver = 310;
            rOver = 90;
        }
        
        // Veículo lento ultrapassado (táxi)
        const xSlow = 420 + t * 1.5;
        updateSimElement(ids.carSlow, xSlow, 390, 90);
        
        // Revelar marcas de frenagem na contramão antes da colisão (t=50 a t=75)
        if (t >= 50 && t <= 75) {
            const op = Math.min(0.7, (t - 50) * 0.03);
            updateSimElement(ids.skidMark1, 480, 310, 0, op);
            updateSimElement(ids.skidMark2, 580, 310, 0, op);
        }
        
        // Ponto de Colisão ocorre em t=75
        if (t <= 75) {
            updateSimElement(ids.carContra, xContra, yContra, rContra);
            updateSimElement(ids.carOver, xOver, yOver, rOver);
        } 
        else if (t > 75 && t <= 120) {
            const dt = t - 75;
            
            if (dt === 1) {
                // Ocultar normais
                updateSimElement(ids.carContra, 0, 0, 0, 0);
                updateSimElement(ids.carOver, 0, 0, 0, 0);
                
                // Mostrar danificados no local exato do choque
                updateSimElement(ids.carContraDamaged, 525, 310, 270, 1.0);
                updateSimElement(ids.carOverDamaged, 445, 310, 90, 1.0);
            }
            
            // Piscar ponto de impacto
            if (dt <= 20) {
                const opBurst = dt % 4 < 2 ? 1.0 : 0.2;
                updateSimElement(ids.impactBurst, 485, 310, 0, opBurst);
            } else {
                updateSimElement(ids.impactBurst, 0, 0, 0, 0);
            }
            
            // Recuo e deslizamento pós-colisão
            const xC = 525 + dt * 0.3;
            const yC = 310 - dt * 0.2;
            const rC = 270 - dt * 0.5;
            updateSimElement(ids.carContraDamaged, xC, yC, rC, 1.0);
            
            const xO = 445 - dt * 0.3;
            const yO = 310 + dt * 0.2;
            const rO = 90 + dt * 0.5;
            updateSimElement(ids.carOverDamaged, xO, yO, rO, 1.0);
        } 
        else if (t > 120) {
            stopSimulation();
            return;
        }
    } 
    else if (state.activeScenario === 2) {
        // --- CENÁRIO 2: Colisão Traseira e Engavetamento (Múltiplos Veículos) ---
        // Carro da frente (azul)
        let xFront = 0;
        if (t <= 40) {
            xFront = 720 + t * 3.0;
        } else {
            const dt = t - 40;
            xFront = 840 + dt * 1.5; // Empurrado pela colisão a partir de t=70 (tratado depois)
        }
        
        // Carro do meio (vermelho)
        let xMid = 0;
        if (t <= 40) {
            xMid = 440 + t * 5.0;
        } else {
            const dt = t - 40;
            xMid = 640 + dt * 4.0; // Freia e atinge em t=70
        }
        
        // Carro de trás (branco)
        let xBack = 0;
        if (t <= 60) {
            xBack = 200 + t * 6.5;
        } else {
            const dt2 = t - 60;
            xBack = 590 + dt2 * 3.5; // Bate em t=95
        }
        
        // Marcas de frenagem aparecem aos poucos
        if (t >= 40 && t <= 70) {
            const op = Math.min(0.7, (t - 40) * 0.025);
            updateSimElement(ids.skidMarkFront, 710, 390, 0, op * 0.7);
            updateSimElement(ids.skidMarkMid, 620, 390, 0, op);
        }
        if (t >= 60 && t <= 95) {
            const op = Math.min(0.7, (t - 60) * 0.02);
            updateSimElement(ids.skidMarkBack, 450, 390, 0, op);
        }
        
        // Atualizações antes dos respectivos impactos
        if (t <= 70) {
            updateSimElement(ids.carFront, xFront, 390, 90);
            updateSimElement(ids.carMid, xMid, 390, 90);
        }
        
        if (t <= 95) {
            updateSimElement(ids.carBack, xBack, 390, 90);
        }
        
        // Colisão 1 (Vermelho no Azul) em t=70
        if (t > 70 && t <= 95) {
            const dt = t - 70;
            if (dt === 1) {
                updateSimElement(ids.carMid, 0, 0, 0, 0);
                updateSimElement(ids.carMidDamaged, 760, 390, 90, 1.0);
            }
            
            // Piscar impacto 1
            if (dt <= 15) {
                const op = dt % 4 < 2 ? 1.0 : 0.2;
                updateSimElement(ids.impact1, 765, 390, 0, op);
            } else {
                updateSimElement(ids.impact1, 0, 0, 0, 0);
            }
            
            // Deslizam juntos
            xFront = 840 + dt * 1.5;
            xMid = 760 + dt * 1.5;
            updateSimElement(ids.carFront, xFront, 390, 90);
            updateSimElement(ids.carMidDamaged, xMid, 390, 90, 1.0);
        }
        
        // Colisão 2 (Branco no Vermelho) em t=95 (Engavetamento completo)
        if (t > 95 && t <= 135) {
            const dt2 = t - 95;
            if (dt2 === 1) {
                updateSimElement(ids.carBack, 0, 0, 0, 0);
                updateSimElement(ids.carBackDamaged, 672.5, 390, 90, 1.0);
            }
            
            // Piscar impacto 2
            if (dt2 <= 15) {
                const op = dt2 % 4 < 2 ? 1.0 : 0.2;
                updateSimElement(ids.impact2, 705, 390, 0, op);
            } else {
                updateSimElement(ids.impact2, 0, 0, 0, 0);
            }
            
            // Todos deslizam juntos em velocidade reduzida até parar
            const finalShift = dt2 * 0.8;
            updateSimElement(ids.carFront, 877.5 + finalShift, 390, 90);
            updateSimElement(ids.carMidDamaged, 797.5 + finalShift, 390, 90, 1.0);
            updateSimElement(ids.carBackDamaged, 712.5 + finalShift, 390, 90, 1.0);
        }
        else if (t > 135) {
            stopSimulation();
            return;
        }
    } 
    else if (state.activeScenario === 3) {
        // --- CENÁRIO 3: Colisão Lateral/Transversal em Cruzamento ---
        if (t <= 60) {
            // Azul preferencial segue horizontalmente
            const xHor = 200 + t * 4.5;
            updateSimElement(ids.carHorizontal, xHor, 395, 90);
            
            // Vermelho avança verticalmente
            const yVer = 590 - t * 3.25;
            updateSimElement(ids.carVertical, 455, yVer, 0);
        } 
        else if (t > 60 && t <= 110) {
            const dt = t - 60;
            if (dt === 1) {
                // Esconder normais
                updateSimElement(ids.carHorizontal, 0, 0, 0, 0);
                updateSimElement(ids.carVertical, 0, 0, 0, 0);
                
                // Mostrar danificados
                updateSimElement(ids.carHorizontalDamaged, 470, 395, 90, 1.0);
                updateSimElement(ids.carVerticalDamaged, 455, 395, 0, 1.0);
            }
            
            // Piscar ponto de choque
            if (dt <= 15) {
                const op = dt % 4 < 2 ? 1.0 : 0.2;
                updateSimElement(ids.impact, 460, 395, 0, op);
            } else {
                updateSimElement(ids.impact, 0, 0, 0, 0);
            }
            
            // Projeção pós-impacto (azul gira e desliza, vermelho para)
            const xH = 470 + dt * 1.5;
            const yH = 395 - dt * 1.0;
            const rH = 90 + dt * 1.25;
            updateSimElement(ids.carHorizontalDamaged, xH, yH, rH, 1.0);
            
            const yV = 395 - dt * 0.4;
            updateSimElement(ids.carVerticalDamaged, 455, yV, 0, 1.0);
        } 
        else if (t > 110) {
            stopSimulation();
            return;
        }
    } 
    else if (state.activeScenario === 4) {
        // --- CENÁRIO 4: Colisão Transversal em Rotatória (Desrespeito à Preferencial) ---
        if (t <= 80) {
            // Azul circula na rotatória
            const angleRad = 1.9 - t * 0.02;
            const xBlue = 500 + Math.cos(angleRad) * 135;
            const yBlue = 350 + Math.sin(angleRad) * 135;
            const rBlue = (angleRad * 180 / Math.PI);
            updateSimElement(ids.carCirc, xBlue, yBlue, rBlue);
            
            // Vermelho entra sem preferência
            const xRed = 790 - t * 2.0;
            updateSimElement(ids.carEnter, xRed, 395, 270);
        } 
        else if (t > 80 && t <= 120) {
            const dt = t - 80;
            if (dt === 1) {
                // Esconder normais
                updateSimElement(ids.carCirc, 0, 0, 0, 0);
                updateSimElement(ids.carEnter, 0, 0, 0, 0);
                
                // Mostrar danificados
                updateSimElement(ids.carCircDamaged, 628, 389, 330, 1.0);
                updateSimElement(ids.carEnterDamaged, 630, 395, 270, 1.0);
            }
            
            // Piscar colisão
            if (dt <= 15) {
                const op = dt % 4 < 2 ? 1.0 : 0.2;
                updateSimElement(ids.impact, 635, 390, 45, op);
            } else {
                updateSimElement(ids.impact, 0, 0, 0, 0);
            }
            
            // Deslizam juntos sob impacto e param
            const xB = 628 - dt * 0.5;
            const yB = 389 - dt * 0.8;
            updateSimElement(ids.carCircDamaged, xB, yB, 330, 1.0);
            
            const xR = 630 - dt * 0.8;
            const yR = 395 - dt * 0.2;
            updateSimElement(ids.carEnterDamaged, xR, yR, 270, 1.0);
        } 
        else if (t > 120) {
            stopSimulation();
            return;
        }
    } 
    else if (state.activeScenario === 5) {
        // --- CENÁRIO 5: Saída de Pista e Choque contra Barreira Jersey ---
        if (t <= 45) {
            // Carro vermelho corre reto
            const x = 770 - t * 5.0;
            updateSimElement(ids.carRed, x, 280, 270);
        } 
        else if (t > 45 && t <= 90) {
            const dt = t - 45;
            const x = 545 - dt * 3.2;
            const y = 280 - dt * 0.8; // Derrapa saindo da pista
            const r = 270 + dt * 0.4; // Rotaciona de lado
            
            // Revela a marca de derrapagem
            const op = Math.min(0.7, dt * 0.02);
            updateSimElement(ids.skidMark, 530, 290, 10, op);
            updateSimElement(ids.carRed, x, y, r);
        } 
        else if (t > 90 && t <= 130) {
            const dt = t - 90;
            if (dt === 1) {
                // Esconder normais
                updateSimElement(ids.carRed, 0, 0, 0, 0);
                updateSimElement(ids.jerseyNormal, 0, 0, 0, 0);
                
                // Mostrar danificados/deslocados
                updateSimElement(ids.carRedDamaged, 430, 245, 290, 1.0);
                updateSimElement(ids.jerseyDisplaced, 410, 195, -15, 1.0);
            }
            
            // Piscar faíscas/impacto
            if (dt <= 15) {
                const op = dt % 4 < 2 ? 1.0 : 0.2;
                updateSimElement(ids.impact, 430, 215, 0, op);
            } else {
                updateSimElement(ids.impact, 0, 0, 0, 0);
            }
            
            // Ricochete leve do carro
            if (dt <= 15) {
                const xR = 430 + dt * 0.4;
                const yR = 245 + dt * 0.6;
                const rR = 290 - dt * 0.3;
                updateSimElement(ids.carRedDamaged, xR, yR, rR, 1.0);
            }
        } 
        else if (t > 130) {
            stopSimulation();
            return;
        }
    } 
    else if (state.activeScenario === 6) {
        // --- CENÁRIO 6: Circulação Contínua em Rotatória ---
        // Táxi circula na faixa interna infinitamente
        const angleTaxi = (t * 0.012) % (Math.PI * 2);
        const xT = 500 + Math.cos(angleTaxi) * 110;
        const yT = 350 + Math.sin(angleTaxi) * 110;
        const rT = (angleTaxi * 180 / Math.PI);
        updateSimElement(ids.taxiCirc, xT, yT, rT);
        
        // Carro verde faz contorno inferior infinitamente
        const cycleGreen = (t + 150) % 300;
        if (cycleGreen <= 60) {
            const x = 210 + cycleGreen * 2.0;
            updateSimElement(ids.carGreen, x, 305, 90);
        } else if (cycleGreen > 60 && cycleGreen <= 100) {
            updateSimElement(ids.carGreen, 330, 305, 90);
        } else if (cycleGreen > 100 && cycleGreen <= 240) {
            const dt = cycleGreen - 100;
            const angleG = Math.PI + dt * 0.018;
            const xG = 500 + Math.cos(angleG) * 135;
            const yG = 350 + Math.sin(angleG) * 135;
            const rG = (angleG * 180 / Math.PI);
            updateSimElement(ids.carGreen, xG, yG, rG);
        } else {
            const dt = cycleGreen - 240;
            const y = 485 + dt * 3.0;
            updateSimElement(ids.carGreen, 500, y, 0);
        }
        
        // Carro azul entra e circula
        const cycleBlue = t % 300;
        if (cycleBlue <= 60) {
            const x = 790 - cycleBlue * 2.0;
            updateSimElement(ids.carBlue, x, 395, 270);
        } else if (cycleBlue > 60 && cycleBlue <= 100) {
            updateSimElement(ids.carBlue, 670, 395, 270); // Aguarda preferência
        } else if (cycleBlue > 100 && cycleBlue <= 240) {
            const dt = cycleBlue - 100;
            const angleB = 0.3 - dt * 0.018;
            const xB = 500 + Math.cos(angleB) * 135;
            const yB = 350 + Math.sin(angleB) * 135;
            const rB = (angleB * 180 / Math.PI);
            updateSimElement(ids.carBlue, xB, yB, rB);
        } else {
            const dt = cycleBlue - 240;
            const y = 215 - dt * 3.0;
            updateSimElement(ids.carBlue, 500, y, 180);
        }
    } 
    else if (state.activeScenario === 7) {
        // --- CENÁRIO 7: Retorno 180° em Rodovia de Pista Dupla ---
        // Táxi amarelo na reta superior
        const xTaxi = 980 - (t * 3.0) % 900;
        updateSimElement(ids.taxiTop, xTaxi, 197, 270);
        
        // Carro cinza na reta superior
        const xGray = 1200 - (t * 3.5) % 900;
        updateSimElement(ids.carGrayTop, xGray, 197, 270);
        
        // Carro verde na reta inferior
        const xGreen = 100 + (t * 3.0) % 900;
        updateSimElement(ids.carGreenBottom, xGreen, 463, 90);
        
        // Carro branco de retorno
        const cycle = t % 280;
        if (cycle <= 50) {
            const x = 880 - cycle * 5.0;
            updateSimElement(ids.carReturn, x, 197, 270);
        }
        else if (cycle > 50 && cycle <= 100) {
            const dt = cycle - 50;
            const angleRad = (Math.PI / 2) + (dt * Math.PI / 50); 
            const x = 500 + Math.cos(angleRad) * 70;
            const y = 262 + Math.sin(angleRad) * 65;
            const r = (angleRad * 180 / Math.PI) - 90; 
            updateSimElement(ids.carReturn, x, y, r);
        }
        else if (cycle > 100 && cycle <= 160) {
            const dt = cycle - 100;
            const x = 430 + dt * 1.5;
            const y = 327 + dt * 0.6;
            updateSimElement(ids.carReturn, x, y, 110);
        }
        else if (cycle > 160 && cycle <= 200) {
            updateSimElement(ids.carReturn, 520, 363, 90); // Aguarda no recuo
        }
        else if (cycle > 200 && cycle <= 240) {
            const dt = cycle - 200;
            const x = 520 + dt * 6.0; 
            const y = 363 + dt * 2.5; 
            updateSimElement(ids.carReturn, x, y, 112);
        }
        else {
            const dt = cycle - 240;
            const x = 760 + dt * 5.0;
            updateSimElement(ids.carReturn, x, 463, 90);
        }
    }
    else {
        // --- SIMULAÇÃO PERSONALIZADA: nenhum cenário pré-montado ativo ---
        // Processa todos os veículos com velocidade definida pelo usuário
        let hasMoving = false;

        state.elements.forEach(el => {
            if (!el.type.startsWith('vehicle-')) return;
            const speed = el.simSpeed ?? 0;
            if (speed <= 0 || (el.simBehavior ?? 'static') === 'static') return;

            hasMoving = true;
            const behavior = el.simBehavior;

            // Vetor de direção baseado no ângulo atual do veículo
            // O SVG do carro aponta para cima (ângulo 0° = norte), então:
            const rad = (el.angle - 90) * Math.PI / 180;
            let dx = Math.cos(rad) * speed;
            let dy = Math.sin(rad) * speed;

            let newAngle = el.angle;

            if (behavior === 'straight') {
                el.x += dx;
                el.y += dy;
            } else if (behavior === 'brake') {
                // Desacelera linearmente: plena velocidade nos primeiros 40 frames, para em 80
                const brakeFactor = t <= 40 ? 1.0 : Math.max(0, 1.0 - (t - 40) / 40);
                el.x += dx * brakeFactor;
                el.y += dy * brakeFactor;
            } else if (behavior === 'turn-left') {
                newAngle = (el.angle - 1.5 + 360) % 360;
                const radL = (newAngle - 90) * Math.PI / 180;
                el.x += Math.cos(radL) * speed;
                el.y += Math.sin(radL) * speed;
                el.angle = newAngle;
            } else if (behavior === 'turn-right') {
                newAngle = (el.angle + 1.5) % 360;
                const radR = (newAngle - 90) * Math.PI / 180;
                el.x += Math.cos(radR) * speed;
                el.y += Math.sin(radR) * speed;
                el.angle = newAngle;
            }

            // Atualiza o nó SVG diretamente
            const node = document.getElementById(el.id);
            if (node) updateElementNodeTransform(node, el.x, el.y, el.angle, el.scale);
        });
    }
    
    state.simulationFrameId = requestAnimationFrame(animateSimulation);
}

// 5. GERENCIAMENTO DE TRANSFORMAÇÃO E ZOOM DO CANVAS
function setupCanvasTransforms() {
    updateCanvasTransform();
}

function updateCanvasTransform() {
    // Aplica a transformação de zoom e pan no elemento SVG principal
    svgCanvas.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    zoomDisplay.textContent = `${Math.round(state.zoom * 100)}%`;
}

function zoom(factor, clientX = null, clientY = null) {
    const oldZoom = state.zoom;
    let newZoom = state.zoom * factor;
    newZoom = Math.max(0.2, Math.min(newZoom, 4.0)); // Zoom entre 20% e 400%
    
    if (clientX !== null && clientY !== null) {
        // Zoom focado na posição do cursor do mouse
        const rect = canvasWrapper.getBoundingClientRect();
        const mouseX = clientX - rect.left - rect.width / 2;
        const mouseY = clientY - rect.top - rect.height / 2;
        
        // Ajusta pan para manter o ponto abaixo do cursor imóvel
        state.panX = mouseX - (mouseX - state.panX) * (newZoom / oldZoom);
        state.panY = mouseY - (mouseY - state.panY) * (newZoom / oldZoom);
    }
    
    state.zoom = newZoom;
    updateCanvasTransform();
    // Atualizar caixa de seleção se houver elemento ativo
    updateSelectionOverlay();
}

function fitCanvas() {
    // Centraliza o desenho na tela
    const wrapperRect = canvasWrapper.getBoundingClientRect();
    state.zoom = 0.85;
    state.panX = 0;
    state.panY = 0;
    updateCanvasTransform();
    updateSelectionOverlay();
}

// 6. ADICIONAR E REMOVER ELEMENTOS DO MODELO
function addElement(type, x, y, angle = 0, scale = 1.0, color = null, text = '') {
    const template = ELEMENT_TEMPLATES[type];
    if (!template) return;
    
    state.counter++;
    const id = `el-${state.counter}`;
    
    // Define a cor padrão se for pintável
    const elementColor = color || (template.paintable ? template.defaultColor : null);
    
    // Define o texto padrão se for editável e nenhum for passado
    const elementText = text || (template.textEditable ? (template.defaultText || 'Texto') : '');
    
    const newElement = {
        id,
        type,
        x,
        y,
        angle,
        scale,
        color: elementColor,
        text: elementText,
        zIndex: state.elements.length + 1 // topo
    };
    
    state.elements.push(newElement);
    
    // Cria elemento DOM SVG
    createSVGElementNode(newElement);
    
    // Seleciona o novo elemento adicionado
    selectElement(id);
    return id;
}

function createSVGElementNode(el) {
    const template = ELEMENT_TEMPLATES[el.type];
    
    // Grupo principal do elemento (<g>)
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', el.id);
    group.setAttribute('class', 'draggable-element');
    // Aplica filtros de sombra
    group.setAttribute('filter', 'url(#element-shadow)');
    
    // Aplica opacidade se estiver definida no estado
    if (el.opacity !== undefined) {
        group.setAttribute('opacity', el.opacity);
    }
    
    // Atualiza transformações
    updateElementNodeTransform(group, el.x, el.y, el.angle, el.scale);
    
    // Define o conteúdo interno do SVG da template
    group.innerHTML = template.svg;
    
    // Aplica a cor se for pintável
    if (el.color) {
        const paintables = group.querySelectorAll('.paintable-element');
        paintables.forEach(path => path.setAttribute('fill', el.color));
    }
    
    // Se for texto editável, define o texto
    if (template.textEditable) {
        const textNode = group.querySelector('text');
        if (textNode) textNode.textContent = el.text || '';
    }
    
    // Listener de seleção e arraste por mouse
    group.addEventListener('mousedown', (e) => {
        if (state.spacePressed) return; // Se estiver em pan, ignora clique
        e.stopPropagation();
        selectElement(el.id);
        
        // Prepara para arrastar
        startElementDrag(e, el.id, 'move');
    });
    
    // Listener de seleção e arraste por toque (Mobile)
    group.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return; // ignora multitouch para arraste
        e.stopPropagation();
        selectElement(el.id);
        
        const touch = e.touches[0];
        startElementDrag(touch, el.id, 'move');
    }, { passive: false });
    
    elementsLayer.appendChild(group);
}

function updateElementNodeTransform(node, x, y, angle, scale) {
    node.setAttribute('transform', `translate(${x}, ${y}) rotate(${angle}) scale(${scale})`);
}

function selectElement(id) {
    // Limpa seleção antiga
    if (state.selectedId) {
        const prev = document.getElementById(state.selectedId);
        if (prev) prev.classList.remove('selected-element');
    }
    
    state.selectedId = id;
    
    const btnMobileProp = document.getElementById('btn-mobile-properties');
    
    if (id) {
        const el = state.elements.find(item => item.id === id);
        const node = document.getElementById(id);
        if (node) {
            node.classList.add('selected-element');
        }
        
        // Habilitar botão de propriedades no mobile
        if (btnMobileProp) {
            btnMobileProp.classList.remove('disabled');
            btnMobileProp.removeAttribute('disabled');
        }
        
        // Mostra e atualiza propriedades no painel direito
        propEmptyState.classList.add('hidden');
        propEditor.classList.remove('hidden');
        
        // Atualiza campos
        badgeType.textContent = getFriendlyTypeName(el.type);
        infoId.textContent = `ID: ${el.id}`;
        
        inputScale.value = el.scale;
        valScale.textContent = `${el.scale.toFixed(2)}x`;
        
        inputAngle.value = el.angle;
        valAngle.textContent = `${el.angle}°`;
        
        // Habilita/Desabilita seletor de cor
        const template = ELEMENT_TEMPLATES[el.type];
        if (template.paintable) {
            propGroupColor.classList.remove('hidden');
            // Ativa o swatch correto
            document.querySelectorAll('.color-swatch').forEach(swatch => {
                if (swatch.dataset.hex.toLowerCase() === el.color.toLowerCase()) {
                    swatch.classList.add('active');
                } else {
                    swatch.classList.remove('active');
                }
            });
            inputCustomColor.value = el.color;
        } else {
            propGroupColor.classList.add('hidden');
        }
        
        // Habilita/Desabilita editor de texto
        if (template.textEditable) {
            propGroupText.classList.remove('hidden');
            inputElementText.value = el.text || '';
        } else {
            propGroupText.classList.add('hidden');
        }
        
        // Habilita/Desabilita painel de dinâmica do veículo
        const isVehicle = el.type.startsWith('vehicle-');
        if (isVehicle) {
            propGroupSimulation.classList.remove('hidden');
            inputSimSpeed.value = el.simSpeed ?? 0;
            valSimSpeed.textContent = `${el.simSpeed ?? 0} px/f`;
            selectSimBehavior.value = el.simBehavior ?? 'static';
            // Exibe botão flutuante de play
            const btnPlaySim = document.getElementById('btn-play-simulation');
            if (btnPlaySim) btnPlaySim.classList.remove('hidden');
        } else {
            propGroupSimulation.classList.add('hidden');
        }
        
        // Renderiza caixa delimitadora visual no canvas
        updateSelectionOverlay();
    } else {
        // Desabilitar botão de propriedades no mobile e fechar drawers
        if (btnMobileProp) {
            btnMobileProp.classList.add('disabled');
            btnMobileProp.setAttribute('disabled', 'true');
        }
        closeDrawers();
        
        // Esconde painel
        propEmptyState.classList.remove('hidden');
        propEditor.classList.add('hidden');
        // Remove caixa de seleção
        selectionLayer.innerHTML = '';
    }
}

function updateSelectedElementProperty(prop, value) {
    if (!state.selectedId) return;
    
    const el = state.elements.find(item => item.id === state.selectedId);
    if (!el) return;
    
    const node = document.getElementById(state.selectedId);
    
    if (prop === 'scale') {
        el.scale = parseFloat(value);
        valScale.textContent = `${el.scale.toFixed(2)}x`;
        if (node) updateElementNodeTransform(node, el.x, el.y, el.angle, el.scale);
    } else if (prop === 'angle') {
        // Normaliza ângulo entre 0 e 359
        el.angle = (parseInt(value) + 360) % 360;
        valAngle.textContent = `${el.angle}°`;
        inputAngle.value = el.angle;
        if (node) updateElementNodeTransform(node, el.x, el.y, el.angle, el.scale);
    } else if (prop === 'color') {
        el.color = value;
        if (node) {
            const paintables = node.querySelectorAll('.paintable-element');
            paintables.forEach(p => p.setAttribute('fill', value));
        }
    } else if (prop === 'text') {
        el.text = value;
        if (node) {
            const textNode = node.querySelector('text');
            if (textNode) textNode.textContent = value || '';
        }
    }
    
    // Atualiza a caixa de seleção ao redor do elemento
    updateSelectionOverlay();
}

function deleteElement(id) {
    if (!id) return;
    
    // Remove do DOM
    const node = document.getElementById(id);
    if (node) node.remove();
    
    // Remove do array de estado
    state.elements = state.elements.filter(item => item.id !== id);
    
    // Se era o selecionado, limpa seleção
    if (state.selectedId === id) {
        selectElement(null);
    }
}

function duplicateElement(id) {
    if (!id) return;
    
    const el = state.elements.find(item => item.id === id);
    if (!el) return;
    
    // Clona o elemento com um offset de 40px no X e Y para diferenciar
    const newId = addElement(el.type, el.x + 40, el.y + 40, el.angle, el.scale, el.color, el.text);
    selectElement(newId);
}

// 7. DESENHAR OVERLAY DE SELEÇÃO (Figma/Illustrator Style)
function updateSelectionOverlay() {
    selectionLayer.innerHTML = '';
    
    if (!state.selectedId) return;
    
    const el = state.elements.find(item => item.id === state.selectedId);
    if (!el) return;
    
    const template = ELEMENT_TEMPLATES[el.type];
    
    // Largura e altura da caixa delimitadora com base na template do elemento
    const w = template.width;
    const h = template.height;
    
    // Cria grupo de seleção
    const selGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    selGroup.setAttribute('transform', `translate(${el.x}, ${el.y}) rotate(${el.angle}) scale(${el.scale})`);
    
    // 1. Caixa pontilhada ao redor do elemento
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', -w/2 - 6);
    rect.setAttribute('y', -h/2 - 6);
    rect.setAttribute('width', w + 12);
    rect.setAttribute('height', h + 12);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', '#00adb5');
    rect.setAttribute('stroke-width', '1.5');
    rect.setAttribute('stroke-dasharray', '5,3');
    rect.setAttribute('rx', '4');
    selGroup.appendChild(rect);
    
    // 2. Alça de rotação (Linha + Círculo no topo)
    const rotLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rotLine.setAttribute('x1', 0);
    rotLine.setAttribute('y1', -h/2 - 6);
    rotLine.setAttribute('x2', 0);
    rotLine.setAttribute('y2', -h/2 - 28);
    rotLine.setAttribute('stroke', '#00adb5');
    rotLine.setAttribute('stroke-width', '1.5');
    selGroup.appendChild(rotLine);
    
    const rotHandle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    rotHandle.setAttribute('cx', 0);
    rotHandle.setAttribute('cy', -h/2 - 28);
    rotHandle.setAttribute('r', '6');
    rotHandle.setAttribute('fill', '#ffffff');
    rotHandle.setAttribute('stroke', '#00adb5');
    rotHandle.setAttribute('stroke-width', '2');
    rotHandle.setAttribute('cursor', 'alias');
    rotHandle.setAttribute('pointer-events', 'all'); // Captura mousedown
    
    rotHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        startElementDrag(e, el.id, 'rotate');
    });
    selGroup.appendChild(rotHandle);
    
    // 3. Alça de Redimensionamento (Canto inferior direito)
    const resizeHandle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    resizeHandle.setAttribute('x', w/2 + 2);
    resizeHandle.setAttribute('y', h/2 + 2);
    resizeHandle.setAttribute('width', '8');
    resizeHandle.setAttribute('height', '8');
    resizeHandle.setAttribute('fill', '#ffffff');
    resizeHandle.setAttribute('stroke', '#00adb5');
    resizeHandle.setAttribute('stroke-width', '2');
    resizeHandle.setAttribute('cursor', 'se-resize');
    resizeHandle.setAttribute('pointer-events', 'all');
    
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        startElementDrag(e, el.id, 'resize');
    });
    selGroup.appendChild(resizeHandle);
    
    selectionLayer.appendChild(selGroup);
}

// Conversão matemática de coordenadas de tela (clientX, clientY) para coordenadas locais do Canvas SVG
function screenToSVGCoords(clientX, clientY) {
    const pt = svgCanvas.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    
    // Transforma usando a matriz de transformação atual do SVG (inclui escala e zoom)
    const svgPt = pt.matrixTransform(svgCanvas.getScreenCTM().inverse());
    return { x: svgPt.x, y: svgPt.y };
}

// 8. CONTROLE DE CAMADAS (Z-INDEX)
function adjustElementLayer(action) {
    if (!state.selectedId) return;
    
    const elNode = document.getElementById(state.selectedId);
    if (!elNode) return;
    
    const el = state.elements.find(item => item.id === state.selectedId);
    
    if (action === 'top') {
        // Remove do DOM e adiciona no final (topo visual)
        elementsLayer.appendChild(elNode);
        // Atualiza zIndex no modelo
        state.elements = state.elements.filter(item => item.id !== el.id);
        state.elements.push(el);
    } else if (action === 'bottom') {
        // Adiciona no início (fundo visual)
        elementsLayer.insertBefore(elNode, elementsLayer.firstChild);
        state.elements = state.elements.filter(item => item.id !== el.id);
        state.elements.unshift(el);
    } else if (action === 'up') {
        // Sobe um irmão no DOM
        const nextNode = elNode.nextElementSibling;
        if (nextNode) {
            elementsLayer.insertBefore(nextNode, elNode); // Inverte posições
            
            // Atualiza array do estado
            const idx = state.elements.findIndex(item => item.id === el.id);
            if (idx < state.elements.length - 1) {
                const temp = state.elements[idx];
                state.elements[idx] = state.elements[idx + 1];
                state.elements[idx + 1] = temp;
            }
        }
    } else if (action === 'down') {
        // Desce um irmão no DOM
        const prevNode = elNode.previousElementSibling;
        if (prevNode) {
            elementsLayer.insertBefore(elNode, prevNode);
            
            // Atualiza array do estado
            const idx = state.elements.findIndex(item => item.id === el.id);
            if (idx > 0) {
                const temp = state.elements[idx];
                state.elements[idx] = state.elements[idx - 1];
                state.elements[idx - 1] = temp;
            }
        }
    }
}

// 9. LÓGICA DE INTERAÇÃO MOUSE / TECLADO
// 9. LÓGICA DE INTERAÇÃO MOUSE / TECLADO E TOQUE
function setupEventListeners() {
    
    // --- DRAG E DROP DA SIDEBAR PARA O CANVAS (DESKTOP) ---
    // Os eventos de dragstart da biblioteca são anexados dinamicamente no generateLibraryPreviews
    canvasWrapper.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessário para permitir o drop
        e.dataTransfer.dropEffect = 'copy';
    });
    
    canvasWrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain') || state.draggedLibraryType;
        if (!type) return;
        
        // Coordenadas do cursor no SVG
        const coords = screenToSVGCoords(e.clientX, e.clientY);
        
        // Se snap estiver ativado, posicionar alinhado no drop
        let targetX = coords.x;
        let targetY = coords.y;
        if (state.isSnapEnabled) {
            targetX = Math.round(targetX / state.gridSize) * state.gridSize;
            targetY = Math.round(targetY / state.gridSize) * state.gridSize;
        }
        
        // Cria elemento no canvas
        addElement(type, targetX, targetY);
        state.draggedLibraryType = null;
    });

    // --- SELEÇÃO DE CLIQUE FORA (LIMPAR SELEÇÃO) ---
    svgCanvas.addEventListener('mousedown', (e) => {
        // Se clicar diretamente no fundo ou na grade, limpa a seleção
        if (e.target.id === 'canvas-background' || e.target.id === 'canvas-grid') {
            selectElement(null);
            
            // Inicia navegação panorâmica (Pan) se não estiver arrastando
            startPan(e);
        }
    });
    
    // Suporte a Toque - Iniciar Pan pelo fundo do canvas (Mobile)
    svgCanvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return; // ignora multitouch para Pan simples
        if (e.target.id === 'canvas-background' || e.target.id === 'canvas-grid') {
            selectElement(null);
            
            const touch = e.touches[0];
            state.isPanning = true;
            canvasWrapper.classList.add('panning');
            state.panStart.x = touch.clientX - state.panX;
            state.panStart.y = touch.clientY - state.panY;
        }
    }, { passive: true });

    // Suporte a Toque - Pinch to Zoom (Pinça com dois dedos)
    let lastTouchDistance = 0;
    
    canvasWrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            lastTouchDistance = getTouchDistance(e);
        }
    }, { passive: true });
    
    canvasWrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            const dist = getTouchDistance(e);
            if (lastTouchDistance > 0) {
                const factor = dist / lastTouchDistance;
                // Zoom centralizado entre os dois dedos
                const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                zoom(factor, midX, midY);
            }
            lastTouchDistance = dist;
            e.preventDefault(); // Impede rolagem padrão da página
        }
    }, { passive: false });
    
    canvasWrapper.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
            lastTouchDistance = 0;
        }
    }, { passive: true });
    
    function getTouchDistance(e) {
        return Math.sqrt(
            Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
        );
    }

    // --- LÓGICA DOS SLIDERS E INSPETOR ---
    inputScale.addEventListener('input', (e) => {
        updateSelectedElementProperty('scale', e.target.value);
    });
    
    inputAngle.addEventListener('input', (e) => {
        updateSelectedElementProperty('angle', e.target.value);
    });
    
    // Quick Angles Buttons
    document.querySelectorAll('.angle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateSelectedElementProperty('angle', btn.dataset.angle);
        });
    });
    
    inputCustomColor.addEventListener('input', (e) => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        updateSelectedElementProperty('color', e.target.value);
    });

    inputElementText.addEventListener('input', (e) => {
        updateSelectedElementProperty('text', e.target.value);
    });

    // --- CONTROLES DE SIMULAÇÃO PERSONALIZADA ---
    if (inputSimSpeed) {
        inputSimSpeed.addEventListener('input', (e) => {
            if (!state.selectedId) return;
            const el = state.elements.find(el => el.id === state.selectedId);
            if (!el || !el.type.startsWith('vehicle-')) return;
            el.simSpeed = parseFloat(e.target.value);
            valSimSpeed.textContent = `${el.simSpeed} px/f`;
            // Exibir o botão de play se não estiver visível
            const btnPlaySim = document.getElementById('btn-play-simulation');
            if (btnPlaySim && el.simSpeed > 0) btnPlaySim.classList.remove('hidden');
        });
    }

    if (selectSimBehavior) {
        selectSimBehavior.addEventListener('change', (e) => {
            if (!state.selectedId) return;
            const el = state.elements.find(el => el.id === state.selectedId);
            if (!el || !el.type.startsWith('vehicle-')) return;
            el.simBehavior = e.target.value;
        });
    }

    // Layering / Order
    document.getElementById('btn-layer-top').addEventListener('click', () => adjustElementLayer('top'));
    document.getElementById('btn-layer-bottom').addEventListener('click', () => adjustElementLayer('bottom'));
    document.getElementById('btn-layer-up').addEventListener('click', () => adjustElementLayer('up'));
    document.getElementById('btn-layer-down').addEventListener('click', () => adjustElementLayer('down'));
    
    // Ações de Duplicar/Excluir
    document.getElementById('btn-duplicate-element').addEventListener('click', () => {
        duplicateElement(state.selectedId);
    });
    document.getElementById('btn-delete-element').addEventListener('click', () => {
        deleteElement(state.selectedId);
    });

    // --- CONTROLES DE ZOOM DO HEADER ---
    btnZoomIn.addEventListener('click', () => zoom(1.15));
    btnZoomOut.addEventListener('click', () => zoom(0.85));
    btnZoomReset.addEventListener('click', fitCanvas);
    
    // Zoom com roda do mouse (Scroll Wheel)
    canvasWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        zoom(factor, e.clientX, e.clientY);
    }, { passive: false });

    // Alternar Grade / Snap
    btnToggleGrid.addEventListener('click', () => {
        state.isGridEnabled = !state.isGridEnabled;
        const gridNode = document.getElementById('canvas-grid');
        if (state.isGridEnabled) {
            gridNode.style.display = 'block';
            btnToggleGrid.classList.add('active');
        } else {
            gridNode.style.display = 'none';
            btnToggleGrid.classList.remove('active');
        }
    });
    
    btnToggleSnap.addEventListener('click', () => {
        state.isSnapEnabled = !state.isSnapEnabled;
        if (state.isSnapEnabled) {
            btnToggleSnap.classList.add('active');
        } else {
            btnToggleSnap.classList.remove('active');
        }
    });

    // Limpar Canvas
    btnClear.addEventListener('click', () => {
        clearCanvas(true);
    });

    // --- LÓGICA DO HELP MODAL ---
    btnHelp.addEventListener('click', () => helpModal.classList.remove('hidden'));
    btnCloseModal.addEventListener('click', () => helpModal.classList.add('hidden'));
    btnCloseHelp.addEventListener('click', () => helpModal.classList.add('hidden'));
    
    // Fechar ao clicar fora do modal
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.classList.add('hidden');
    });

    // --- LÓGICA DO SCENARIOS MODAL ---
    if (btnScenarios) {
        btnScenarios.addEventListener('click', () => scenariosModal.classList.remove('hidden'));
    }
    if (btnCloseScenariosModal) {
        btnCloseScenariosModal.addEventListener('click', () => scenariosModal.classList.add('hidden'));
    }
    
    // Fechar ao clicar fora do modal
    if (scenariosModal) {
        scenariosModal.addEventListener('click', (e) => {
            if (e.target === scenariosModal) scenariosModal.classList.add('hidden');
        });
    }
    
    // Configurar cliques nos cards de cenário
    const scenarioCards = document.querySelectorAll('.scenario-card');
    scenarioCards.forEach(card => {
        card.addEventListener('click', () => {
            const scenarioId = parseInt(card.dataset.scenario);
            if (scenarioId) {
                loadPresetScenario(scenarioId);
                scenariosModal.classList.add('hidden');
            }
        });
    });

    // Configurar clique no botão flutuante de simulação
    const btnPlaySim = document.getElementById('btn-play-simulation');
    if (btnPlaySim) {
        btnPlaySim.addEventListener('click', () => {
            if (state.isSimulationPlaying) {
                stopSimulation();
            } else {
                startSimulation();
            }
        });
    }

    // --- EXPORTAÇÕES (SVG e PNG) ---
    btnExportSvg.addEventListener('click', exportToSVG);
    btnExportPng.addEventListener('click', exportToPNG);

    // --- EVENTOS DO WINDOWS (MOUSEMOVE & MOUSEUP PARA ARRASTE) ---
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    
    // Suporte a gestos touch no window
    window.addEventListener('touchmove', (e) => {
        if (state.isDragging || state.isPanning) {
            if (e.touches.length === 1) {
                handleWindowMouseMove(e.touches[0]);
                e.preventDefault(); // Impede scroll indesejado do site inteiro no mobile
            }
        }
    }, { passive: false });
    
    window.addEventListener('touchend', handleWindowMouseUp);
    
    // Teclado
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

// --- FUNÇÃO DO MOUSEMOVE NO WINDOW ---
function handleWindowMouseMove(e) {
    // 1. Pan panorâmico do canvas
    if (state.isPanning) {
        state.panX = e.clientX - state.panStart.x;
        state.panY = e.clientY - state.panStart.y;
        updateCanvasTransform();
        return;
    }
    
    // 2. Arraste interativo de elementos ou handles de controle
    if (state.isDragging && state.selectedId) {
        const el = state.elements.find(item => item.id === state.selectedId);
        if (!el) return;
        
        // Coordenadas atuais do cursor convertidas para SVG
        const coords = screenToSVGCoords(e.clientX, e.clientY);
        
        if (state.dragType === 'move') {
            // Mover elemento
            let dx = coords.x - state.dragStart.x;
            let dy = coords.y - state.dragStart.y;
            
            let targetX = state.draggedElementInitial.x + dx;
            let targetY = state.draggedElementInitial.y + dy;
            
            // Snap to grid se ativado
            if (state.isSnapEnabled) {
                targetX = Math.round(targetX / state.gridSize) * state.gridSize;
                targetY = Math.round(targetY / state.gridSize) * state.gridSize;
            }
            
            el.x = targetX;
            el.y = targetY;
            
            const node = document.getElementById(state.selectedId);
            if (node) updateElementNodeTransform(node, el.x, el.y, el.angle, el.scale);
            
            updateSelectionOverlay();
        } 
        else if (state.dragType === 'rotate') {
            // Rotacionar elemento (Calcula ângulo entre o cursor e o centro do elemento)
            const dx = coords.x - el.x;
            const dy = coords.y - el.y;
            
            // Ângulo em radianos para graus
            let angleRad = Math.atan2(dy, dx);
            let angleDeg = angleRad * (180 / Math.PI);
            
            // Adiciona 90 graus pois a alça está no topo do elemento
            let targetAngle = Math.round(angleDeg + 90);
            
            // Normaliza em 0-359
            targetAngle = (targetAngle + 360) % 360;
            
            // Opcional: Snap de rotação em incrementos de 15 graus com a tecla Shift pressionada
            if (e.shiftKey) {
                targetAngle = Math.round(targetAngle / 15) * 15;
            }
            
            updateSelectedElementProperty('angle', targetAngle);
        }
        else if (state.dragType === 'resize') {
            // Redimensionar / Escalar elemento
            const template = ELEMENT_TEMPLATES[el.type];
            
            // Distância inicial entre o centro e a alça inferior direita original
            const d0 = Math.sqrt(Math.pow(template.width / 2, 2) + Math.pow(template.height / 2, 2));
            
            // Distância atual entre o centro e o cursor do mouse
            const d1 = Math.sqrt(Math.pow(coords.x - el.x, 2) + Math.pow(coords.y - el.y, 2));
            
            // Fator de escala
            let targetScale = d1 / d0;
            
            // Limitar escala
            targetScale = Math.max(0.3, Math.min(targetScale, 3.0));
            // Arredonda para 2 casas
            targetScale = Math.round(targetScale * 20) / 20; 
            
            updateSelectedElementProperty('scale', targetScale);
        }
    }
}

// --- FUNÇÃO DO MOUSEUP NO WINDOW ---
function handleWindowMouseUp() {
    if (state.isPanning) {
        state.isPanning = false;
        canvasWrapper.classList.remove('panning');
    }
    
    if (state.isDragging) {
        state.isDragging = false;
        state.dragType = null;
    }
}

// --- CONTROLE DE TECLADO ---
function handleKeyDown(e) {
    // Ignora atalhos de desenho e movimentação se estiver com foco em algum input de texto
    if (document.activeElement.tagName === 'INPUT') return;

    const key = e.key.toUpperCase();
    
    // Atalho de Espaço para Panorâmica rápida (Pan)
    if (e.key === ' ' || e.code === 'Space') {
        if (!state.spacePressed) {
            state.spacePressed = true;
            canvasWrapper.classList.add('panning');
        }
        // Evita rolagem de página padrão no espaço
        e.preventDefault();
        return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
        // Excluir elemento
        deleteElement(state.selectedId);
        e.preventDefault();
    }
    
    if (e.ctrlKey && key === 'D') {
        // Duplicar elemento
        duplicateElement(state.selectedId);
        e.preventDefault();
    }
    
    if (e.key === 'Escape') {
        // Cancela seleção
        selectElement(null);
    }
    
    if (key === 'G') {
        // Liga/desliga grade
        btnToggleGrid.click();
    }
    
    if (key === 'R' && state.selectedId) {
        // Rotacionar em passos de 45°
        const el = state.elements.find(item => item.id === state.selectedId);
        if (el) {
            const nextAngle = (el.angle + 45) % 360;
            updateSelectedElementProperty('angle', nextAngle);
        }
        e.preventDefault();
    }
    
    // Setas do teclado para movimentação pixel-perfect dos elementos selecionados
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && state.selectedId) {
        const el = state.elements.find(item => item.id === state.selectedId);
        if (el) {
            // Se Shift estiver pressionado, move 10px; se não, 1px
            const step = e.shiftKey ? 10 : 1;
            if (e.key === 'ArrowUp') el.y -= step;
            if (e.key === 'ArrowDown') el.y += step;
            if (e.key === 'ArrowLeft') el.x -= step;
            if (e.key === 'ArrowRight') el.x += step;
            
            const node = document.getElementById(state.selectedId);
            if (node) updateElementNodeTransform(node, el.x, el.y, el.angle, el.scale);
            
            updateSelectionOverlay();
        }
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    if (document.activeElement.tagName === 'INPUT') return;
    if (e.key === ' ' || e.code === 'Space') {
        state.spacePressed = false;
        canvasWrapper.classList.remove('panning');
    }
}

// --- FUNÇÃO PANORÂMICA (PAN) ---
function startPan(e) {
    state.isPanning = true;
    canvasWrapper.classList.add('panning');
    // Salva o ponto de clique inicial menos a rolagem atual do pan
    state.panStart.x = e.clientX - state.panX;
    state.panStart.y = e.clientY - state.panY;
}

// --- FUNÇÃO ARRASTE DE ELEMENTOS ---
function startElementDrag(e, id, dragType) {
    state.isDragging = true;
    state.dragType = dragType;
    
    const el = state.elements.find(item => item.id === id);
    if (!el) return;
    
    // Grava posições e dimensões iniciais para delta relativo
    state.draggedElementInitial = {
        x: el.x,
        y: el.y,
        angle: el.angle,
        scale: el.scale
    };
    
    // Converte ponto inicial do clique na escala do SVG
    const coords = screenToSVGCoords(e.clientX, e.clientY);
    state.dragStart = coords;
}

// 10. EXPORTAÇÃO DO CROQUI DE TRÂNSITO (SVG / PNG)

// Retorna uma string XML de SVG contendo todos os elementos prontos para salvamento
function buildFullSVGString() {
    // Clona o SVG do canvas e remove os elementos de controle/grade/seleção
    const svgClone = svgCanvas.cloneNode(true);
    
    // Remove elementos de controle de UI
    const gridNode = svgClone.getElementById('canvas-grid');
    if (gridNode) gridNode.remove();
    
    const selectionNode = svgClone.getElementById('selection-layer');
    if (selectionNode) selectionNode.remove();
    
    // Se quiser ajustar a caixa para caber apenas os elementos (BBox):
    // Mas o padrão de manter o viewBox é excelente.
    
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgClone);
}

function exportToSVG() {
    try {
        const svgString = buildFullSVGString();
        
        // Criar blob de download
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `croqui_transito_${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        alert('Erro ao exportar SVG: ' + err.message);
    }
}

function exportToPNG() {
    // Exibe overlay de carregamento
    loadingOverlay.classList.remove('hidden');
    loadingText.textContent = 'Renderizando croqui de trânsito em alta resolução...';
    
    setTimeout(() => {
        try {
            // Remove seleção ativa temporariamente para não sair na foto
            const activeId = state.selectedId;
            selectElement(null);
            
            const svgString = buildFullSVGString();
            
            // Restaura seleção
            if (activeId) selectElement(activeId);
            
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const img = new Image();
            img.onload = function() {
                // Criar canvas 2D na mesma proporção do SVG
                const canvas = document.createElement('canvas');
                canvas.width = svgCanvas.width.baseVal.value;
                canvas.height = svgCanvas.height.baseVal.value;
                const ctx = canvas.getContext('2d');
                
                // Desenha a imagem do SVG no canvas 2D
                ctx.drawImage(img, 0, 0);
                
                // Converte para PNG
                const pngUrl = canvas.toDataURL('image/png');
                
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = `croqui_transito_${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                URL.revokeObjectURL(url);
                loadingOverlay.classList.add('hidden');
            };
            
            img.onerror = function() {
                throw new Error("Falha ao renderizar imagem vetorial no canvas rasterizado.");
            };
            
            img.src = url;
            
        } catch (err) {
            loadingOverlay.classList.add('hidden');
            alert('Erro ao exportar PNG: ' + err.message);
        }
    }, 400); // delay para dar tempo ao spinner do loader rodar de forma suave
}

// 11. UTILITÁRIOS GERAIS
function getFriendlyTypeName(type) {
    if (type.startsWith('building')) return 'Prédio/Loja';
    if (type.startsWith('text')) return 'Texto';
    if (type.startsWith('road')) return 'Pista/Via';
    if (type.startsWith('sign')) return 'Placa/Sinal';
    if (type.startsWith('marking')) return 'Marcação Solo';
    if (type.startsWith('structure')) return 'Estrutura';
    if (type.startsWith('vehicle-car')) return 'Carro';
    if (type.startsWith('vehicle-truck')) return 'Caminhão';
    if (type.startsWith('vehicle-motorcycle')) return 'Moto';
    if (type.startsWith('vehicle-bus')) return 'Ônibus';
    return 'Elemento';
}

// Executar Inicialização do App ao carregar
window.addEventListener('DOMContentLoaded', () => {
    if (window.__croquiAppInitialized) return;
    window.__croquiAppInitialized = true;
    init();
});
