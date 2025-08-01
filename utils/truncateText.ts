export const truncateText = (text = "", length = 5, two_ways = false) => {
  if (two_ways && text.length > length + 3) {
    return `${text.slice(0, length + 1)}...${text.slice(
      text.length - length + 1,
      text.length
    )}`
  }
  if (text.length > length + 3) {
    return `${text.slice(0, length + 1)}...`
  }

  return text
}
