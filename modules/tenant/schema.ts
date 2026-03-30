import { z } from "zod";

export const tenantSchema = z.object({
  name: z.string().min(2, "Institute name required"),
  subdomain: z.string().min(3, "Subdomain too short"),
  plan: z.string(),
});