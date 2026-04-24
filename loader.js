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
                // Adicionamos um parâmetro de tempo para evitar que o navegador use versão velha (cache)
                const response = await fetch(`${comp.path}?v=${Date.now()}`);
                if (response.ok) {
                    const html = await response.text();
                    container.innerHTML = html;
                    
                    // Executa scripts que estiverem dentro do componente carregado
                    const scripts = container.querySelectorAll("script");
                    scripts.forEach(oldScript => {
                        const newScript = document.createElement("script");
                        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });
                }
            } catch (error) {
                console.error(`Erro ao carregar o hangar (${comp.path}):`, error);
            }
        }
    }
}

// Inicia o carregamento assim que a página abrir
document.addEventListener('DOMContentLoaded', carregarComponentes);
