const fs = require('fs');
const path = require('path');

const files = ['index.html', 'admin.html', 'apuestas.html', 'game.html', 'login.html', 'tournament.html'];

// Inject script and select into navbars
const navReplacement = `
        <li role="none"><a href="game.html" class="nav-link nav-link-game" role="menuitem" id="navPlayGame" data-i18n="nav_play">⚽ Jugar</a></li>
        <li role="none"><a href="login.html" class="nav-link nav-link-game" role="menuitem" style="background-color: var(--blue); color: #fff; margin-left: 8px;" data-i18n="nav_login">👤 Login</a></li>
        <li role="none" style="margin-left: 8px;">
          <select class="lang-selector" aria-label="Seleccionar idioma" style="background: rgba(255,255,255,0.1); border: 1px solid var(--border); border-radius: 4px; color: var(--text); padding: 4px 8px; outline: none; cursor: pointer; font-family: 'Outfit', sans-serif;">
            <option value="ca">VAL</option>
            <option value="es" style="color: black;">ESP</option>
          </select>
        </li>
      </ul>
`;

const headScript = `
  <script src="firebase-config.js"></script>
  <script src="auth.js"></script>
  <script src="i18n.js"></script>
`;

const dictCa = {
    // --- Index (Rulebook) ---
    "Inscripció": "idx_nav_inscripcio",
    "Premis": "idx_nav_premis",
    "Fases": "idx_nav_fases",
    "Puntuació": "idx_nav_punt",
    "Desempats": "idx_nav_desempats",
    "Validesa": "idx_nav_validesa",
    "🏆 Classificació": "nav_tour",
    
    // Let's do targeted replaces for index.html sections
    '<h3 class="qnav-title">Inscripció</h3>': '<h3 class="qnav-title" data-i18n="idx_qnav_inscripcio_title">Inscripció</h3>',
    '<p class="qnav-desc">Terminis i fons econòmic</p>': '<p class="qnav-desc" data-i18n="idx_qnav_inscripcio_desc">Terminis i fons econòmic</p>',
    '<h3 class="qnav-title">Premis</h3>': '<h3 class="qnav-title" data-i18n="idx_qnav_premis_title">Premis</h3>',
    '<p class="qnav-desc">Distribució del premi</p>': '<p class="qnav-desc" data-i18n="idx_qnav_premis_desc">Distribució del premi</p>',
    '<h3 class="qnav-title">Fases</h3>': '<h3 class="qnav-title" data-i18n="idx_qnav_fases_title">Fases</h3>',
    '<p class="qnav-desc">Estructura del torneig</p>': '<p class="qnav-desc" data-i18n="idx_qnav_fases_desc">Estructura del torneig</p>',
    '<h3 class="qnav-title">Puntuació</h3>': '<h3 class="qnav-title" data-i18n="idx_qnav_punt_title">Puntuació</h3>',
    '<p class="qnav-desc">Com s\'acumulen els punts</p>': '<p class="qnav-desc" data-i18n="idx_qnav_punt_desc">Com s\'acumulen els punts</p>',
    '<h3 class="qnav-title">Hores Límit</h3>': '<h3 class="qnav-title" data-i18n="idx_qnav_hores_title">Hores Límit</h3>',
    '<p class="qnav-desc">Terminis de la final</p>': '<p class="qnav-desc" data-i18n="idx_qnav_hores_desc">Terminis de la final</p>',
    '<h3 class="qnav-title">Desempats</h3>': '<h3 class="qnav-title" data-i18n="idx_qnav_desempats_title">Desempats</h3>',
    '<p class="qnav-desc">Criteris de desempat</p>': '<p class="qnav-desc" data-i18n="idx_qnav_desempats_desc">Criteris de desempat</p>',
    '<h3 class="qnav-title">Validesa</h3>': '<h3 class="qnav-title" data-i18n="idx_qnav_validesa_title">Validesa</h3>',
    '<p class="qnav-desc">Regles i condicions</p>': '<p class="qnav-desc" data-i18n="idx_qnav_validesa_desc">Regles i condicions</p>',

    '<h2 class="section-title" id="title-inscripcio">Inscripció i Fons Econòmic</h2>': '<h2 class="section-title" id="title-inscripcio" data-i18n="idx_sec1_title">Inscripció i Fons Econòmic</h2>',
    '<p class="section-subtitle">Tot el que necessites saber per participar a la porra i com es constitueix el premi total.</p>': '<p class="section-subtitle" data-i18n="idx_sec1_sub">Tot el que necessites saber per participar a la porra i com es constitueix el premi total.</p>',
    
    '<h2 class="section-title" id="title-premis">Estructura de Premis</h2>': '<h2 class="section-title" id="title-premis" data-i18n="idx_sec2_title">Estructura de Premis</h2>',
    '<p class="section-subtitle">Coneix com es distribueix el premi total entre els participants guanyadors.</p>': '<p class="section-subtitle" data-i18n="idx_sec2_sub">Coneix com es distribueix el premi total entre els participants guanyadors.</p>',
    
    '<h2 class="section-title" id="title-fases">Fases del Joc</h2>': '<h2 class="section-title" id="title-fases" data-i18n="idx_sec3_title">Fases del Joc</h2>',
    '<p class="section-subtitle">El torneig es divideix en diverses fases, cadascuna amb les seues pròpies normes de pronòstic.</p>': '<p class="section-subtitle" data-i18n="idx_sec3_sub">El torneig es divideix en diverses fases, cadascuna amb les seues pròpies normes de pronòstic.</p>',
    
    '<h2 class="section-title" id="title-puntuacio">Sistema de Puntuació</h2>': '<h2 class="section-title" id="title-puntuacio" data-i18n="idx_sec4_title">Sistema de Puntuació</h2>',
    '<p class="section-subtitle">Com s\'atorguen els punts al llarg de tot el torneig.</p>': '<p class="section-subtitle" data-i18n="idx_sec4_sub">Com s\'atorguen els punts al llarg de tot el torneig.</p>',
    
    '<h2 class="section-title" id="title-hores">Hores Límit de la Final</h2>': '<h2 class="section-title" id="title-hores" data-i18n="idx_sec5_title">Hores Límit de la Final</h2>',
    '<p class="section-subtitle">Terminis específics per als pronòstics de la fase final del torneig.</p>': '<p class="section-subtitle" data-i18n="idx_sec5_sub">Terminis específics per als pronòstics de la fase final del torneig.</p>',
    
    '<h2 class="section-title" id="title-desempats">Criteris de Desempat</h2>': '<h2 class="section-title" id="title-desempats" data-i18n="idx_sec6_title">Criteris de Desempat</h2>',
    '<p class="section-subtitle">En cas d\'igualtat de punts entre participants, s\'aplicaran els següents criteris per ordre de prioritat.</p>': '<p class="section-subtitle" data-i18n="idx_sec6_sub">En cas d\'igualtat de punts entre participants, s\'aplicaran els següents criteris per ordre de prioritat.</p>',
    
    '<h2 class="section-title" id="title-validesa">Regles de Validesa</h2>': '<h2 class="section-title" id="title-validesa" data-i18n="idx_sec7_title">Regles de Validesa</h2>',
    '<p class="section-subtitle">Condicions que determinen la validesa d\'una quiniela i del joc en general.</p>': '<p class="section-subtitle" data-i18n="idx_sec7_sub">Condicions que determinen la validesa d\'una quiniela i del joc en general.</p>'
};

