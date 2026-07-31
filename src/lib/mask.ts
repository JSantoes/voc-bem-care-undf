// Frontend privacy: simulated encryption / masking of sensitive fields.
//
// CPF masking rule (UNDF/OrientaAI): reveal ONLY the 3 central digits and the
// 2 check digits, masking the rest with asterisks.
//   Example: 123.682.456-72  ->  ***.682.***-72
export function maskCpf(cpf: string, revealed: boolean) {
  if (revealed) return cpf;
  const digits = cpf.replace(/\D/g, "").padStart(11, "0");
  const d = digits.split("");
  return `***.${d[3]}${d[4]}${d[5]}.***-${d[9]}${d[10]}`;
}

export function maskEmail(email: string, revealed: boolean) {
  if (revealed) return email;
  const [u, d] = email.split("@");
  if (!d) return "•".repeat(email.length);
  return `${u.slice(0, 2)}${"•".repeat(Math.max(u.length - 2, 3))}@${d}`;
}

export function maskName(name: string, revealed: boolean) {
  if (revealed) return name;
  return name
    .split(" ")
    .map((p, i) => (i === 0 ? p : `${p[0] ?? ""}.`))
    .join(" ");
}

// Fake "encryption preview" – purely visual, never handles real secrets.
export function encryptedPreview(v: string) {
  const hash = Array.from(v).reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381);
  return `enc::${hash.toString(16)}::${"▮".repeat(6)}`;
}
