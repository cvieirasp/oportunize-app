export default function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInDays = Math.floor(
    (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffInDays === 0) {
    return "Publicado hoje"
  } else if (diffInDays === 1) {
    return "Publicado há 1 dia"
  } else {
    return `Publicado há ${diffInDays} dias`
  }
}