// More targeted replaces for other files
const adminReplacements = {
    '<title>🔐 Panel d\'Administrador – Chapas 2026</title>': '<title data-i18n="admin_title">🔐 Panel d\'Administrador – Chapas 2026</title>',
    '<div class="admin-brand">🔐 Admin Porra</div>': '<div class="admin-brand" data-i18n="admin_brand">🔐 Admin Porra</div>',
    '<button class="tab-btn active" data-tab="partidos">⚽ Partits</button>': '<button class="tab-btn active" data-tab="partidos" data-i18n="admin_tab_matches">⚽ Partits</button>',
    '<button class="tab-btn" data-tab="equipos">🛡️ Equips</button>': '<button class="tab-btn" data-tab="equipos" data-i18n="admin_tab_teams">🛡️ Equips</button>',
    '<button class="tab-btn" data-tab="config">⚙️ Configuració</button>': '<button class="tab-btn" data-tab="config" data-i18n="admin_tab_config">⚙️ Configuració</button>',
    '<button class="logout-btn" id="logoutBtn">Tancar sessió</button>': '<button class="logout-btn" id="logoutBtn" data-i18n="logout">Tancar sessió</button>',
    '<div class="panel-title">⚽ Gestió de Partits</div>': '<div class="panel-title" data-i18n="admin_panel_title_matches">⚽ Gestió de Partits</div>',
    '<div class="panel-title">🛡️ Gestió d\'Equips i Torneig</div>': '<div class="panel-title" data-i18n="admin_panel_title_teams">🛡️ Gestió d\'Equips i Torneig</div>',
    '<div class="panel-title">⚙️ Configuració</div>': '<div class="panel-title" data-i18n="admin_panel_title_config">⚙️ Configuració</div>',
    '<div>Verificant credencials...</div>': '<div data-i18n="loading">Verificant credencials...</div>'
};

