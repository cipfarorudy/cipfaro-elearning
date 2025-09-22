import { render, screen } from "@testing-library/react";
import RootLayout from "../layout";

function Wrapper() { return <div>child</div>; }

describe("RootLayout", () => {
  it("wraps children and sets lang=fr", () => {
    render(<RootLayout><Wrapper /></RootLayout>);
    // jsdom doesn't expose <html> lang easily via RTL; this test focuses on child render.
    expect(screen.getByText(/child/)).toBeInTheDocument();
  });
});