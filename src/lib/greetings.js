export const greetings = () => {
  const hours = new Date().getHours();

  if (hours < 12) {
    return "Good Morning";
  } else if (hours < 16) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};
