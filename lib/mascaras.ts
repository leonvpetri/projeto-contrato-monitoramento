function soDigitos(v: string): string {
  return v.replace(/\D/g, "");
}

export function mascaraCnpj(v: string): string {
  return soDigitos(v)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\/\d{4})(\d)/, "$1-$2");
}

export function mascaraCpf(v: string): string {
  return soDigitos(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function mascaraCep(v: string): string {
  return soDigitos(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

export function mascaraFone(v: string): string {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}
