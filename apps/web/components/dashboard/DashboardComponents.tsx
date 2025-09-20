import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const colorStyles = {
    blue: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1d4ed8' },
    green: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#15803d' },
    orange: { backgroundColor: '#fff7ed', borderColor: '#fed7aa', color: '#ea580c' },
    purple: { backgroundColor: '#faf5ff', borderColor: '#d8b4fe', color: '#9333ea' },
    red: { backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' },
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      transition: 'box-shadow 0.2s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', margin: 0 }}>{title}</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '4px 0 0 0' }}>{value}</p>
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 500,
                color: trend.isPositive ? '#16a34a' : '#dc2626'
              }}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '4px' }}>vs mois dernier</span>
            </div>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...colorStyles[color]
        }}>
          <span style={{ fontSize: '24px' }}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  onClick?: () => void;
}

export function QuickAction({ title, description, icon, href, color, onClick }: QuickActionProps) {
  const colorStyles = {
    blue: { backgroundColor: '#2563eb', hover: '#1d4ed8' },
    green: { backgroundColor: '#16a34a', hover: '#15803d' },
    orange: { backgroundColor: '#ea580c', hover: '#c2410c' },
    purple: { backgroundColor: '#9333ea', hover: '#7c3aed' },
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{
        display: 'block',
        padding: '16px',
        borderRadius: '8px',
        color: 'white',
        textDecoration: 'none',
        backgroundColor: colorStyles[color].backgroundColor,
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colorStyles[color].hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colorStyles[color].backgroundColor;
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <div>
          <h3 style={{ margin: 0, fontWeight: 600 }}>{title}</h3>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{description}</p>
        </div>
      </div>
    </a>
  );
}

interface RecentActivityProps {
  activities: {
    id: string;
    type: 'login' | 'completion' | 'enrollment' | 'upload';
    user: string;
    description: string;
    timestamp: string;
  }[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    const icons = {
      login: '🔑',
      completion: '✅',
      enrollment: '📝',
      upload: '📤',
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getActivityColor = (type: string) => {
    const colors = {
      login: '#2563eb',
      completion: '#16a34a',
      enrollment: '#9333ea',
      upload: '#ea580c',
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>Activité récente</h3>
      </div>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activities.map((activity) => (
            <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '18px', color: getActivityColor(activity.type) }}>
                {getActivityIcon(activity.type)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
                  <span style={{ fontWeight: 500 }}>{activity.user}</span> {activity.description}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProgressChartProps {
  title: string;
  data: {
    label: string;
    value: number;
    total: number;
  }[];
}

export function ProgressChart({ title, data }: ProgressChartProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>{title}</h3>
      </div>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.map((item, index) => {
            const percentage = (item.value / item.total) * 100;
            return (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                  <span style={{ color: '#374151' }}>{item.label}</span>
                  <span style={{ color: '#6b7280' }}>
                    {item.value}/{item.total} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '9999px',
                  height: '8px'
                }}>
                  <div style={{
                    backgroundColor: '#2563eb',
                    height: '8px',
                    borderRadius: '9999px',
                    width: `${percentage}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}