/* ============================================================
 * Lentera Lembaran - Skrip utama
 * Isi: kerangka halaman, katalog, koleksi pribadi, dan akun.
 * Data bacaan dan artikel berada di js/data.js.
 * ============================================================ */


/* ---------- 1. Konfigurasi ---------- */

// Ganti dengan alamat surel pengelola. Formulir kontak mengirim ke alamat ini.
const SUREL_PENGELOLA = "pengelola@example.com";

const KUNCI_AKUN = "lentera.akun";
const KUNCI_SESI = "lentera.sesi";

const MENU = [
    { berkas: "index.html", nama: "Beranda", kode: "index" },
    { berkas: "books.html", nama: "Buku", kode: "books" },
    { berkas: "novels.html", nama: "Novel", kode: "novels" },
    { berkas: "collection.html", nama: "Koleksi", kode: "collection" },
    { berkas: "news.html", nama: "Artikel", kode: "news" },
    { berkas: "about.html", nama: "Tentang", kode: "about" },
    { berkas: "contact.html", nama: "Kontak", kode: "contact" }
];

const LABEL_ALIH = {
    favorit: ["Tambah ke Favorit", "Hapus dari Favorit"],
    simpanan: ["Simpan untuk Nanti", "Hapus dari Simpanan"]
};

const PESAN_KOSONG = {
    favorit: "Belum ada favorit. Tandai bacaan yang Anda sukai agar mudah ditemukan kembali.",
    simpanan: "Belum ada simpanan. Simpan bacaan yang ingin Anda baca pada kesempatan berikutnya.",
    riwayat: "Riwayat masih kosong. Bacaan yang Anda buka akan tercatat di sini."
};

const GALAT_KRIPTO = {
    ok: false,
    pesan: "Peramban ini belum mendukung penyimpanan kata sandi yang aman. Buka situs melalui https atau localhost."
};

const halaman = document.body.dataset.halaman;

// Dijalankan ulang saat dialog bacaan ditutup. Diatur oleh masing-masing halaman.
let segarkanHalaman = () => {};


/* ---------- 2. Fungsi bantu ---------- */

function ambilData(kunci, bawaan) {
    try {
        const nilai = localStorage.getItem(kunci);
        return nilai ? JSON.parse(nilai) : bawaan;
    } catch (galat) {
        return bawaan;
    }
}

function simpanData(kunci, nilai) {
    try {
        localStorage.setItem(kunci, JSON.stringify(nilai));
    } catch (galat) {
        console.warn("Penyimpanan peramban tidak tersedia.", galat);
    }
}

// Mengubah teks dari pengguna menjadi aman untuk disisipkan ke HTML.
function amankan(teks) {
    const el = document.createElement("div");
    el.textContent = teks;
    return el.innerHTML;
}

function buatId(judul) {
    return judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function isi(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}

function daftarGenre(data) {
    return [...new Set(data.map(item => item.genre))];
}


/* ---------- 3. Katalog ---------- */

const tambahId = item => ({ ...item, id: buatId(item.judul) });

const DAFTAR_BUKU = BUKU.map(tambahId);
const DAFTAR_NOVEL = NOVEL.map(tambahId);
const KATALOG = [...DAFTAR_BUKU, ...DAFTAR_NOVEL];

const cariItem = id => KATALOG.find(item => item.id === id);

function tautanBaca(item) {
    if (item.tautan) return item.tautan;
    return "https://openlibrary.org/search?q=" + encodeURIComponent(item.judul + " " + item.penulis);
}


/* ---------- 4. Akun ---------- */

const semuaAkun = () => ambilData(KUNCI_AKUN, []);

function akunAktif() {
    const id = ambilData(KUNCI_SESI, null);
    return semuaAkun().find(akun => akun.id === id) || null;
}

function kriptoTersedia() {
    return Boolean(window.crypto && window.crypto.subtle);
}

function buatGaram() {
    const acak = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(acak, b => b.toString(16).padStart(2, "0")).join("");
}

async function hashSandi(sandi, garam) {
    const pengkode = new TextEncoder();
    const kunci = await crypto.subtle.importKey("raw", pengkode.encode(sandi), "PBKDF2", false, ["deriveBits"]);
    const bit = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: pengkode.encode(garam), iterations: 100000, hash: "SHA-256" },
        kunci,
        256
    );
    return Array.from(new Uint8Array(bit), b => b.toString(16).padStart(2, "0")).join("");
}

