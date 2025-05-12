const { z } = require('zod');

const profileSchema = z.object({
  role: z.enum(['mentor', 'mentee']),
  skills: z.string().optional(),
  interests: z.string().optional(),
  bio: z.string().optional(),
});

module.exports = {
  profileSchema,
}; 