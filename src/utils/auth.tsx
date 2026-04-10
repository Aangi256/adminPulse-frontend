export const getRole = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role");
  }
  return null;
};