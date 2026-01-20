import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import StudentDetailPage from "@/app/admin/students/[rollno]/page";
import api from "@/lib/axios";

jest.mock("@/lib/axios", () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  use: () => ({ rollno: "101" }),
}));

describe("StudentDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders student details and marks correctly", async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        name: "dummy",
        rollno: "101",
        class: "10",
        email: "dummy@test.com",
        phone: "9999999999",
        addressLine1: "Street 1",
        marks: [
          { subject: "Math", score: 80 },
          { subject: "CS", score: 90 },
        ],
      },
    });

    render(<StudentDetailPage params={Promise.resolve({ rollno: "101" })} />);

    await waitFor(() => {
      expect(screen.getByText("dummy")).toBeInTheDocument();
      expect(screen.getByText("101")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("80/100")).toBeInTheDocument();
    expect(screen.getByText("CS")).toBeInTheDocument();
    expect(screen.getByText("90/100")).toBeInTheDocument();
  });

  test("allows editing and saving marks", async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        name: "dummy",
        rollno: "101",
        class: "10",
        email: "dummy@test.com",
        phone: "9999999999",
        addressLine1: "Street 1",
        marks: { Math: 80 },
      },
    });

    (api.put as jest.Mock).mockResolvedValue({});

    render(<StudentDetailPage params={Promise.resolve({ rollno: "101" })} />);

    await waitFor(() => {
      expect(screen.getByText("Math")).toBeInTheDocument();
    });

    // enter edit mode
    fireEvent.click(screen.getByText("Edit Marks"));

    const input = screen.getByDisplayValue("80");
    fireEvent.change(input, { target: { value: "85" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/students/101/marks", {
        marks: { Math: 85 },
      });
    });

    expect(
      screen.getByText("Marks updated successfully")
    ).toBeInTheDocument();
  });
});