const apuestasReplacements = {
    '<title>🎲 La Porra – Chapas 2026</title>': '<title data-i18n="dash_title">🎲 La Porra – Chapas 2026</title>',
    '<div class="admin-brand">🎲 La Porra 2026</div>': '<div class="admin-brand" data-i18n="dash_brand">🎲 La Porra 2026</div>',
    '<button class="tab-btn active" data-tab="prediccions">📝 Les Meves Prediccions</button>': '<button class="tab-btn active" data-tab="prediccions" data-i18n="dash_tab_pred">📝 Les Meves Prediccions</button>',
    '<button class="tab-btn" data-tab="torneo">🌍 Torneig</button>': '<button class="tab-btn" data-tab="torneo" data-i18n="dash_tab_tour">🌍 Torneig</button>',
    '<button class="tab-btn" data-tab="ranking">🏆 Rànquing Porra</button>': '<button class="tab-btn" data-tab="ranking" data-i18n="dash_tab_rank">🏆 Rànquing Porra</button>',
    '<a href="tournament.html" class="hd-link">🌍 Resultats Reals</a>': '<a href="tournament.html" class="hd-link" data-i18n="dash_hd_link">🌍 Resultats Reals</a>',
    '<div>Verificant credencials...</div>': '<div data-i18n="loading">Verificant credencials...</div>',
    '<button class="logout-btn" id="logoutBtn">Tancar sessió</button>': '<button class="logout-btn" id="logoutBtn" data-i18n="logout">Tancar sessió</button>'
};

const gameReplacements = {
    '<title>⚽ Chapas World Cup 2026</title>': '<title data-i18n="game_title">⚽ Chapas World Cup 2026</title>',
    '<div class="admin-brand">⚽ Chapas 2026</div>': '<div class="admin-brand" data-i18n="game_title">⚽ Chapas 2026</div>',
    '<a href="index.html" class="hd-link">🏠 Inici</a>': '<a href="index.html" class="hd-link" data-i18n="game_btn_home">🏠 Inici</a>',
    '<h2 class="panel-title" style="justify-content:center;">Selecciona els teus Equips</h2>': '<h2 class="panel-title" style="justify-content:center;" data-i18n="game_sel_title">Selecciona els teus Equips</h2>',
    '<button class="btn-save" id="btnStartGame" style="width:100%; padding:14px; margin-top:20px; font-size:1.1rem;">⚽ Començar Partit</button>': '<button class="btn-save" id="btnStartGame" style="width:100%; padding:14px; margin-top:20px; font-size:1.1rem;" data-i18n="game_sel_btn">⚽ Començar Partit</button>'
};

const loginReplacements = {
    '<title>Iniciar Sessió - Porra 2026</title>': '<title data-i18n="login_title">Iniciar Sessió - Porra 2026</title>',
    '<h1 class="hero-title" style="font-size: 2.5rem; margin-bottom: 10px;">Inicia Sessió</h1>': '<h1 class="hero-title" style="font-size: 2.5rem; margin-bottom: 10px;" data-i18n="login_hero_title">Inicia Sessió</h1>',
    '<p class="hero-subtitle" style="margin-bottom: 30px; font-size: 1.1rem;">Accedeix per a fer les teves apostes i veure els teus punts</p>': '<p class="hero-subtitle" style="margin-bottom: 30px; font-size: 1.1rem;" data-i18n="login_hero_desc">Accedeix per a fer les teves apostes i veure els teus punts</p>',
    '<span style="font-weight: 800;">Iniciar Sessió amb Google</span>': '<span style="font-weight: 800;" data-i18n="login_btn_google">Iniciar Sessió amb Google</span>'
};

