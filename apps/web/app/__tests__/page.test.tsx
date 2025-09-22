import { render, screen } from "@testing-library/react";
import Page from "../page";

describe("Landing Page", () => {
  it("renders hero headline and CTA", () => {
    render(<Page />);
    expect(screen.getByText(/CIPFARO E‑Learning/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Accéder au Dashboard/i)[0]).toBeInTheDocument();
  });

  it("shows key stats cards", () => {
    render(<Page />);
    expect(screen.getByText(/Modules SCORM/i)).toBeInTheDocument();
    expect(screen.getByText(/Utilisateurs actifs/i)).toBeInTheDocument();
  });
});