# 🧪 Praktikum Pemrograman Website 2 - VueJS Manual

## 👤 Profil Mahasiswa

| Atribut      | Keterangan            |
|--------------|-----------------------|
| Nama         | Ariq Ibtihal          |
| NIM          | 312310446             |
| Kelas        | TI.23.A.5             |
| Mata Kuliah  | Pemrograman Website 2 |

## 📋 Deskripsi

Praktikum ini membahas cara penggunaan VueJS secara manual (tanpa NPM) menggunakan CDN, serta integrasi dengan Axios untuk melakukan call ke REST API. Fitur-fitur yang dibuat:

- Menampilkan data artikel
- Menambah data
- Mengubah data
- Menghapus data

## 🔧 Library yang Digunakan

- **VueJS**: `<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>`
- **Axios**: `<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>`

---

## 📄 File: `index.html`

Berikut adalah kode HTML utama untuk menampilkan daftar artikel dan form tambah/ubah.

```html
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
```

### 📸 Hasil Output `index.html`

![Hasil Output]
![Screenshot 2025-07-02 213718](https://github.com/user-attachments/assets/1bbf863e-2af1-4a01-8d54-23f0ff16fdd4)


---

## 📄 File: `assets/js/app.js`

Berikut adalah kode JavaScript utama menggunakan Vue 3 dan Axios.

```javascript
const { createApp } = Vue
const apiUrl = 'http://localhost/webperaktikum2/ci4/public' // Sesuaikan dengan URL API Anda

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
          this.artikel = response.data.artikel || []
        })
        .catch(error => console.error('Error loading data:', error))
    },
    submitForm() {
      const url = this.form.id ? `${apiUrl}/post/${this.form.id}` : `${apiUrl}/post`;
      const method = this.form.id ? 'put' : 'post';

      axios[method](url, this.form)
        .then(() => {
          this.loadData()
          this.resetForm()
        })
        .catch(error => console.error('Error saving data:', error))
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
          .catch(error => console.error('Error deleting data:', error))
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
```

---

## 🎨 File: `assets/css/style.css`

File ini berisi styling dasar untuk tampilan aplikasi.

```css
body {
  font-family: Arial, sans-serif;
  margin: 20px;
  background-color: #f4f4f4;
  color: #333;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

form {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

input, textarea {
  display: block;
  margin-bottom: 10px;
  width: calc(100% - 16px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  margin-right: 5px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
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
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f8f8f8;
}
```

### 📸 Hasil Output `style.css`

![Hasil Output]
![Screenshot 2025-07-02 215156](https://github.com/user-attachments/assets/342746c6-39ef-41ac-9863-2c4a96824b28)