async function aksiDaftar(nilai) {
    if (!kriptoTersedia()) return GALAT_KRIPTO;

    const surel = nilai.surel.trim().toLowerCase();
    const username = nilai.username.trim();
    const daftar = semuaAkun();

    if (daftar.some(akun => akun.surel === surel)) {
        return { ok: false, pesan: "Surel ini sudah terdaftar." };
    }
    if (daftar.some(akun => akun.username.toLowerCase() === username.toLowerCase())) {
        return { ok: false, pesan: "Nama pengguna ini sudah dipakai." };
    }

    const garam = buatGaram();
    const baru = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        nama: nilai.nama.trim(),
        surel: surel,
        username: username,
        garam: garam,
        hash: await hashSandi(nilai.sandi, garam)
    };

    simpanData(KUNCI_AKUN, [...daftar, baru]);
    simpanData(KUNCI_SESI, baru.id);
    return { ok: true, pesan: "Akun berhasil dibuat. Anda akan dialihkan ke beranda.", alihkan: "index.html" };
}

async function aksiMasuk(nilai) {
    if (!kriptoTersedia()) return GALAT_KRIPTO;

    const kunci = nilai.akun.trim().toLowerCase();
    const akun = semuaAkun().find(a => a.surel === kunci || a.username.toLowerCase() === kunci);
    const cocok = akun && (await hashSandi(nilai.sandi, akun.garam)) === akun.hash;

    if (!cocok) return { ok: false, pesan: "Akun atau kata sandi tidak sesuai." };

    simpanData(KUNCI_SESI, akun.id);
    return { ok: true, pesan: "Berhasil masuk. Anda akan dialihkan ke beranda.", alihkan: "index.html" };
}

function keluarAkun() {
    simpanData(KUNCI_SESI, null);
    location.href = "index.html";
}


/* ---------- 5. Koleksi pribadi ---------- */

// Setiap akun memiliki koleksi sendiri; pengunjung tanpa akun memakai koleksi "tamu".
function kunciKoleksi() {
    const akun = akunAktif();
    return "lentera.koleksi." + (akun ? akun.id : "tamu");
}

function ambilKoleksi() {
    const tersimpan = ambilData(kunciKoleksi(), {});
    return {
        favorit: tersimpan.favorit || [],
        simpanan: tersimpan.simpanan || [],
        riwayat: tersimpan.riwayat || []
    };
}

function simpanKoleksi(koleksi) {
    simpanData(kunciKoleksi(), koleksi);
}

function alihkan(daftar, id) {
    return daftar.includes(id) ? daftar.filter(x => x !== id) : [id, ...daftar];
}

function catatRiwayat(id) {
    const koleksi = ambilKoleksi();
    koleksi.riwayat = [id, ...koleksi.riwayat.filter(x => x !== id)].slice(0, 50);
    simpanKoleksi(koleksi);
}


/* ---------- 6. Komponen tampilan ---------- */

function tautanNav(berkas, nama, aktif) {
    const atribut = aktif ? ' class="on" aria-current="page"' : "";
    return `<a href="${berkas}"${atribut}>${nama}</a>`;
}

function renderKerangka() {
    const akun = akunAktif();
    const menuUtama = MENU.map(m => `<li>${tautanNav(m.berkas, m.nama, m.kode === halaman)}</li>`).join("");
    const menuAkun = akun
        ? `<li><button class="menu-akun" type="button" data-keluar>Keluar (${amankan(akun.nama.split(" ")[0])})</button></li>`
        : `<li>${tautanNav("login.html", "Masuk", halaman === "login")}</li>`;

    isi("header-situs", `
        <div class="navbar">
            <a class="logo" href="index.html">Lentera Lembaran</a>
            <button class="burger" type="button" aria-expanded="false" aria-controls="menu-utama">Menu</button>
            <nav aria-label="Navigasi utama">
                <ul class="menu" id="menu-utama">${menuUtama}${menuAkun}</ul>
            </nav>
        </div>`);

    isi("footer-situs", `
        <div class="container footer-isi">
            <div>
                <a class="logo" href="index.html">Lentera Lembaran</a>
                <p>Cahaya kecil pada setiap kisah.</p>
            </div>
            <ul class="footer-tautan">
                <li><a href="books.html">Buku</a></li>
                <li><a href="novels.html">Novel</a></li>
                <li><a href="collection.html">Koleksi</a></li>
                <li><a href="news.html">Artikel</a></li>
            </ul>
        </div>
        <p class="footer-hak">&copy; 2026 Lentera Lembaran</p>`);

    const burger = document.querySelector(".burger");
    const menu = document.getElementById("menu-utama");
    burger.addEventListener("click", () => {
        burger.setAttribute("aria-expanded", menu.classList.toggle("buka"));
    });
}

