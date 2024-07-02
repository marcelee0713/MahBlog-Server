export const FormatResponse = <T>(data: T, message?: string) => {
  return {
    status: "success",
    data: {
      ...data,
    },
    message,
  };
};
