export function useFeatureAccess(plan: string) {
  return {
    ai: plan !== "basic",
    live: plan !== "basic",
    reports: plan !== "basic",
    whatsapp: plan === "advanced",
  };
}