import { z } from "zod";

const LoginSchema = z.strictObject({
  tenantSlug: z.string().min(3, "The tenant slug must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "The password must be at least 6 characters long"),
});

export default LoginSchema;
