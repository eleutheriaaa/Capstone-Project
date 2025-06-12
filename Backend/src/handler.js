const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Upload = require('./models/upload');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

console.log('SECRET_KEY:', process.env.SECRET_KEY);

const addUploadHandler = async (request, h) => {
  const authorization = request.headers.authorization;
  if (!authorization) {
    return h.response({
      status: 'fail',
      message: 'Token tidak ditemukan',
    }).code(401);
  }

  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // decoded.id atau decoded.username bisa dipakai kalau ingin menyimpan user ID ke database
  } catch (err) {
    return h.response({
      status: 'fail',
      message: 'Token tidak valid',
    }).code(401);
  }

  const { image } = request.payload;
  const id = nanoid(16);
  const filename = `${id}.jpg`;
  const filepath = path.join(__dirname, 'uploads', filename);

  const fileStream = fs.createWriteStream(filepath);
  await new Promise((resolve, reject) => {
    image.pipe(fileStream);
    image.on('end', resolve);
    image.on('error', reject);
  });

  try {
    const newUpload = new Upload({
      filename,
      createdAt: new Date(),
    });

    await newUpload.save();

    const response = h.response({
      status: 'success',
      message: 'Gambar berhasil ditambahkan',
      data: {
        id: newUpload._id,
        filename: newUpload.filename,
      },
    });
    response.code(201);
    return response;

  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menyimpan data upload',
    });
    response.code(500);
    return response;
  }
};

const addRegistrationHandler = async (request, h) => {
  const { username, email, password } = request.payload;

  if (!username || !email || !password) {
    return h.response({
      status: 'fail',
      message: 'Semua field wajib diisi',
    }).code(400);
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return h.response({
        status: 'fail',
        message: 'Username sudah terdaftar',
      }).code(400);
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return h.response({
        status: 'fail',
        message: 'Email sudah terdaftar',
      }).code(400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        id: newUser._id,
        username: newUser.username,
      },
    }).code(201);

  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Gagal menyimpan user',
    }).code(500);
  }
};

const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return h.response({
        status: 'fail',
        message: 'Email atau password salah',
      }).code(401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return h.response({
        status: 'fail',
        message: 'Email atau password salah',
      }).code(401);
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return h.response({
      status: 'success',
      message: 'Login berhasil',
      data: {
        id: user._id,
        email: user.email,
        token,
      },
    }).code(200);

  } catch (error) {
    console.error('Login error:', error); 
    return h.response({
      status: 'fail',
      message: 'Gagal melakukan login',
    }).code(500);
  }
};

const getUploadDetailHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const uploadData = await Upload.findById(id);
    if (!uploadData) {
      return h.response({
        status: 'fail',
        message: 'Data tidak ditemukan',
      }).code(404);
    }

    // Buat URL gambar lengkap
    const imageUrl = `${process.env.BASE_URL}/uploads/${uploadData.filename}`;

    return h.response({
      status: 'success',
      data: {
        id: uploadData._id,
        imageUrl,
        // bisa tambah data lain kalau ada (misal hasil analisa)
      },
    });
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Gagal mengambil data',
    }).code(500);
  }
};

module.exports = { addUploadHandler, addRegistrationHandler, loginHandler, getUploadDetailHandler };