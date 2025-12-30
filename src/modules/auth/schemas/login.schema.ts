import { z } from "zod";

const LoginSchema = z.strictObject({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "The password must be at least 6 characters long"),
});

export default LoginSchema;
