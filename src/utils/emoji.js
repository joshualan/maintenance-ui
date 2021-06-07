const getEmojiFromMonitorStatus = (status) => {
  if (status === 3) return "✔️";
  else if (status === 2) return "🛠️";
  else if (status === 1) return "❌";
  else return "❓";
};

export { getEmojiFromMonitorStatus };
