export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('T')[0].split('-');
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
