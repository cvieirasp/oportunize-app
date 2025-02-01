export default function formatCurrency(amount: number, decimals = 0) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: decimals,
  }).format(amount)
}
