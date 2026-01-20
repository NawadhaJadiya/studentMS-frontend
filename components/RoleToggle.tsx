type Role = "student" | "admin";

interface Props {
  role: Role;
  setRole: (role: Role) => void;
}

export default function RoleToggle({ role, setRole }: Props) {
  return (
    <div className="flex mb-6 rounded overflow-hidden border border-[var(--color-gold)]">
      {["student", "admin"].map((r) => (
        <button
          key={r}
          onClick={() => setRole(r as Role)}
          className={`flex-1 py-2 text-sm font-medium ${
            role === r
              ? "bg-[var(--color-gold)] text-[var(--color-brown)]"
              : "bg-white text-[var(--color-brown)]"
          }`}
        >
          {r.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
