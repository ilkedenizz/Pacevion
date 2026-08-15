export const formatLocalTime = (dateStr: string, timeStr?: string) => {
  if (!timeStr) {
    // If no time is provided, parse it as UTC and show UTC date
    const d = new Date(`${dateStr}T00:00:00Z`);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(d).toUpperCase();
  }

  const ts = timeStr.endsWith('Z') ? timeStr : `${timeStr}Z`;
  const d = new Date(`${dateStr}T${ts}`);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(d).toUpperCase();

  const formattedTime = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d);

  return `${formattedDate} · ${formattedTime} LOCAL`;
};
