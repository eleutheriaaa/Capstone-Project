# Skinalyze
"Scan your skin, understand your condition."  

Deskripsi:
Skinalyze adalah aplikasi berbasis web yang memungkinkan pengguna mengunggah gambar kulit untuk dianalisis secara otomatis menggunakan model machine learning. Aplikasi ini bertujuan untuk memberikan deteksi awal dan edukasi mengenai berbagai jenis penyakit kulit.

Fitur:
- Login & Register dengan keamanan hashing
- Upload gambar dari galeri atau kamera
- Prediksi penyakit kulit dengan confidence level
- Hasil ditampilkan dalam halaman terpisah
- Backend API menggunakan TensorFlow & Flask

Teknologi yang Digunakan
- Frontend: Node.js
- Backend: Node.js (Hapi), Python (Flask for ML API)
- Machine Learning: TensorFlow, MobileNetV2
- Database: MongoDB Atlas
- Hosting: Netlify (frontend), Render (backend)

Cara Menjalankan Proyek Secara Lokal
Frontend
1. Clone repo ini
2. Jalankan `npm install`
3. Jalankan `npm start`

Backend
1. Jalankan `npm install`
2. Jalankan `node src/server.js`

Backend ML
1. Jalankan `pip install -r requirements.txt`
2. Jalankan `python app.py`

Capstone-Project/
├── Frontend/
├── Backend/
├── Backend ML/
├── MachineLearning/
└── README.md
