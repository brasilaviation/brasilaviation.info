async function carregarComponentes() {
    const componentes = [
        { id: 'header-container', path: 'cabecalho.html' },
        { id: 'menu-container', path: 'menu.html' },
        { id: 'footer-container', path: 'rodape.html' }
    ];

    for (const comp of componentes) {
        const container = document.getElementById(comp.id);
        if (container) {
            try {
                // Cache busting para evitar versões antigas
                const response = await fetch(`${comp.path}?v=${Date.now()}`);
                if (response.ok) {
                    const html = await response.text();
                    container.innerHTML = html;
                    
                    // Executa scripts internos do componente
                    const scripts = container.querySelectorAll("script");
                    scripts.forEach(oldScript => {
                        const newScript = document.createElement("script");
                        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });

                    // Se carregou o cabeçalho, inicializa a lógica de interação dele
                    if (comp.id === 'header-container') {
                        setupHeaderInteractions();
                    }
                }
            } catch (error) {
                console.error(`Erro ao carregar o hangar (${comp.path}):`, error);
            }
        }
    }
}

// Lógica para botões que nascem dentro do cabeçalho
function setupHeaderInteractions() {
    const menuBtn = document.getElementById('open-menu');
    const darkToggle = document.getElementById('dark-toggle-header');
    const btnLupa = document.getElementById('btn-lupa-header');
    const searchBox = document.getElementById('search-box-header');
    const inputBusca = document.getElementById('input-busca-header');

    // Abre o menu lateral
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            document.body.classList.toggle('menu-active');
        });
    }

    // Alternar Dark Mode
    if (darkToggle) {
        // Verifica preferência salva
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }

        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Sistema de Busca
    if (btnLupa && searchBox && inputBusca) {
        const fazerBusca = () => {
            const termo = inputBusca.value.trim();
            if (termo) window.location.href = `pesquisa.html?q=${encodeURIComponent(termo)}`;
        };

        btnLupa.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!searchBox.classList.contains('active')) {
                searchBox.classList.add('active');
                setTimeout(() => inputBusca.focus(), 100);
            } else {
                fazerBusca();
            }
        });

        inputBusca.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') fazerBusca();
        });

        // Fecha busca ao clicar fora
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) searchBox.classList.remove('active');
        });
    }
}

// Inicia o carregamento
document.addEventListener('DOMContentLoaded', carregarComponentes);
