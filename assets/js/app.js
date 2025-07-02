const { createApp } = Vue

// Try multiple possible API URLs
const possibleUrls = [
  'http://localhost/webperaktikum2/ci4/public'
]

let apiUrl = 'http://localhost/webperaktikum2/ci4/public' // Default

// Function to test API connection
async function findWorkingApiUrl() {
  console.log('🔍 Mencari URL API yang bekerja...')

  for (const url of possibleUrls) {
    try {
      console.log(`Testing: ${url}/post`)
      const response = await fetch(`${url}/post`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        apiUrl = url
        console.log(`✅ URL yang bekerja: ${url}`)
        return url
      }
    } catch (error) {
      console.log(`❌ ${url} tidak bekerja:`, error.message)
    }
  }

  console.error('❌ Tidak ada URL yang bekerja!')
  return null
}

createApp({
  data() {
    return {
      artikel: [],
      formData: {
        id: null,
        judul: '',
        isi: '',
        status: 0,
        gambar: null
      },
      selectedFile: null,
      imagePreview: null,
      isUploading: false,
      showForm: false,
      formTitle: 'Tambah Data',
      statusOptions: [
        { text: 'Draft', value: 0 },
        { text: 'Publish', value: 1 }
      ]
    }
  },
  async mounted() {
    console.log('🚀 Vue app mounted, testing API connection...')

    // Test API connection first
    const workingUrl = await findWorkingApiUrl()

    if (workingUrl) {
      apiUrl = workingUrl
      console.log(`✅ Using API URL: ${apiUrl}`)
      this.loadData()
    } else {
      console.error('❌ Tidak dapat terhubung ke API')
      alert('❌ Tidak dapat terhubung ke server CodeIgniter.\n\nPastikan:\n1. XAMPP Apache sudah running\n2. CodeIgniter berjalan di http://localhost/ci4/public\n3. Database sudah dikonfigurasi')
    }
  },
  methods: {
    async loadData() {
      console.log(`📡 Loading data from: ${apiUrl}/post`)

      try {
        // Add timeout and better error handling
        const response = await axios.get(apiUrl + '/post', {
          timeout: 10000, // 10 second timeout
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        console.log('✅ API Response:', response.data)

        // Check if response contains database error
        if (response.data.error === 'Database tidak terhubung') {
          console.warn('⚠️ Database tidak terhubung')
          this.artikel = []
          alert('⚠️ Database MySQL tidak running!\n\n' +
                response.data.message + '\n\n' +
                'Langkah-langkah:\n' +
                response.data.troubleshoot.join('\n'))
          return
        }

        this.artikel = response.data.artikel || []

        if (this.artikel.length === 0) {
          console.log('ℹ️ Tidak ada artikel ditemukan')
        }

      } catch (err) {
        console.error('❌ Error loading data:', err)

        let errorMessage = 'Gagal memuat data artikel'
        let troubleshoot = ''

        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Koneksi timeout - server terlalu lama merespons'
          troubleshoot = '\n\nCoba:\n1. Restart XAMPP Apache\n2. Cek apakah CodeIgniter berjalan'
        } else if (err.response) {
          const errorData = err.response.data
          errorMessage = errorData.message ||
                        errorData.messages?.error ||
                        `Server error: ${err.response.status}`
          troubleshoot = `\n\nServer response: ${err.response.status}`
        } else if (err.request) {
          errorMessage = 'Tidak dapat terhubung ke server'
          troubleshoot = '\n\nCoba:\n1. Pastikan XAMPP Apache running\n2. Cek URL: ' + apiUrl
        } else {
          errorMessage = err.message
        }

        alert('Error: ' + errorMessage + troubleshoot)
      }
    },
    tambah() {
      this.showForm = true
      this.formTitle = 'Tambah Data'
      this.formData = { id: null, judul: '', isi: '', status: 0, gambar: null }
      this.selectedFile = null
      this.imagePreview = null
    },
    edit(row) {
      this.showForm = true
      this.formTitle = 'Ubah Data'
      this.formData = { ...row }
      this.selectedFile = null
      this.imagePreview = null
    },
    async hapus(index, id) {
      if (confirm('Yakin ingin menghapus data ini?')) {
        try {
          console.log(`🗑️ Deleting article ID: ${id}`)

          const response = await axios.delete(apiUrl + '/post/' + id, {
            timeout: 10000,
            headers: {
              'Accept': 'application/json'
            }
          })

          console.log('✅ Delete response:', response.data)

          // Check if deletion was successful
          if (response.status >= 200 && response.status < 300) {
            this.artikel.splice(index, 1)
            alert('✅ Data berhasil dihapus!')
          }

        } catch (err) {
          console.error('❌ Error deleting data:', err)

          let errorMessage = 'Gagal menghapus data'
          let troubleshoot = ''

          if (err.code === 'ECONNABORTED') {
            errorMessage = 'Delete timeout - server terlalu lama merespons'
            troubleshoot = '\n\nCoba restart XAMPP Apache'
          } else if (err.response) {
            const errorData = err.response.data
            errorMessage = errorData.message ||
                          errorData.messages?.error ||
                          `Server error: ${err.response.status}`
            troubleshoot = `\n\nServer response: ${err.response.status}`
          } else if (err.request) {
            errorMessage = 'Tidak dapat terhubung ke server'
            troubleshoot = '\n\nCek koneksi ke: ' + apiUrl
          } else {
            errorMessage = err.message
          }

          alert('❌ Error: ' + errorMessage + troubleshoot)
        }
      }
    },
    async saveData() {
      this.isUploading = true

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('judul', this.formData.judul)
      formData.append('isi', this.formData.isi)
      formData.append('status', this.formData.status)

      if (this.selectedFile) {
        formData.append('gambar', this.selectedFile)
      }

      // For updates, add method override to use POST instead of PUT
      if (this.formData.id) {
        formData.append('_method', 'PUT')
      }

      const url = this.formData.id
        ? apiUrl + '/post/' + this.formData.id
        : apiUrl + '/post'

      // Always use POST for FormData (with _method override for updates)
      try {
        console.log(`💾 Saving data to: ${url}`)

        const response = await axios.post(url, formData, {
          timeout: 15000, // 15 second timeout for file upload
          headers: {
            'Accept': 'application/json'
            // Don't set Content-Type for FormData - let browser handle it
          }
        })

        console.log('✅ Save response:', response.data)

        // Check if response indicates success
        if (response.status >= 200 && response.status < 300) {
          // Check for specific success indicators in response data
          const responseData = response.data
          const isSuccess = responseData.status === 200 ||
                           responseData.status === 201 ||
                           responseData.messages?.success ||
                           !responseData.error

          if (isSuccess) {
            await this.loadData() // Reload data
            this.closeModal()
            alert('✅ Data berhasil disimpan!')
          } else {
            // Handle API-level errors (status 200 but with error in data)
            const errorMsg = responseData.message ||
                            responseData.messages?.error ||
                            'Terjadi kesalahan saat menyimpan data'
            console.error('❌ API Error:', responseData)
            alert('❌ Error: ' + errorMsg)
          }
        }

      } catch (err) {
        console.error('❌ Error saving data:', err)
        console.error('Error details:', err.response)

        // Handle different types of errors
        let errorMessage = 'Terjadi kesalahan saat menyimpan data'
        let troubleshoot = ''

        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Upload timeout - file terlalu besar atau koneksi lambat'
          troubleshoot = '\n\nCoba:\n1. Gunakan gambar yang lebih kecil\n2. Cek koneksi internet'
        } else if (err.response) {
          // Server responded with error status
          const errorData = err.response.data
          errorMessage = errorData.message ||
                        errorData.messages?.error ||
                        `Server error: ${err.response.status}`
          troubleshoot = `\n\nServer response: ${err.response.status}`
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = 'Tidak dapat terhubung ke server'
          troubleshoot = '\n\nCoba:\n1. Pastikan XAMPP Apache running\n2. Cek koneksi ke: ' + apiUrl
        } else {
          // Something else happened
          errorMessage = err.message
        }

        alert('❌ Error: ' + errorMessage + troubleshoot)
      } finally {
        this.isUploading = false
      }
    },
    statusText(status) {
      return status == 1 ? 'Publish' : 'Draft'
    },
    closeModal() {
      this.showForm = false
      this.formData = { id: null, judul: '', isi: '', status: 0, gambar: null }
      this.selectedFile = null
      this.imagePreview = null
      this.isUploading = false
      // Reset file input
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
          alert('File harus berupa gambar (JPEG, PNG, GIF)')
          event.target.value = ''
          return
        }

        // Validate file size (2MB)
        if (file.size > 2048000) {
          alert('Ukuran file maksimal 2MB')
          event.target.value = ''
          return
        }

        this.selectedFile = file

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    removeImage() {
      this.selectedFile = null
      this.imagePreview = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    removeExistingImage() {
      this.formData.gambar = null
    }
  }
}).mount('#app')
