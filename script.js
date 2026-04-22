import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, where, Timestamp, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

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

// Função para carregar o Portal
async function carregarPortal() {
    const feed = document.getElementById('news-feed');
    const carouselArea = document.getElementById('carousel-area');
    
    // Margem de tempo para evitar bugs de fuso horário
    const margem = new Date();
    margem.setMinutes(margem.getMinutes() + 10);
    const agora = Timestamp.fromDate(margem);

    try {
        const q = query(collection(db, "noticias"), where("data", "<=", agora), orderBy("data", "desc"));
        const snap = await getDocs(q);
        
        let feedHTML = "";
        let carouselHTML = "";
        let i = 0;

        snap.forEach(res => {
            const n = res.data();
            const id = res.id;
            const dataExt = n.data ? n.data.toDate().toLocaleDateString('pt-BR', {day:'numeric', month:'long'}) : "";

            if(i < 3) {
                carouselHTML += `
                    <div class="carousel-slide ${i === 0 ? 'active' : ''}" onclick="contarViewEIr('${id}')">
                        <img src="${n.foto}">
                        <div class="carousel-caption">${n.titulo}</div>
                    </div>`;
            }

            feedHTML += `
                <article class="news-item" onclick="contarViewEIr('${id}')">
                    <div class="news-photo"><img src="${n.foto}"></div>
                    <div class="news-info">
                        <span class="tag">${n.categoria || 'NOTÍCIA'}</span>
                        <h3>${n.titulo}</h3>
                        <p style="font-size:12px; color:#888;">${dataExt}</p>
                    </div>
                </article>`;
            i++;
        });

        if(carouselArea) {
            carouselArea.querySelectorAll('.carousel-slide').forEach(s => s.remove());
            carouselArea.insertAdjacentHTML('afterbegin', carouselHTML);
        }
        if(feed) feed.innerHTML = feedHTML;
    } catch (e) { console.error(e); }
}

// Função para contar visualização antes de abrir a notícia
window.contarViewEIr = async (id) => {
    try {
        const ref = doc(db, "noticias", id);
        await updateDoc(ref, { views: increment(1) });
    } catch (e) { console.log("Erro ao contar view"); }
    window.location.href = `noticia.html?id=${id}`;
};

carregarPortal();
