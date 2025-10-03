export async function buscarEnderecoPorCep(cep) {
  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) return null;
  const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const data = await resp.json();
  if (data.erro) return null;
  return {
    rua: data.logradouro || "",
    bairro: data.bairro || "",
    cidade: data.localidade || "",
    estado: data.uf || "",
    complemento: data.complemento || "",
  };
}