// Warna sampul ditentukan dari id agar selalu sama di setiap halaman.
function nomorWarna(id) {
    let jumlah = 0;
    for (const huruf of id) jumlah += huruf.charCodeAt(0);
    return jumlah % 5;
}

function buatSampul(item) {
    return `
        <div class="sampul warna-${nomorWarna(item.id)}">
            <img src="images/${item.id}.jpg" alt="Sampul ${item.judul}" onerror="this.remove()">
            <span class="sampul-judul">${item.judul}</span>
            <span class="sampul-penulis">${item.penulis}</span>
        </div>`;
}

function buatKartu(item) {
    return `
        <article class="kartu">
            ${buatSampul(item)}
            <h3><button class="kartu-buka" type="button" data-buka="${item.id}">${item.judul}</button></h3>
            <p class="penulis">${item.penulis}</p>
            <span class="tag">${item.genre}</span>
            <p class="ringkasan">${item.ringkasan}</p>
        </article>`;
}

function buatArtikel(artikel) {
    return `
        <li class="artikel">
            <span class="tag">${artikel.rubrik}</span>
            <h3>${artikel.judul}</h3>
            <p>${artikel.ringkasan}</p>
            <p class="artikel-isi" hidden>${artikel.isi}</p>
            <button class="btn btn-kecil" type="button" data-artikel aria-expanded="false">Baca Selengkapnya</button>
        </li>`;
}

function buatChipGenre(berkas, data) {
    return daftarGenre(data)
        .map(genre => `<a class="chip" href="${berkas}?genre=${encodeURIComponent(genre)}">${genre}</a>`)
        .join("");
}

function tombolAlih(jenis, id, aktif) {
    return `
        <button class="btn btn-garis" type="button" data-alih="${jenis}" data-id="${id}" aria-pressed="${aktif}">
            ${LABEL_ALIH[jenis][aktif ? 1 : 0]}
        </button>`;
}


/* ---------- 7. Dialog detail bacaan ---------- */

let dialogBuku = null;

function siapkanDialog() {
    dialogBuku = document.createElement("dialog");
    dialogBuku.className = "modal";
    dialogBuku.setAttribute("aria-labelledby", "judul-dialog");
    dialogBuku.addEventListener("close", () => segarkanHalaman());
    document.body.appendChild(dialogBuku);
}

function bukaDetail(id) {
    const item = cariItem(id);
    if (!item) return;
    if (!dialogBuku) siapkanDialog();

    const koleksi = ambilKoleksi();
    const sudahDibuka = koleksi.riwayat.includes(id);

    dialogBuku.innerHTML = `
        <div class="modal-isi">
            <button class="modal-tutup" type="button" data-tutup aria-label="Tutup">&times;</button>
            <div class="modal-sampul">${buatSampul(item)}</div>
            <div>
                <span class="tag">${item.genre}</span>
                <h2 id="judul-dialog">${item.judul}</h2>
                <p class="penulis">${item.penulis}</p>
                <p class="modal-teks">${item.ringkasan}</p>
                <div class="aksi">
                    <a class="btn" href="${tautanBaca(item)}" target="_blank" rel="noopener" data-baca="${id}">
                        ${sudahDibuka ? "Lanjut Membaca" : "Mulai Membaca"}
                    </a>
                    ${tombolAlih("favorit", id, koleksi.favorit.includes(id))}
                    ${tombolAlih("simpanan", id, koleksi.simpanan.includes(id))}
                </div>
                <p class="catatan">Tombol membaca membuka Open Library di tab baru.</p>
            </div>
        </div>`;

    dialogBuku.showModal();
}

