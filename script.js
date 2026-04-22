import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

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

async function carregarConteudo() {
    const feed = document.getElementById('news-feed');
    const carouselContainer = document.querySelector('.carousel-container');

    try {
        // 1. CARREGAR DESTAQUES (As 3 mais lidas)
        const qDestaques = query(collection(db, "noticias"), orderBy("views", "desc"), limit(3));
        const destaquesSnap = await getDocs(qDestaques);
        let carouselHTML = '<h2>Destaques</h2>';
        let i = 0;
        destaquesSnap.forEach(doc => {
            const n = doc.data();
            carouselHTML += `
                <div class="carousel-slide ${i === 0 ? 'active' : ''}" onclick="window.location.href='noticia.html?id=${doc.id}'" style="cursor:pointer">
                    <img src="${n.foto}">
                    <div class="carousel-caption"><h3>${n.titulo}</h3></div>
                </div>`;
            i++;
        });
        carouselHTML += `<div class="carousel-controls"><button class="prev">❮</button><button class="next">❯</button></div>`;
        if(i > 0) { carouselContainer.innerHTML = carouselHTML; iniciarCarrossel(); }

        // 2. CARREGAR FEED (Mais recentes)
        const qFeed = query(collection(db, "noticias"), orderBy("data", "desc"));
        const feedSnap = await getDocs(qFeed);
        feed.innerHTML = "";
        feedSnap.forEach(doc => {
            const n = doc.data();
            const dataExtenso = n.data ? n.data.toDate().toLocaleDateString('pt-BR', {day:'numeric', month:'long', year:'numeric'}) : "Hoje";
            feed.innerHTML += `
                <article class="news-item" onclick="window.location.href='noticia.html?id=${doc.id}'" style="cursor:pointer">
                    <div class="news-photo"><img src="${n.foto}"></div>
                    <div class="news-info">
                        <span style="color:green; font-weight:bold; font-size:0.7rem; text-transform:uppercase;">${n.categoria || 'Geral'}</span>
                        <h3>${n.titulo}</h3>
                        <p class="meta">Por ${n.autor} | ${dataExtenso}</p>
                    </div>
                </article>`;
        });
    } catch (e) { console.error(e); }
}

function iniciarCarrossel() {
    let current = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const mover = (n) => {
        slides.forEach(s => s.classList.remove('active'));
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
    }
    document.querySelector('.next')?.addEventListener('click', (e) => { e.stopPropagation(); mover(++current); });
    document.querySelector('.prev')?.addEventListener('click', (e) => { e.stopPropagation(); mover(--current); });
}

// Menu e Busca
document.getElementById('menu-open')?.addEventListener('click', () => document.getElementById('side-menu').classList.add('active'));
document.getElementById('menu-close')?.addEventListener('click', () => document.getElementById('side-menu').classList.remove('active'));
document.getElementById('search-open')?.addEventListener('click', () => document.getElementById('search-bar').classList.toggle('active'));

carregarConteudo();
