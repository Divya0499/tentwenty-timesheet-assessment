import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its children as the button's text", () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Click me" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled button
      </Button>
    );

    await userEvent.click(screen.getByRole("button", { name: "Disabled button" }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("disables the button and hides normal interaction while isLoading", () => {
    render(<Button isLoading>Saving...</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