function alihkanKoleksi(tombol) {
    const jenis = tombol.dataset.alih;
    const id = tombol.dataset.id;
    const koleksi = ambilKoleksi();

    koleksi[jenis] = alihkan(koleksi[jenis], id);
    simpanKoleksi(koleksi);

    const aktif = koleksi[jenis].includes(id);
    tombol.textContent = LABEL_ALIH[jenis][aktif ? 1 : 0];
    tombol.setAttribute("aria-pressed", aktif);
}

function catatBacaan(tautan) {
    catatRiwayat(tautan.dataset.baca);
    tautan.textContent = "Lanjut Membaca";
}

function alihkanArtikel(tombol) {
    const isiArtikel = tombol.previousElementSibling;
    isiArtikel.hidden = !isiArtikel.hidden;
    tombol.textContent = isiArtikel.hidden ? "Baca Selengkapnya" : "Tutup";
    tombol.setAttribute("aria-expanded", !isiArtikel.hidden);
}


/* ---------- 8. Halaman ---------- */

function jalankanBeranda() {
    const pilihan = (data, urutan) => urutan.map(i => buatKartu(data[i])).join("");

    isi("rak-buku", pilihan(DAFTAR_BUKU, [0, 2, 4, 6, 8]));
    isi("rak-novel", pilihan(DAFTAR_NOVEL, [0, 6, 10, 16, 19]));
    isi("genre-novel", buatChipGenre("novels.html", DAFTAR_NOVEL));
    isi("genre-buku", buatChipGenre("books.html", DAFTAR_BUKU));
    isi("daftar-artikel", ARTIKEL.slice(0, 2).map(buatArtikel).join(""));

    const info = document.getElementById("info-terakhir");

    function perbaruiTerakhir() {
        const terakhir = cariItem(ambilKoleksi().riwayat[0]);
        info.textContent = terakhir
            ? "Terakhir dibuka: " + terakhir.judul
            : "Belum ada bacaan yang dibuka.";
    }

    // Lanjut Membaca: buka bacaan terakhir, atau tawarkan pilihan jika belum ada riwayat.
    document.getElementById("tombol-lanjut").addEventListener("click", () => {
        const terakhir = cariItem(ambilKoleksi().riwayat[0]);
        if (terakhir) bukaDetail(terakhir.id);
        else document.getElementById("dialog-pilih").showModal();
    });

    segarkanHalaman = perbaruiTerakhir;
    perbaruiTerakhir();
}

function jalankanKatalog(data) {
    const rak = document.getElementById("rak");
    const daftarChip = document.getElementById("daftar-genre");
    const kolomCari = document.getElementById("cari");
    const pesan = document.getElementById("kosong");
    const info = document.getElementById("info-hasil");
    const semuaGenre = daftarGenre(data);

    // Tautan dari beranda dapat membawa genre pilihan, misalnya ?genre=Romansa,Drama
    const dariUrl = (new URLSearchParams(location.search).get("genre") || "")
        .split(",")
        .filter(genre => semuaGenre.includes(genre));

    let mode = dariUrl.length ? "genre" : "semua";
    let terpilih = dariUrl;
    let kata = "";

    daftarChip.innerHTML = semuaGenre.map(genre => {
        const jumlah = data.filter(item => item.genre === genre).length;
        return `<button class="chip" type="button" data-genre="${genre}" aria-pressed="false">${genre}<span>${jumlah}</span></button>`;
    }).join("");

    function tampilkan() {
        document.querySelectorAll("[data-mode]").forEach(tombol => {
            const aktif = tombol.dataset.mode === mode;
            tombol.classList.toggle("on", aktif);
            tombol.setAttribute("aria-pressed", aktif);
        });

        daftarChip.hidden = mode !== "genre";
        daftarChip.querySelectorAll("[data-genre]").forEach(chip => {
            const aktif = terpilih.includes(chip.dataset.genre);
            chip.classList.toggle("on", aktif);
            chip.setAttribute("aria-pressed", aktif);
        });

        const menungguPilihan = mode === "genre" && terpilih.length === 0;
        const hasil = menungguPilihan ? [] : data.filter(item => {
            const cocokGenre = mode === "semua" || terpilih.includes(item.genre);
            const cocokKata = (item.judul + " " + item.penulis).toLowerCase().includes(kata);
            return cocokGenre && cocokKata;
        });

        rak.innerHTML = hasil.map(item => buatKartu(item)).join("");
        info.textContent = menungguPilihan ? "" : `Menampilkan ${hasil.length} dari ${data.length} judul.`;

        pesan.hidden = menungguPilihan ? false : hasil.length > 0;
        pesan.textContent = menungguPilihan
            ? "Pilih satu atau beberapa genre di atas untuk menampilkan bacaan."
            : "Tidak ada bacaan yang cocok. Ubah kata kunci atau genre yang dipilih.";
    }

    document.querySelectorAll("[data-mode]").forEach(tombol => {
        tombol.addEventListener("click", () => {
            mode = tombol.dataset.mode;
            tampilkan();
        });
    });

    daftarChip.addEventListener("click", e => {
        const chip = e.target.closest("[data-genre]");
        if (!chip) return;

        const genre = chip.dataset.genre;
        terpilih = terpilih.includes(genre)
            ? terpilih.filter(g => g !== genre)
            : [...terpilih, genre];
        tampilkan();
    });

    kolomCari.addEventListener("input", () => {
        kata = kolomCari.value.trim().toLowerCase();
        tampilkan();
    });

    tampilkan();
}

