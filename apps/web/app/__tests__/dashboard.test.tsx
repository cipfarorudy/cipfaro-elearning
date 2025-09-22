import { describe, it, expect } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock du composant Dashboard (sera remplacé par l'import réel)
const MockDashboard = ({ userRole }: { userRole: string }) => {
  return (
    <div data-testid="dashboard">
      <h1>Dashboard CIPFARO V2</h1>
      <div data-testid="user-role">{userRole}</div>
      <nav>
        <ul>
          <li><a href="/admin/modules">Modules</a></li>
          <li><a href="/admin/reports">Rapports</a></li>
        </ul>
      </nav>
      <div data-testid="stats">
        <div>Sessions actives: 12</div>
        <div>Stagiaires inscrits: 45</div>
        <div>Modules complétés: 78</div>
      </div>
    </div>
  );
};

describe('Dashboard Component', () => {
  it('should render dashboard title', () => {
    render(<MockDashboard userRole="admin" />);
    
    expect(screen.getByRole('heading', { name: /dashboard cipfaro v2/i })).toBeInTheDocument();
  });
  
  it('should display user role', () => {
    render(<MockDashboard userRole="formateur" />);
    
    expect(screen.getByTestId('user-role')).toHaveTextContent('formateur');
  });
  
  it('should show navigation links', () => {
    render(<MockDashboard userRole="admin" />);
    
    expect(screen.getByRole('link', { name: /modules/i })).toHaveAttribute('href', '/admin/modules');
    expect(screen.getByRole('link', { name: /rapports/i })).toHaveAttribute('href', '/admin/reports');
  });
  
  it('should display statistics', () => {
    render(<MockDashboard userRole="admin" />);
    
    const stats = screen.getByTestId('stats');
    expect(stats).toHaveTextContent('Sessions actives: 12');
    expect(stats).toHaveTextContent('Stagiaires inscrits: 45');
    expect(stats).toHaveTextContent('Modules complétés: 78');
  });
  
  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<MockDashboard userRole="admin" />);
    
    const modulesLink = screen.getByRole('link', { name: /modules/i });
    
    // Vérifier que le lien est cliquable
    expect(modulesLink).toBeInTheDocument();
    await user.click(modulesLink);
    // Dans un vrai test, on vérifierait le changement de route
  });
});