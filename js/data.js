/*
 * Data katalog Lentera Lembaran
 *
 * Untuk menambah bacaan, salin satu blok { ... } lalu sesuaikan isinya.
 * Genre baru akan muncul otomatis pada halaman Buku dan Novel.
 *
 * Sampul bersifat opsional. Simpan berkas jpg di folder images dengan nama
 * sesuai judul, misalnya images/sapiens.jpg. Daftar nama berkas yang
 * lengkap tersedia di images/BACA-SAYA.txt. Jika berkas tidak ada,
 * situs menampilkan sampul bawaan.
 *
 * Bidang tautan (opsional) dapat diisi dengan alamat bacaan daring tertentu.
 * Bila kosong, tombol membaca mencari judul tersebut di Open Library.
 */


/* ---------- Buku (nonfiksi) ---------- */

const BUKU = [
    {
        judul: "Sapiens",
        penulis: "Yuval Noah Harari",
        genre: "Sejarah",
        ringkasan: "Menelusuri perjalanan manusia dari pemburu-pengumpul hingga penguasa bumi, dan bagaimana kisah bersama menyatukan jutaan orang asing."
    },
    {
        judul: "Guns, Germs, and Steel",
        penulis: "Jared Diamond",
        genre: "Sejarah",
        ringkasan: "Mencari sebab ketimpangan perkembangan peradaban lewat pengaruh geografi, penyakit, dan persebaran tanaman serta hewan."
    },
    {
        judul: "A Brief History of Time",
        penulis: "Stephen Hawking",
        genre: "Sains",
        ringkasan: "Pengantar bagi pembaca umum tentang asal mula alam semesta, lubang hitam, dan hakikat waktu."
    },
    {
        judul: "Cosmos",
        penulis: "Carl Sagan",
        genre: "Sains",
        ringkasan: "Perjalanan lintas ruang dan waktu yang mengajak manusia memandang dirinya sebagai bagian kecil dari kosmos yang luas."
    },
    {
        judul: "The Innovators",
        penulis: "Walter Isaacson",
        genre: "Teknologi",
        ringkasan: "Kisah para perintis dan kerja sama yang melahirkan komputer serta internet."
    },
    {
        judul: "The Code Book",
        penulis: "Simon Singh",
        genre: "Teknologi",
        ringkasan: "Sejarah sandi dan upaya memecahkannya, dari pesan rahasia para raja hingga keamanan digital masa kini."
    },
    {
        judul: "Thinking, Fast and Slow",
        penulis: "Daniel Kahneman",
        genre: "Psikologi",
        ringkasan: "Menguraikan dua cara berpikir manusia, yang cepat dan intuitif serta yang lambat dan cermat, beserta pengaruhnya pada keputusan."
    },
    {
        judul: "Man's Search for Meaning",
        penulis: "Viktor E. Frankl",
        genre: "Psikologi",
        ringkasan: "Renungan seorang penyintas kamp konsentrasi tentang makna hidup yang masih dapat ditemukan di tengah penderitaan."
    },
    {
        judul: "Atomic Habits",
        penulis: "James Clear",
        genre: "Pengembangan Diri",
        ringkasan: "Cara membangun kebiasaan baik dan meninggalkan yang buruk melalui perubahan kecil yang dilakukan terus-menerus."
    },
    {
        judul: "Deep Work",
        penulis: "Cal Newport",
        genre: "Pengembangan Diri",
        ringkasan: "Argumen tentang pentingnya bekerja secara mendalam dan tanpa gangguan di tengah dunia yang serba teralihkan."
    },
    {
        judul: "Filosofi Teras",
        penulis: "Henry Manampiring",
        genre: "Filsafat",
        ringkasan: "Pengantar Stoisisme yang ringan untuk menghadapi emosi negatif dan hal-hal di luar kendali kita."
    },
    {
        judul: "Meditations",
        penulis: "Marcus Aurelius",
        genre: "Filsafat",
        ringkasan: "Catatan pribadi seorang kaisar Romawi tentang ketenangan, kewajiban, dan keteguhan batin."
    },
    {
        judul: "Freakonomics",
        penulis: "Steven D. Levitt dan Stephen J. Dubner",
        genre: "Ekonomi",
        ringkasan: "Memakai kacamata ekonomi untuk menjelaskan hal-hal tak terduga, dari insentif hingga kebiasaan sehari-hari."
    },
    {
        judul: "The Psychology of Money",
        penulis: "Morgan Housel",
        genre: "Ekonomi",
        ringkasan: "Menunjukkan bahwa keputusan keuangan lebih banyak ditentukan oleh perilaku dan watak daripada kepandaian menghitung."
    },
    {
        judul: "Steve Jobs",
        penulis: "Walter Isaacson",
        genre: "Biografi",
        ringkasan: "Potret pendiri Apple yang berbakat sekaligus keras kepala, disusun dari puluhan wawancara langsung."
    },
    {
        judul: "Becoming",
        penulis: "Michelle Obama",
        genre: "Biografi",
        ringkasan: "Memoar tentang perjalanan dari Chicago hingga Gedung Putih, dan tentang keberanian untuk terus bertumbuh."
    }
];