function jalankanKoleksi() {
    const rak = document.getElementById("rak");
    const pesan = document.getElementById("kosong");
    const tombolHapus = document.getElementById("hapus-riwayat");
    let bagian = "favorit";

    isi("info-akun", akunAktif()
        ? "Koleksi ini tersimpan pada akun Anda di peramban ini."
        : 'Anda belum masuk, sehingga koleksi tersimpan sebagai tamu. <a href="login.html">Masuk atau daftar</a>.');

    function tampilkan() {
        const koleksi = ambilKoleksi();

        document.querySelectorAll("[data-bagian]").forEach(tombol => {
            const nama = tombol.dataset.bagian;
            tombol.classList.toggle("on", nama === bagian);
            tombol.setAttribute("aria-pressed", nama === bagian);
            tombol.querySelector(".jumlah").textContent = koleksi[nama].length;
        });

        const daftar = koleksi[bagian].map(cariItem).filter(Boolean);
        rak.innerHTML = daftar.map(item => buatKartu(item)).join("");
        pesan.textContent = PESAN_KOSONG[bagian];
        pesan.hidden = daftar.length > 0;
        tombolHapus.hidden = bagian !== "riwayat" || daftar.length === 0;
    }

    document.querySelectorAll("[data-bagian]").forEach(tombol => {
        tombol.addEventListener("click", () => {
            bagian = tombol.dataset.bagian;
            tampilkan();
        });
    });

    tombolHapus.addEventListener("click", () => {
        if (!confirm("Hapus seluruh riwayat bacaan?")) return;
        const koleksi = ambilKoleksi();
        koleksi.riwayat = [];
        simpanKoleksi(koleksi);
        tampilkan();
    });

    segarkanHalaman = tampilkan;
    tampilkan();
}

function jalankanArtikel() {
    isi("daftar-artikel", ARTIKEL.map(buatArtikel).join(""));
}


/* ---------- 9. Formulir ---------- */

const cekWajib = nilai => (nilai.trim() ? "" : "Kolom ini wajib diisi.");

const cekSurel = nilai => {
    if (!nilai.trim()) return "Kolom ini wajib diisi.";
    return /^\S+@\S+\.\S+$/.test(nilai.trim()) ? "" : "Format surel tidak valid.";
};

const cekUsername = nilai => {
    return /^[A-Za-z0-9_.]{4,}$/.test(nilai.trim())
        ? ""
        : "Gunakan minimal 4 karakter berupa huruf, angka, titik, atau garis bawah.";
};

const cekSandi = nilai => {
    if (!nilai) return "Kolom ini wajib diisi.";
    return nilai.length >= 8 ? "" : "Kata sandi minimal 8 karakter.";
};

const cekPesan = nilai => {
    return nilai.trim().length >= 10 ? "" : "Pesan minimal 10 karakter.";
};

function tampilkanGalat(form, galat) {
    form.querySelectorAll("[data-untuk]").forEach(el => {
        el.textContent = galat[el.dataset.untuk] || "";
    });
}

function tampilkanHasil(form, pesan, berhasil) {
    const el = form.querySelector(".hasil");
    el.hidden = false;
    el.className = "hasil " + (berhasil ? "ok" : "gagal");
    el.textContent = pesan;
}

