function transformPriceToNumber(data: string): number {
  return parseFloat(
    data.replaceAll('.', '').replaceAll(',', '').replaceAll('R$', '')
  );
}

function transformNumberToPrice(value: number): string {
  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat('pt-BR', options).format(value / 100);

  return `R$ ${result}`;
}

export { transformNumberToPrice, transformPriceToNumber };
