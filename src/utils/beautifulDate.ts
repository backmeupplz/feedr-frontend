export function unixToDate(unixStamp: number) {
  const convertedDate = new Date(unixStamp * 1000)
  let minutes = String(convertedDate.getMinutes())
  let hours = String(convertedDate.getHours())
  return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`
}
