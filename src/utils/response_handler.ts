export const FormatResponse = <T>(data: T, message?: string, status?: number) => {
  return {
    status: status ?? 200,
    data: {
      ...data,
    },
    message,
    timestamp: new Date().toISOString(),
  };
};
