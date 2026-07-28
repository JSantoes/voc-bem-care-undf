// Frontend privacy: simulated encryption / masking of sensitive fields
export function maskCpf(cpf: string, revealed: boolean) {
  if (revealed) return cpf;
  return cpf.replace(/\d(?=\d{2})/g, "•");
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
