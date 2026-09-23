import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("shows 'Completed' for a COMPLETED status", () => {
    render(<StatusBadge status="COMPLETED" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows 'Incomplete' for an INCOMPLETE status", () => {
    render(<StatusBadge status="INCOMPLETE" />);
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
  });

  it("shows 'Missing' for a MISSING status", () => {
    render(<StatusBadge status="MISSING" />);
    expect(screen.getByText("Missing")).toBeInTheDocument();
  });
});
