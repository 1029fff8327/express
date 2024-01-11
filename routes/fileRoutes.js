const express = require('express');
const router = express.Router();
const multer = require('multer');
const FileModel = require('../models/FileModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     FileModel:
 *       type: object
 *       properties:
 *         data:
 *           type: string
 *         contentType:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: File
 *   description: File operations
 */

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a file
 *     tags: [File]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Successfully uploaded
 *         content:
 *           application/json:
 *             example:
 *               data: '...base64encodeddata...'
 *               contentType: 'image/jpeg'
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = new FileModel({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await file.save();

    res.json({
      data: file.data.toString('base64'),
      contentType: file.contentType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * @swagger
 * /file/{id}:
 *   put:
 *     summary: Update a file by ID
 *     tags: [File]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: file
 *         in: formData
 *         type: file
 *     responses:
 *       '200':
 *         description: Successfully updated
 *         content:
 *           application/json:
 *             example:
 *               data: '...base64encodeddata...'
 *               contentType: 'image/jpeg'
 */
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const id = req.params.id;
    const file = await FileModel.findById(id);

    if (!file) {
      return res.status(404).send('File not found');
    }

    file.data = req.file.buffer;
    file.contentType = req.file.mimetype;
    await file.save();

    res.json({
      data: file.data.toString('base64'),
      contentType: file.contentType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * @swagger
 * /file/{id}:
 *   get:
 *     summary: Get a file by ID
 *     tags: [File]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved
 *         content:
 *           application/json:
 *             example:
 *               data: '...base64encodeddata...'
 *               contentType: 'image/jpeg'
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const file = await FileModel.findById(id);

    if (!file) {
      return res.status(404).send('File not found');
    }

    res.json({
      data: file.data.toString('base64'),
      contentType: file.contentType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
