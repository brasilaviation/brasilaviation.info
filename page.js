import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. INICIALIZAÇÃO DO FIREBASE ADMIN
const serviceAccount = {
  projectId: "braviation3",
  clientEmail: "seu-email-admin@braviation3.iam.gserviceaccount.com", // Mude para o seu email do JSON
  privateKey: "-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'), // Cole sua chave do JSON
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}
const db = getFirestore();

// 2. META TAGS PARA O WHATSAPP (Roda no Servidor)
export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const noticiasRef = db.collection('braviation3'); // Coleção corrigida!
    const snapshot = await noticiasRef.where('slug', '==', slug).limit(1).get();

    if (snapshot.empty) {
      return { title: "Notícia Não Encontrada | BrasilAviation.info" };
    }

    const n = snapshot.docs[0].data();
    const textoPuro = n.texto ? n.texto.replace(/<[^>]*>/g, '') : '';
    const descricaoFinal = n.seo_description || textoPuro.substring(0, 160);
    
    let imagemMeta = n.foto || '';
    if (imagemMeta && !imagemMeta.startsWith('http')) {
      const prefixo = imagemMeta.startsWith('/') ? '' : '/';
      imagemMeta = `https://www.brasilaviation.info${prefixo}${imagemMeta}`;
    }

    return {
      title: `${n.titulo} | BrasilAviation.info`,
      description: descricaoFinal,
      openGraph: {
        title: n.titulo,
        description: descricaoFinal,
        url: `https://www.brasilaviation.info/noticia/${slug}`,
        siteName: 'BrasilAviation.info',
        type: 'article',
        images: [{ url: imagemMeta, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: n.titulo,
        description: descricaoFinal,
        images: [imagemMeta],
      },
    };
  } catch (error) {
    return { title: "BrasilAviation.info" };
  }
}

// 3. RENDERIZAÇÃO DA PÁGINA (Com suas classes CSS originais)
export default async function NoticiaPage({ params }) {
  const { slug } = params;

  const noticiasRef = db.collection('braviation3'); // Coleção corrigida!
  const snapshot = await noticiasRef.where('slug', '==', slug).limit(1).get();

  if (snapshot.empty) {
    return <main className="loading">Notícia não encontrada.</main>;
  }

  const n = snapshot.docs[0].data();
  const dataFmt = n.data ? new Date(n.data._seconds * 1000).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric'}) : "";

  return (
    <main id="noticia-layout">
      <div className="breadcrumb">
        <a href="/index.html">INÍCIO</a> / {n.cat || 'AVIAÇÃO'}
      </div>
      
      <h1 className="noticia-titulo">{n.titulo}</h1>
      
      <div className="noticia-meta">
        <div className="meta-item">
          <i className="fas fa-user"></i> Por {n.autor || 'Miguel Barbosa'}
        </div>
        <div className="meta-item">
          <i className="fas fa-calendar-alt"></i> {dataFmt}
        </div>
      </div>

      <a href="https://chat.whatsapp.com/K3n6hd7RaVaLDOnmwpy5vO" className="mid-section-community" target="_blank">
        <div className="community-info">
          <i className="fab fa-whatsapp"></i>
          <span>Comunidade BrasilAviation.info</span>
        </div>
        <div className="community-btn">Entrar no Grupo &rsaquo;</div>
      </a>

      <div className="noticia-imagem-container-capa">
        <img src={n.foto?.startsWith('http') ? n.foto : '/' + n.foto?.replace(/^\//, '')} alt={n.titulo} />
        <div className="noticia-legenda">{n.legenda || 'Foto: Reprodução'}</div>
      </div>

      <div 
        className="noticia-corpo"
        dangerouslySetInnerHTML={{ __html: n.texto }} 
      />

      <span className="share-label">Compartilhe esta notícia:</span>
      <div className="share-bar">
        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(n.titulo)}%20https://www.brasilaviation.info/noticia/${slug}`} target="_blank" className="share-btn btn-wa" title="WhatsApp">
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
    </main>
  );
}
