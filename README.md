# Skinalyze  
*"Scan your skin, understand your condition."*

---

## 📋 Deskripsi
**Skinalyze** adalah aplikasi berbasis web yang memungkinkan pengguna mengunggah gambar kulit untuk dianalisis secara otomatis menggunakan model machine learning.  
Aplikasi ini bertujuan untuk memberikan deteksi awal mengenai berbagai jenis penyakit kulit kepada masyarakat umum.

---

## ✨ Fitur Utama
- 🔐 Login & Register dengan keamanan hashing
- 📤 Upload gambar dari galeri atau kamera
- 🤖 Prediksi penyakit kulit dengan confidence level
- 📊 Hasil ditampilkan di halaman terpisah
- 🔗 Backend API menggunakan TensorFlow & Flask

---

## 🛠 Teknologi yang Digunakan

- **Frontend:** Node.js  
- **Backend:** Node.js (Hapi)  
- **ML API:** Python (Flask)  
- **Machine Learning Model:** TensorFlow + MobileNetV2  
- **Database:** MongoDB Atlas  
- **Hosting:** Netlify (frontend), Render (backend)

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

### 🔹 Frontend
```bash
cd frontend
npm install
npm start

### 🔹 Backend
cd backend
npm install
node src/server.js

### 🔹 Backend ML
cd ml-api
pip install -r requirements.txt
python app.py

Capstone-Project/
├── frontend/
├── backend/
├── ml-api/
├── machinelearning/
└── README.md
