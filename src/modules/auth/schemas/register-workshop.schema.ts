import { z } from 'zod';

const RegisterWorkshopSchema = z.strictObject({
  name: z.string().min(3, 'The name must be at least 3 characters long'),
  slug: z.string().min(3, 'The slug must be at least 3 characters long').regex(/^[a-z0-9-]+$/, 'The slug can only contain lowercase letters, numbers, and hyphens'),
  email: z.email('Invalid tenant email address'),

  user: z.strictObject({
    email: z.email('Invalid email address'),
    name: z.string().min(2, 'The name must be at least 2 characters long'),
    lastName: z.string().min(2, 'The last name must be at least 2 characters long'),
    password: z.string().min(6, 'The password must be at least 6 characters long'),
  }),
});

export default RegisterWorkshopSchema;
