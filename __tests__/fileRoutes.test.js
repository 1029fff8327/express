const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const FileModel = require('../models/FileModel');

jest.mock('../models/FileModel');

beforeAll(async () => {
  // Подключение к тестовой базе данных MongoDB
  await mongoose.connect('mongodb://localhost:27017/testFileStorage', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Отключение от базы данных после завершения тестов
  await mongoose.disconnect();
});

// Тест для POST /file
test('POST /file should upload a file', async () => {
  const response = await request(app)
    .post('/file')
    .attach('file', Buffer.from('dummyfilecontent'), 'testfile.txt');

  expect(response.status).toBe(200);
  expect(FileModel.prototype.save).toHaveBeenCalled();
  expect(response.body).toHaveProperty('data');
  expect(response.body).toHaveProperty('contentType');
});

// Тест для PUT /file/:id
test('PUT /file/:id should update a file by ID', async () => {
  const fileId = mongoose.Types.ObjectId();
  FileModel.findById.mockResolvedValueOnce({
    _id: fileId,
    data: Buffer.from('originalfilecontent'),
    contentType: 'text/plain',
  });

  const response = await request(app)
    .put(`/file/${fileId}`)
    .attach('file', Buffer.from('updatedfilecontent'), 'updatedfile.txt');

  expect(response.status).toBe(200);
  expect(FileModel.findById).toHaveBeenCalledWith(fileId);
  expect(FileModel.prototype.save).toHaveBeenCalled();
  expect(response.body).toHaveProperty('data');
  expect(response.body).toHaveProperty('contentType');
});

// Тест для GET /file/:id
test('GET /file/:id should get a file by ID', async () => {
  const fileId = mongoose.Types.ObjectId();
  FileModel.findById.mockResolvedValueOnce({
    _id: fileId,
    data: Buffer.from('filecontent'),
    contentType: 'text/plain',
  });

  const response = await request(app).get(`/file/${fileId}`);

  expect(response.status).toBe(200);
  expect(FileModel.findById).toHaveBeenCalledWith(fileId);
  expect(response.body).toHaveProperty('data');
  expect(response.body).toHaveProperty('contentType');
});

// Дополнительные тесты могут быть добавлены по необходимости
