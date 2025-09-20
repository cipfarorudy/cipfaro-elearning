export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <h1>🎓 CIPFARO E-Learning Platform</h1>
      <p>Bienvenue sur votre plateforme de formation moderne !</p>
      
      <div style={{ marginTop: 20 }}>
        <h2>🚀 Accès aux Fonctionnalités :</h2>
        <ul style={{ marginTop: 10, lineHeight: 2 }}>
          <li><a href="/index.html" style={{ color: '#667eea', textDecoration: 'none' }}>🏠 Page d'accueil principale</a></li>
          <li><a href="/upload-scorm.html" style={{ color: '#667eea', textDecoration: 'none' }}>📤 Interface Upload SCORM</a></li>
          <li><a href="/planning.html" style={{ color: '#667eea', textDecoration: 'none' }}>📅 Calendrier des Sessions</a></li>
          <li><a href="/dashboard" style={{ color: '#667eea', textDecoration: 'none' }}>🏢 Dashboard Administrateur</a></li>
          <li><a href="/learn/demo" style={{ color: '#667eea', textDecoration: 'none' }}>📚 Démo SCORM Player</a></li>
        </ul>
      </div>
      
      <div style={{ marginTop: 30, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
        <p><strong>💡 Astuce :</strong> Utilisez les liens ci-dessus pour tester toutes les fonctionnalités !</p>
      </div>
    </main>
  );
}