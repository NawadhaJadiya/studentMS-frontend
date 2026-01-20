import { render, screen, fireEvent } from "@testing-library/react";
import AuthPage from "@/app/auth/page";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/components/RoleToggle", () => ({
  __esModule: true,
  default: () => <div>RoleToggle</div>,
}));

jest.mock("@/components/LoginForm", () => ({
  __esModule: true,
  default: ({ role }: any) => <div>LoginForm - {role}</div>,
}));

jest.mock("@/components/SignupForm", () => ({
  __esModule: true,
  default: () => <div>SignupForm</div>,
}));

const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

const mockUseAuth = require("@/context/AuthContext").useAuth;

describe("AuthPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form by default", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      role: null,
      isLoading: false,
    });

    render(<AuthPage />);

    expect(screen.getByText("LoginForm - student")).toBeInTheDocument();
    expect(screen.getByText("Create new account")).toBeInTheDocument();
  });


  test("does not render signup form for admin role", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      role: null,
      isLoading: false,
    });

    render(<AuthPage />);

    expect(screen.queryByText("SignupForm")).not.toBeInTheDocument();
  });

  test("redirects student if authenticated", () => {
  mockUseAuth.mockReturnValue({
    isAuthenticated: true,
    role: "student",
    isLoading: false,
  });

  render(<AuthPage />);

  expect(replaceMock).toHaveBeenCalledWith("/student");
});

test("redirects admin if authenticated", () => {
  mockUseAuth.mockReturnValue({
    isAuthenticated: true,
    role: "admin",
    isLoading: false,
  });

  render(<AuthPage />);

  expect(replaceMock).toHaveBeenCalledWith("/admin");
});



});