// Memasang validasi pada formulir lalu menjalankan "aksi" bila seluruh isian benar.
function pasangForm(id, aturan, aksi) {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const nilai = Object.fromEntries(new FormData(form));
        const galat = {};

        for (const nama in aturan) {
            const pesan = aturan[nama](nilai[nama], nilai);
            if (pesan) galat[nama] = pesan;
        }

        tampilkanGalat(form, galat);
        if (Object.keys(galat).length > 0) {
            tampilkanHasil(form, "Periksa kembali isian yang ditandai.", false);
            return;
        }

        const hasil = await aksi(nilai);
        tampilkanHasil(form, hasil.pesan, hasil.ok);

        if (hasil.ok) form.reset();
        if (hasil.alihkan) {
            setTimeout(() => { location.href = hasil.alihkan; }, 900);
        }
    });
}

function aksiKontak(nilai) {
    const subjek = encodeURIComponent(nilai.subjek.trim());
    const isiPesan = encodeURIComponent(
        `Nama: ${nilai.nama.trim()}\nSurel: ${nilai.surel.trim()}\n\n${nilai.pesan.trim()}`
    );

    location.href = `mailto:${SUREL_PENGELOLA}?subject=${subjek}&body=${isiPesan}`;
    return { ok: true, pesan: "Aplikasi surel Anda akan terbuka dengan pesan yang sudah terisi. Silakan kirim dari sana." };
}

function jalankanLogin() {
    // Pengguna yang sudah masuk tidak perlu melihat halaman ini.
    if (akunAktif()) {
        location.replace("index.html");
        return;
    }

    const tombol = document.querySelectorAll("[data-form]");
    tombol.forEach(t => {
        t.addEventListener("click", () => {
            tombol.forEach(x => {
                x.classList.toggle("on", x === t);
                x.setAttribute("aria-pressed", x === t);
            });
            document.getElementById("form-login").hidden = t.dataset.form !== "login";
            document.getElementById("form-daftar").hidden = t.dataset.form !== "daftar";
        });
    });

    pasangForm("form-login", { akun: cekWajib, sandi: cekWajib }, aksiMasuk);
    pasangForm("form-daftar", {
        nama: cekWajib,
        surel: cekSurel,
        username: cekUsername,
        sandi: cekSandi,
        ulang: (nilai, semua) => (nilai === semua.sandi ? "" : "Konfirmasi kata sandi tidak sama.")
    }, aksiDaftar);
}

function jalankanKontak() {
    const tautan = document.getElementById("tautan-surel");
    tautan.href = "mailto:" + SUREL_PENGELOLA;
    tautan.textContent = SUREL_PENGELOLA;

    pasangForm("form-kontak", {
        nama: cekWajib,
        surel: cekSurel,
        subjek: cekWajib,
        pesan: cekPesan
    }, aksiKontak);
}


/* ---------- 10. Penanganan klik global ---------- */

// Setiap pasangan berisi selektor pemicu dan fungsi yang dijalankan.
const AKSI_KLIK = [
    ["[data-buka]", el => bukaDetail(el.dataset.buka)],
    ["[data-alih]", alihkanKoleksi],
    ["[data-baca]", catatBacaan],
    ["[data-tutup]", el => el.closest("dialog").close()],
    ["[data-dialog]", el => document.getElementById(el.dataset.dialog).showModal()],
    ["[data-artikel]", alihkanArtikel],
    ["[data-keluar]", keluarAkun]
];

document.addEventListener("click", e => {
    // Klik pada latar belakang dialog akan menutup dialog tersebut.
    if (e.target instanceof HTMLDialogElement) {
        e.target.close();
        return;
    }

    for (const [selektor, aksi] of AKSI_KLIK) {
        const pemicu = e.target.closest(selektor);
        if (pemicu) {
            aksi(pemicu);
            return;
        }
    }
});


/* ---------- 11. Eksekusi ---------- */

const HALAMAN = {
    index: jalankanBeranda,
    books: () => jalankanKatalog(DAFTAR_BUKU),
    novels: () => jalankanKatalog(DAFTAR_NOVEL),
    collection: jalankanKoleksi,
    news: jalankanArtikel,
    login: jalankanLogin,
    contact: jalankanKontak
};

renderKerangka();
if (HALAMAN[halaman]) HALAMAN[halaman]();
