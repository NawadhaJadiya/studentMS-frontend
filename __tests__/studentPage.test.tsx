import { render, screen, waitFor } from "@testing-library/react";
import StudentResultPage from "@/app/student/results/page";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/lib/axios", () => ({
  get: jest.fn(),
}));

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

describe("StudentResultPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows 'No results available' when marks array is empty", async () => {
   (useAuth as jest.Mock).mockReturnValue({
      identifier: "e2e-101",
    });

    (api.get as jest.Mock).mockResolvedValue({
      data: { marks: [] },
    });

    render(<StudentResultPage />);

    await waitFor(() =>
      expect(screen.getByText("No results available.")).toBeInTheDocument()
    );
  });

  test("renders marks table and percentage when results exist", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      identifier: "e2e-101",
    });

    (api.get as jest.Mock).mockResolvedValue({
      data: {
        marks: [
          { subject: "Math", score: 80 },
          { subject: "CS", score: 90 },
        ],
      },
    });

    render(<StudentResultPage />);

    await waitFor(() => {
      expect(screen.getByText("Math")).toBeInTheDocument();
      expect(screen.getByText("80")).toBeInTheDocument();
      expect(screen.getByText("CS")).toBeInTheDocument();
      expect(screen.getByText("90")).toBeInTheDocument();
    });

    expect(screen.getByText("85.00%")).toBeInTheDocument();
  });
});
