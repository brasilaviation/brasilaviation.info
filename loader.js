// loader.js - Versão Definitiva com Delegação de Eventos

async function loadComp(id, path) {
    try {
        const r = await fetch('/' + path + "?v=" + Date.now());
        if(r.ok) {
            const content = await r.text();
            document.getElementById(id).innerHTML = content;
            console.log(`Componente ${path} carregado.`);
        }
    } catch (e) { console.error("Erro ao carregar:", path); }
}

// 1. DELEGAÇÃO DE EVENTOS (Resolve o problema do menu não abrir)
// Ouvimos o clique no documento inteiro e verificamos o ID do que foi clicado
document.addEventListener('click', function(e) {
    const sideMenu = document.getElementById('side-menu');

    // Abrir Menu
    if (e.target.closest('#open-menu')) {
        if (sideMenu) sideMenu.style.left = "0";
    }

    // Fechar Menu
    if (e.target.closest('#close-menu')) {
        if (sideMenu) sideMenu.style.left = "-100%";
    }

    // Dark Mode Toggle
    if (e.target.closest('#dark-toggle-header')) {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Botão de Busca (Lupa)
    if (e.target.closest('#btn-lupa-header')) {
        e.preventDefault();
        const searchBox = document.getElementById('search-box-header');
        const inputBusca = document.getElementById('input-busca-header');
        
        if (searchBox) {
            if (!searchBox.classList.contains('active')) {
                searchBox.classList.add('active');
                if (inputBusca) inputBusca.focus();
            } else {
                const termo = inputBusca ? inputBusca.value.trim() : "";
                if (termo !== "") {
                    window.location.href = `/pesquisa.html?q=${encodeURIComponent(termo)}`;
                } else {
                    searchBox.classList.remove('active');
                }
            }
        }
    }
});

// 2. APLICAR TEMA SALVO AO CARREGAR A PÁGINA
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// 3. CARREGAR COMPONENTES
loadComp('header-container', 'cabecalho.html');
loadComp('footer-container', 'rodape.html');
loadComp('menu-container', 'menu.html');