/* ---------- Novel (fiksi) ---------- */

const NOVEL = [
    {
        judul: "Harry Potter dan Batu Bertuah",
        penulis: "J.K. Rowling",
        genre: "Fantasi",
        ringkasan: "Seorang anak yatim yang baru mengetahui dirinya penyihir mulai menjalani kehidupan baru di sekolah sihir Hogwarts."
    },
    {
        judul: "Singa, Penyihir, dan Lemari Pakaian",
        penulis: "C.S. Lewis",
        genre: "Fantasi",
        ringkasan: "Empat bersaudara menemukan negeri Narnia di balik sebuah lemari, tempat musim dingin tak kunjung usai dan seekor singa agung menanti."
    },
    {
        judul: "The Hobbit",
        penulis: "J.R.R. Tolkien",
        genre: "Petualangan",
        ringkasan: "Bilbo Baggins meninggalkan rumah nyamannya untuk menemani para kurcaci merebut kembali harta karun yang dijaga seekor naga."
    },
    {
        judul: "Life of Pi",
        penulis: "Yann Martel",
        genre: "Petualangan",
        ringkasan: "Seorang pemuda bertahan hidup di sekoci bersama seekor harimau Bengal setelah kapal yang ditumpanginya tenggelam."
    },
    {
        judul: "The Three Musketeers",
        penulis: "Alexandre Dumas",
        genre: "Aksi",
        ringkasan: "D'Artagnan muda tiba di Paris dan bergabung dengan tiga pengawal raja dalam intrik istana yang penuh duel dan kesetiaan."
    },
    {
        judul: "Casino Royale",
        penulis: "Ian Fleming",
        genre: "Aksi",
        ringkasan: "Petualangan pertama agen rahasia James Bond, yang ditugaskan mengalahkan seorang musuh berbahaya di meja judi."
    },
    {
        judul: "Pride and Prejudice",
        penulis: "Jane Austen",
        genre: "Romansa",
        ringkasan: "Salah paham, gengsi, dan prasangka antara Elizabeth Bennet dan Mr. Darcy dalam masyarakat Inggris awal abad ke-19."
    },
    {
        judul: "Perahu Kertas",
        penulis: "Dee Lestari",
        genre: "Romansa",
        ringkasan: "Kisah Kugy dan Keenan, dua anak muda yang mengejar mimpi masing-masing sambil saling mencari arah."
    },
    {
        judul: "Anna Karenina",
        penulis: "Leo Tolstoy",
        genre: "Drama",
        ringkasan: "Cinta terlarang seorang perempuan bangsawan dan harga yang harus ia bayar di tengah masyarakat Rusia yang kaku."
    },
    {
        judul: "Laskar Pelangi",
        penulis: "Andrea Hirata",
        genre: "Drama",
        ringkasan: "Sepuluh murid dan dua guru bertahan di sekolah miskin di Belitung, belajar bahwa mimpi tidak mengenal keterbatasan."
    },
    {
        judul: "And Then There Were None",
        penulis: "Agatha Christie",
        genre: "Misteri",
        ringkasan: "Sepuluh orang yang tidak saling mengenal terjebak di sebuah pulau, lalu satu per satu menjadi korban."
    },
    {
        judul: "The Hound of the Baskervilles",
        penulis: "Arthur Conan Doyle",
        genre: "Misteri",
        ringkasan: "Sherlock Holmes menyelidiki kutukan seekor anjing raksasa yang menghantui keluarga Baskerville di rawa Dartmoor."
    },
    {
        judul: "Gone Girl",
        penulis: "Gillian Flynn",
        genre: "Thriller",
        ringkasan: "Hilangnya seorang istri pada hari ulang tahun pernikahannya membuka rahasia yang tersembunyi di balik rumah tangga mereka."
    },
    {
        judul: "The Da Vinci Code",
        penulis: "Dan Brown",
        genre: "Thriller",
        ringkasan: "Pembunuhan di Museum Louvre menyeret seorang pakar simbol ke dalam perburuan teka-teki yang menyangkut sejarah gereja."
    },
    {
        judul: "Dracula",
        penulis: "Bram Stoker",
        genre: "Horor",
        ringkasan: "Seorang pengacara muda menemukan rahasia kelam Count Dracula, yang kemudian mengincar Inggris."
    },
    {
        judul: "The Shining",
        penulis: "Stephen King",
        genre: "Horor",
        ringkasan: "Sebuah keluarga menjaga hotel terpencil sepanjang musim dingin, dan kekuatan jahat di dalamnya mulai merasuki sang ayah."
    },
    {
        judul: "Dune",
        penulis: "Frank Herbert",
        genre: "Fiksi Ilmiah",
        ringkasan: "Perebutan Arrakis, planet gurun penghasil rempah yang paling berharga di alam semesta."
    },
    {
        judul: "The Martian",
        penulis: "Andy Weir",
        genre: "Fiksi Ilmiah",
        ringkasan: "Seorang astronaut tertinggal sendirian di Mars dan harus bertahan hidup dengan akal serta ilmu pengetahuan."
    },
    {
        judul: "1984",
        penulis: "George Orwell",
        genre: "Distopia",
        ringkasan: "Winston Smith hidup di bawah pengawasan Big Brother dan mulai menentang kekuasaan yang mengatur bahkan isi pikiran."
    },
    {
        judul: "The Hunger Games",
        penulis: "Suzanne Collins",
        genre: "Distopia",
        ringkasan: "Katniss Everdeen menggantikan adiknya dalam pertandingan bertahan hidup yang disiarkan sebagai tontonan."
    }
];