const tourReplacements = {
    '<title>🏆 Classificació Oficial</title>': '<title data-i18n="tour_title">🏆 Classificació Oficial</title>',
    '<div class="admin-brand">🏆 Resultats 2026</div>': '<div class="admin-brand" data-i18n="tour_brand">🏆 Resultats 2026</div>',
    '<button class="tab-btn active" data-tab="grupos">📊 Grups i Partits</button>': '<button class="tab-btn active" data-tab="grupos" data-i18n="tour_tab_groups">📊 Grups i Partits</button>',
    '<button class="tab-btn" data-tab="bracket">⚔️ Eliminatòries</button>': '<button class="tab-btn" data-tab="bracket" data-i18n="tour_tab_bracket">⚔️ Eliminatòries</button>',
    '<div class="panel-title">Fase de Grups i Classificació</div>': '<div class="panel-title" data-i18n="tour_header_title">Fase de Grups i Classificació</div>',
    '<a href="index.html" class="hd-link">🏠 Inici</a>': '<a href="index.html" class="hd-link" data-i18n="game_btn_home">🏠 Inici</a>',
    '<a href="login.html" class="hd-link" style="color:var(--gold); border-color:var(--gold);">👤 Login / La Meva Porra</a>': '<a href="login.html" class="hd-link" style="color:var(--gold); border-color:var(--gold);" data-i18n="nav_login">👤 Login / La Meva Porra</a>'
};

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace head scripts
    if(!content.includes('i18n.js')) {
        content = content.replace(/<script src="firebase-config\.js[^"]*"><\/script>\s*<script src="auth\.js[^"]*"><\/script>/, 
        \`<script src="firebase-config.js"></script>\n  <script src="auth.js"></script>\n  <script src="i18n.js"></script>\`);
    }

    // Add select to admin/apuestas/game topbar
    if (file !== 'index.html' && file !== 'login.html') {
        if (!content.includes('lang-selector')) {
            content = content.replace(/<div class="admin-actions">/, \`<div class="admin-actions">\n      <select class="lang-selector" aria-label="Idioma" style="background: rgba(255,255,255,0.1); border: 1px solid var(--border); border-radius: 4px; color: var(--text); padding: 4px; outline: none; cursor: pointer; font-family: 'Outfit', sans-serif; margin-right: 10px;">\n        <option value="ca">VAL</option>\n        <option value="es" style="color: black;">ESP</option>\n      </select>\`);
        }
    } else if (file === 'login.html') {
        if (!content.includes('lang-selector')) {
            content = content.replace(/<nav class="navbar"[^>]*>[\s\S]*?<div class="nav-container">/, \`$&
        <div style="margin-left: auto; padding-right: 20px;">
          <select class="lang-selector" aria-label="Idioma" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; padding: 4px 8px; outline: none; cursor: pointer; font-family: 'Outfit', sans-serif;">
            <option value="ca">VAL</option>
            <option value="es" style="color: black;">ESP</option>
          </select>
        </div>\`);
        }
    }

    if (file === 'index.html') {
        for (const [k, v] of Object.entries(dictCa)) {
            content = content.replace(k, \`\${v}\`);
        }
    } else if (file === 'admin.html') {
        for (const [k, v] of Object.entries(adminReplacements)) {
            content = content.replace(k, v);
        }
    } else if (file === 'apuestas.html') {
        for (const [k, v] of Object.entries(apuestasReplacements)) {
            content = content.replace(k, v);
        }
    } else if (file === 'game.html') {
        for (const [k, v] of Object.entries(gameReplacements)) {
            content = content.replace(k, v);
        }
    } else if (file === 'login.html') {
        for (const [k, v] of Object.entries(loginReplacements)) {
            content = content.replace(k, v);
        }
    } else if (file === 'tournament.html') {
        for (const [k, v] of Object.entries(tourReplacements)) {
            content = content.replace(k, v);
        }
    }

    fs.writeFileSync(file, content);
});
console.log("Done");
