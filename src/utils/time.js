function last24HoursRange(now = new Date()) {
  const end = now;
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return { start, end };
}

module.exports = { last24HoursRange };
