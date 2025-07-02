🧪 Praktikum Pemrograman Website 2 - VueJS Manual
👤 Profil Mahasiswa
| Atribut      | Keterangan            |
|--------------|-----------------------|
| Nama         | Ariq Ibtihal          |
| NIM          | 312310446             |
| Kelas        | TI.23.A.5             |
| Mata Kuliah  | Pemrograman Website 2 |
📋 Deskripsi
Praktikum ini membahas cara penggunaan VueJS secara manual (tanpa NPM) menggunakan CDN, serta integrasi dengan Axios untuk melakukan call ke REST API. Fitur-fitur yang dibuat:

Menampilkan data artikel
Menambah data
Mengubah data
Menghapus data
🔧 Library yang Digunakan
VueJS
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
📄 File: index.html
Berikut adalah kode HTML utama untuk menampilkan daftar artikel dan form tambah/ubah menggunakan VueJS dan Axios via CDN.

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>VueJS Manual - Artikel</title>
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>
  <div id="app">
    <h2>Daftar Artikel</h2>

    <!-- Form Tambah & Ubah -->
    <form @submit.prevent="submitForm">
      <input v-model="form.judul" placeholder="Judul" required />
      <textarea v-model="form.isi" placeholder="Isi artikel" required></textarea>
      <button type="submit">{{ form.id ? 'Ubah' : 'Tambah' }}</button>
    </form>

    <!-- Tabel Data -->
    <table>
      <thead>
        <tr>
          <th>Judul</th>
          <th>Isi</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in artikel" :key="item.id">
          <td>{{ item.judul }}</td>
          <td>{{ item.isi }}</td>
          <td>
            <button @click="editData(item)">Edit</button>
            <button @click="deleteData(item.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- CDN Vue & Axios -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="assets/js/app.js"></script>
</body>
</html>
📄 File: assets/js/app.js
Berikut adalah kode JavaScript utama menggunakan Vue 3 dan Axios, untuk mengatur data artikel melalui REST API.

const { createApp } = Vue
const apiUrl = 'http://localhost/labci4/public' // Ganti dengan URL API kamu

createApp({
  data() {
    return {
      artikel: [],
      form: {
        id: null,
        judul: '',
        isi: ''
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      axios.get(apiUrl + '/post')
        .then(response => {
          this.artikel = response.data
        })
        .catch(error => console.error(error))
    },
    submitForm() {
      if (this.form.id) {
        // Edit data
        axios.put(`${apiUrl}/post/${this.form.id}`, this.form)
          .then(() => {
            this.loadData()
            this.resetForm()
          })
          .catch(error => console.error(error))
      } else {
        // Tambah data
        axios.post(apiUrl + '/post', this.form)
          .then(() => {
            this.loadData()
            this.resetForm()
          })
          .catch(error => console.error(error))
      }
    },
    editData(item) {
      this.form = { ...item }
    },
    deleteData(id) {
      if (confirm('Yakin ingin menghapus data ini?')) {
        axios.delete(`${apiUrl}/post/${id}`)
          .then(() => {
            this.loadData()
          })
          .catch(error => console.error(error))
      }
    },
    resetForm() {
      this.form = {
        id: null,
        judul: '',
        isi: ''
      }
    }
  }
}).mount('#app')
📸 Hasil Output
![Hasil Output](https://via.placeholder.com/600x400.png?text=Hasil+Output)

🎨 File: assets/css/style.css
File ini berisi styling dasar untuk tampilan aplikasi artikel VueJS. Gaya yang digunakan bersifat minimalis dan responsif.

body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

form {
  margin-bottom: 20px;
}

input, textarea {
  display: block;
  margin-bottom: 10px;
  width: 100%;
  padding: 8px;
}

button {
  padding: 8px 12px;
  margin-right: 5px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: left;
}
📸 Hasil Output
![Hasil Output](https://via.placeholder.com/600x400.png?text=Hasil+Output)
