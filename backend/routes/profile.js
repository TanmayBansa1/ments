const express = require('express');
const prisma = require('../prismaClient');
const authenticateToken = require('./authMiddleware');
const { profileSchema } = require('../zodschemas/profileSchemas');

const router = express.Router();

// Get current user's profile
router.get('/getUser', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.userId },
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// Create profile
router.post('/createProfile', authenticateToken, async (req, res) => {
  const parse = profileSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { role, skills, interests, bio } = parse.data;
  try {
    const existing = await prisma.profile.findUnique({ where: { userId: req.user.userId } });
    if (existing) return res.status(409).json({ error: 'Profile already exists.' });
    const profile = await prisma.profile.create({
      data: {
        userId: req.user.userId,
        role,
        skills,
        interests,
        bio,
      },
    });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create profile.' });
  }
});

// Update profile
router.put('/updateProfile', authenticateToken, async (req, res) => {
  const parse = profileSchema.partial().safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { role, skills, interests, bio } = parse.data;
  try {
    const profile = await prisma.profile.update({
      where: { userId: req.user.userId },
      data: { role, skills, interests, bio },
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Delete profile
router.delete('/deleteProfile', authenticateToken, async (req, res) => {
  try {
    await prisma.profile.delete({ where: { userId: req.user.userId } });
    res.json({ message: 'Profile deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete profile.' });
  }
});

module.exports = router; 