/* ---------- Artikel ---------- */

const ARTIKEL = [
    {
        judul: "Lima Bacaan untuk Akhir Pekan",
        rubrik: "Rekomendasi",
        ringkasan: "Pilihan dari katalog kami untuk mengisi hari libur, dari yang ringan hingga yang mengajak merenung.",
        isi: "Awali dengan Perahu Kertas atau Laskar Pelangi untuk kehangatan ceritanya, lanjutkan dengan Filosofi Teras atau Atomic Habits sebagai bahan renungan, lalu tutup dengan And Then There Were None agar akhir pekan dihabiskan bersama rasa penasaran. Bacalah tanpa target halaman. Hari libur adalah waktu untuk menikmati, bukan untuk mengejar angka."
    },
    {
        judul: "Dua Puluh Menit Setiap Hari",
        rubrik: "Kebiasaan Membaca",
        ringkasan: "Waktu yang singkat tetapi teratur sering kali lebih berpengaruh daripada waktu panjang yang jarang.",
        isi: "Kebiasaan tumbuh dari keteraturan, bukan dari lamanya. Dua puluh menit setiap hari, bila dijaga selama setahun, cukup untuk menamatkan belasan buku. Pilih jam yang sama, letakkan buku di tempat yang mudah terlihat, dan jangan memaksakan diri menamatkan bacaan yang belum cocok. Membaca seharusnya menjadi jeda yang menenangkan, bukan beban baru."
    },
    {
        judul: "Menjaga Fokus Saat Membaca di Layar",
        rubrik: "Literasi Digital",
        ringkasan: "Cara sederhana agar membaca di ponsel atau laptop tidak mudah terpecah oleh gangguan.",
        isi: "Matikan notifikasi sebelum mulai, atur ukuran huruf dan kecerahan layar agar nyaman bagi mata, dan beri jeda singkat secara berkala. Aturan 20-20-20 dapat membantu: setiap dua puluh menit, pandanglah benda yang berjarak sekitar enam meter selama dua puluh detik."
    },
    {
        judul: "Memilih Novel Pertama",
        rubrik: "Panduan",
        ringkasan: "Mulailah dari genre yang paling akrab, lalu biarkan rasa penasaran menentukan arah berikutnya.",
        isi: "Jika Anda lebih sering menikmati film atau serial dengan genre tertentu, mulailah dari genre itu. Baca sinopsis dan beberapa halaman awal sebelum memutuskan. Bila setelah seratus halaman cerita belum terasa menarik, berganti bacaan bukanlah kegagalan, melainkan bagian dari proses mengenali selera."
    }
];
