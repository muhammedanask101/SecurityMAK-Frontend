const transitions: Record<string, string[]> = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
};

export function getAllowedTransitions(status: string) {
  return transitions[status] ?? [];
}