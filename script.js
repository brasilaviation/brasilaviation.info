import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDm_UDs4KE7j8BuGdw9kClsSrKwxLWbt7g",
    authDomain: "braviation3.firebaseapp.com",
    projectId: "braviation3",
    storageBucket: "braviation3.firebasestorage.app",
    messagingSenderId: "979009087877",
    appId: "1:979009087877:web:490bdc36da545d56b87cec"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function carregarPortal() {
    const feed = document.getElementById('news-feed');
    const carouselArea = document.getElementById('carousel-area');

    console.log("Tentando conectar ao Firebase...");

    try {
        // Pega TUDO da coleção noticias sem filtros para não dar erro de índice
        const snap = await getDocs(collection(db, "noticias"));
        
        if (snap.empty) {
            console.log("Banco de dados vazio!");
            if(feed) feed.innerHTML = "<p>Nenhuma notícia encontrada no banco.</p>";
            return;
        }

        let lista = [];
        snap.forEach(res => {
            lista.push({ id: res.id, ...res.data() });
        });

        // Ordena por data (mais nova primeiro)
        lista.sort((a, b) => (b.data?.seconds || 0) - (a.data?.seconds || 0));

        let feedHTML = "";
        let carouselHTML = "";

        lista.forEach((n, i) => {
            const dataFmt = n.data ? new Date(n.data.seconds * 1000).toLocaleDateString('pt-BR') : "";
            
            // Primeiras 3 no carrossel
            if(i < 3) {
                carouselHTML += `
                    <div class="carousel-slide ${i === 0 ? 'active' : ''}" onclick="contarViewEIr('${n.id}')">
                        <img src="${n.foto}" style="width:100%; height:100%; object-fit:cover;">
                        <div class="carousel-caption"><h3>${n.titulo}</h3></div>
                    </div>`;
            }

            // Todas no feed
            feedHTML += `
                <article class="news-item" onclick="contarViewEIr('${n.id}')" style="display:flex; gap:10px; margin-bottom:15px; background:white; padding:10px; border-radius:10px;">
                    <img src="${n.foto}" style="width:100px; height:70px; border-radius:5px; object-fit:cover;">
                    <div>
                        <span style="color:green; font-size:10px; font-weight:bold;">${n.categoria || 'NOTÍCIA'}</span>
                        <h3 style="font-size:14px; margin:5px 0;">${n.titulo}</h3>
                        <p style="font-size:10px; color:#888;">${dataFmt}</p>
                    </div>
                </article>`;
        });

        if(carouselArea) {
            carouselArea.innerHTML = carouselHTML; 
        }
        if(feed) feed.innerHTML = feedHTML;

        console.log("Portal carregado com sucesso!");

    } catch (e) { 
        console.error("ERRO CRÍTICO:", e);
        if(feed) feed.innerHTML = "Erro de conexão: " + e.message;
    }
}

window.contarViewEIr = async (id) => {
    try {
        await updateDoc(doc(db, "noticias", id), { cliques: increment(1) });
    } catch (e) { console.log("Erro view"); }
    window.location.href = `noticia.html?id=${id}`;
};

carregarPortal();
