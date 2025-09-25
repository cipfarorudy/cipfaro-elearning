"use client";

export default function AdminDashboard() {
  const stats = [
    { title: 'Utilisateurs actifs', value: '1,247', icon: '👥', color: '#2563eb' },
    { title: 'Sessions en cours', value: '23', icon: '📚', color: '#16a34a' },
    { title: 'Modules SCORM', value: '156', icon: '📦', color: '#ea580c' },
    { title: 'Taux de completion', value: '87%', icon: '✅', color: '#9333ea' },
  ];

  const recentActivities = [
    { id: '1', user: 'Jean Dupont', action: 'a terminé le module "Sécurité au travail"', time: 'Il y a 5 min' },
    { id: '2', user: 'Marie Martin', action: 's\'est inscrite à la formation "Management"', time: 'Il y a 12 min' },
    { id: '3', user: 'Admin', action: 'a uploadé un nouveau module SCORM', time: 'Il y a 1h' },
    { id: '4', user: 'Pierre Durand', action: 'a émargé pour la session du matin', time: 'Il y a 2h' },
  ];

  const quickActions = [
    { title: 'Créer une session', description: 'Nouvelle session de formation', icon: '➕', href: '/admin/sessions/new' },
    { title: 'Upload SCORM', description: 'Ajouter un module', icon: '📤', href: '/admin/modules/upload' },
    { title: 'Gérer utilisateurs', description: 'Comptes et permissions', icon: '👥', href: '/admin/users' },
    { title: 'Rapports', description: 'Analytics et exports', icon: '📊', href: '/admin/reports' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: 'Inter, system-ui, Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                🏢 Dashboard Administrateur CIPFARO
              </h1>
              <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
                Vue d'ensemble de la plateforme e-learning
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Admin CIPFARO</span>
              <button 
                data-testid="logout-button"
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Déconnexion
              </button>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                    {stat.title}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600, color: '#111827' }}>
            Actions rapides
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px'
          }}>
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                style={{
                  display: 'block',
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{action.icon}</span>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{action.title}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '24px'
        }}>
          {/* Recent Activity */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                Activité récente
              </h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '6px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      marginTop: '6px'
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                        <strong>{activity.user}</strong> {activity.action}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                État du système
              </h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>API</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#16a34a'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: 500 }}>Opérationnel</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Base de données</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#16a34a'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: 500 }}>Opérationnel</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Stockage S3</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#16a34a'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: 500 }}>Opérationnel</span>
                  </div>
                </div>
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '6px',
                  border: '1px solid #bae6fd'
                }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#0369a1' }}>
                    💡 Tous les services fonctionnent normalement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}