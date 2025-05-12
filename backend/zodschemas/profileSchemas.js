const { z } = require('zod');

const profileSchema = z.object({
  role: z.enum(['mentor', 'mentee']),
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  bio: z.string().optional(),
});

module.exports = {
  profileSchema,
}; 