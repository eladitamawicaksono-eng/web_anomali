/* ============================================================================
   FILE INI: js/config.js
   ============================================================================
   INI ADALAH "PUSAT KONTROL" WEBSTORE KAMU.
   Semua hal yang biasanya ingin kamu ubah (nama server, harga rank, diskon,
   warna, link Discord, dll) ada di SATU file ini. Kamu TIDAK perlu menyentuh
   file HTML/CSS/JS lain untuk hal-hal dasar.

   CARA PAKAI:
   1. Cari bagian yang mau diubah (misalnya SERVER_INFO atau RANKS).
   2. Ubah nilainya di antara tanda kutip ' ' atau angka.
   3. Simpan file, refresh browser -> perubahan langsung muncul.
   4. JANGAN hapus tanda koma (,) atau kurung kurawal { } kecuali kamu tahu
      apa yang kamu lakukan, nanti website bisa error.
   ============================================================================ */

const CONFIG = {

  /* --------------------------------------------------------------------
     1. INFORMASI SERVER
     Ubah nama, deskripsi, dan link sosial media server kamu di sini.
  -------------------------------------------------------------------- */
  SERVER_INFO: {
    name: "VelmoraSMP",
    tagline: "Lifesteal SMP - Java & Bedrock",
    domain: "velmorasmp.fun",
    logo: "assets/logo.png",           // path ke logo kamu (sudah otomatis pakai logo yang kamu kirim)
    discordInvite: "https://discord.gg/n7zkufWQFD",
    ipJava: "velmorasmp.fun",
    ipBedrock: "velmorasmp.fun",
    portBedrock: "12019",
    currency: "Rp",                    // simbol mata uang, ganti ke "$" kalau mau pakai USD
  },

  /* --------------------------------------------------------------------
     2. WARNA & TEMA
     Ganti kode warna (format HEX, contoh: #ff5500) untuk mengubah tampilan.
     Tidak perlu paham desain, cukup ganti kode warnanya saja.
  -------------------------------------------------------------------- */
  THEME: {
    bgColor: "#0c0a09",        // warna latar belakang utama (gelap)
    bgColorAlt: "#161210",     // warna latar belakang kartu/section
    accentOrange: "#f97316",   // oranye api (warna utama, diambil dari logo)
    accentRed: "#dc2626",      // merah api
    accentGold: "#facc15",     // emas, dipakai untuk rank termahal
    textColor: "#f5f1ea",      // warna teks utama
    textMuted: "#a89f94",      // warna teks abu-abu/kurang penting
  },

  /* --------------------------------------------------------------------
     3. 10 KATEGORI RANK
     ------------------------------------------------------------------
     Setiap rank punya:
       id          -> kode unik (JANGAN ada spasi, huruf kecil semua)
       name        -> nama rank yang tampil di web
       price       -> harga asli (angka saja, tanpa titik/koma)
       discount    -> persen diskon (0 = tidak ada diskon). Contoh: 20 = diskon 20%
       color       -> warna khas rank ini (hex code)
       badge       -> emoji/simbol kecil yang tampil di kartu rank
       perks       -> daftar keuntungan/perk rank (teks bebas, tambah/kurangi sesukamu)
       items       -> "barang" bonus yang didapat player (nama + qty + icon emoji)
     ------------------------------------------------------------------
     CARA MENAMBAH RANK BARU:
       - Salin (copy) satu blok { ... } di bawah, tempel (paste) sebelum tanda ']'
         di akhir array, lalu ubah id, name, price, dst.
     CARA MENGHAPUS RANK:
       - Hapus satu blok { ... } beserta koma setelahnya.
     CARA MEMBUAT DISKON:
       - Ubah angka "discount" contoh dari 0 menjadi 25 (artinya diskon 25%).
       - Harga yang dicoret otomatis muncul di web, tidak perlu hitung manual.
  -------------------------------------------------------------------- */
  RANKS: [
    {
      id: "Adventurere",
      name: "Adventurer",
      price: 10000,
      discount: 50,
      color: "#fbbf24",
      badge: "🔥",
      perks: [
        "claim reward /otr adventurer"
        "Kit Adventurer (1x) saat pertama join",
        "Tag [Adventurer] di chat & tab list",
        "Akses /kit Adventurer setiap 24 jam",
        "3 Homes (/sethome)"
      ],
      items: [
        { name: "Golden Apple", qty: 4, icon: "🍎" },
        { name: "Cooked Beef", qty: 32, icon: "🥩" },
        { name: "Torch Bundle", qty: 16, icon: "🔦" }
      ]
    },
    {
      id: "Elite",
      name: "Elite",
      price: 14000,
      discount: 30,
      color: "#fb923c",
      badge: "🔥",
      perks: [
        "claim reward /otr elite"
        "Kit elite (1x) saat pertama join",
        "Tag [Elite] di chat & tab list",
        "Akses /kit elite setiap 24 jam",
        "5x Homes (/sethome)"
      ],
      items: [
        { name: "Iron Ingot", qty: 16, icon: "⛓️" },
        { name: "Enchanted Book (Sharpness I)", qty: 1, icon: "📖" },
        { name: "Ender Pearl", qty: 4, icon: "🔮" }
      ]
    },
    {
      id: "Champion",
      name: "Champion",
      price: 25000,
      discount: 20,
      color: "#f97316",
      badge: "⚡",
      perks: [
        "Semua perk Cinder",
        "Tag [Blaze] + warna chat custom",
        "4 Homes (/sethome)",
        "Akses /fly di area spawn",
        "Akses /kit blaze setiap 18 jam"
      ],
      items: [
        { name: "Diamond", qty: 8, icon: "💎" },
        { name: "Golden Apple", qty: 8, icon: "🍎" },
        { name: "Shield", qty: 1, icon: "🛡️" }
      ]
    },
    {
      id: "Emperor",
      name: "Emperor",
      price: 54000,
      discount: 35,
      color: "#ea580c",
      badge: "🌋",
      perks: [
        "Semua perk Blaze",
        "5 Homes (/sethome)",
        "Akses /kit wildfire setiap 16 jam",
        "Prefix kapital di leaderboard kill",
        "Slot antrian prioritas saat server penuh"
      ],
      items: [
        { name: "Netherite Scrap", qty: 4, icon: "🪨" },
        { name: "Elytra", qty: 1, icon: "🦇" },
        { name: "Totem of Undying", qty: 1, icon: "🗿" }
      ]
    },
    {
      id: "Mystic",
      name: "Mystic",
      price: 85000,
      discount: 35,
      color: "#dc2626",
      badge: "💀",
      perks: [
        "Semua perk Wildfire",
        "6 Homes (/sethome)",
        "Akses /kit infernal setiap 12 jam",
        "Custom join message di chat server",
        "Akses ke /workbench & /enderchest instan"
      ],
      items: [
        { name: "Netherite Ingot", qty: 2, icon: "🔥" },
        { name: "Enchanted Golden Apple", qty: 2, icon: "✨" },
        { name: "Trident", qty: 1, icon: "🔱" }
      ]
    },
    {
      id: "Sentinel",
      name: "Sentinel",
      price: 250000,
      discount: 52,
      color: "#7c3aed",
      badge: "🪨",
      perks: [
        "Semua perk Infernal",
        "8 Homes (/sethome)",
        "Akses /kit obsidian setiap 10 jam",
        "Partikel efek di sekitar karakter",
        "Prioritas review tiket bantuan staff"
      ],
      items: [
        { name: "Netherite Full Armor Set", qty: 1, icon: "🛡️" },
        { name: "Diamond Block", qty: 4, icon: "💎" },
        { name: "Shulker Box", qty: 2, icon: "📦" }
      ]
    },
    {
      id: "voidwalker",
      name: "Voidwalker",
      price: 350000,
      discount: 20,
      color: "#6366f1",
      badge: "🌌",
      perks: [
        "Semua perk Obsidian",
        "10 Homes (/sethome)",
        "Akses /kit voidwalker setiap 8 jam",
        "Warna nama custom (pilih 1 warna)",
        "Akses channel Discord khusus donatur"
      ],
      items: [
        { name: "Netherite Ingot", qty: 5, icon: "🔥" },
        { name: "Elytra + Firework Bundle", qty: 1, icon: "🎆" },
        { name: "Enchanted Book (Protection IV)", qty: 2, icon: "📖" }
      ]
    },
    {
      id: "dragonlord",
      name: "Dragonlord",
      price: 200000,
      discount: 0,
      color: "#16a34a",
      badge: "🐉",
      perks: [
        "Semua perk Voidwalker",
        "12 Homes (/sethome)",
        "Akses /kit dragonlord setiap 6 jam",
        "Efek partikel naga saat berjalan",
        "1x request custom kit bulanan (via tiket)"
      ],
      items: [
        { name: "Dragon Egg (replica/kit)", qty: 1, icon: "🥚" },
        { name: "Netherite Full Kit", qty: 1, icon: "⚔️" },
        { name: "Elytra Enchanted", qty: 1, icon: "🦇" }
      ]
    },
    {
      id: "celestial",
      name: "Celestial",
      price: 300000,
      discount: 25,
      color: "#0ea5e9",
      badge: "🌠",
      perks: [
        "Semua perk Dragonlord",
        "15 Homes (/sethome)",
        "Akses /kit celestial setiap 4 jam",
        "Tag animasi warna-warni (gradient)",
        "Slot prioritas tertinggi antrian server"
      ],
      items: [
        { name: "Full Netherite Set (Enchanted Max)", qty: 1, icon: "⚔️" },
        { name: "Beacon", qty: 1, icon: "🔆" },
        { name: "Shulker Box (isi diamond)", qty: 4, icon: "📦" }
      ]
    },
    {
      id: "phoenix",
      name: "Phoenix",
      price: 500000,
      discount: 0,
      color: "#facc15",
      badge: "👑",
      perks: [
        "Rank tertinggi - Semua perk Celestial",
        "Unlimited Homes (/sethome)",
        "Akses /kit phoenix setiap 2 jam",
        "Tag [PHOENIX] emas berkilau + efek sayap api",
        "Akses penuh channel VIP Discord & voice khusus",
        "Nama diabadikan di papan Hall of Fame spawn"
      ],
      items: [
        { name: "Full Netherite God Set", qty: 1, icon: "👑" },
        { name: "Elytra Legendary Enchanted", qty: 1, icon: "🪽" },
        { name: "Diamond Block", qty: 16, icon: "💎" },
        { name: "Custom Nametag Item", qty: 1, icon: "🏷️" }
      ]
    }
  ],

  /* --------------------------------------------------------------------
     4. KODE VOUCHER / DISKON TAMBAHAN (opsional)
     Ini terpisah dari "discount" per rank di atas. Kode voucher ini bisa
     dimasukkan manual oleh player di halaman rank (misalnya untuk event).
     Format: kode (huruf besar/kecil tidak masalah) -> persen diskon.
  -------------------------------------------------------------------- */
  VOUCHERS: {
    "VELMORA10": 10,
    "LIFESTEAL20": 20,
    "MERDEKA45": 45
  },

  /* --------------------------------------------------------------------
     5. STAFF SERVER (untuk lobby "Staff Server")
     Tambah/kurangi anggota staff di sini untuk ditampilkan di halaman Staff.
  -------------------------------------------------------------------- */
  STAFF: [
    { name: "itzjund", role: "Owner", color: "#facc15" },
    { name: ".Levzaym", role: "Supervisor", color: "#ff4e00" },
    { name: ".Debjeev1", role: "Admin", color: "#9c1f1f" },
    { name: "Fizhh_", role: "Admin", color: "#9c1f1f" },
    { name: ".Hapadanum_19999", role: "Moderator", color: "#38bdf8" },
    { name: "GRrySkysss", role: "Moderator", color: "#38bdf8" },
    { name: "ItsDapp", role: "Anomali", color: "#795bce" },
  ],

  /* --------------------------------------------------------------------
     6. LINK PEMBAYARAN (WAJIB DIISI SEBELUM DIPAKAI SUNGGUHAN)
     Website ini secara default hanya SIMULASI checkout (belum menerima
     pembayaran asli). Baca TUTORIAL.md bagian "Menghubungkan Pembayaran
     Asli" untuk cara menyambungkan ke Tripay/Midtrans/Saweria/Trakteer.
  -------------------------------------------------------------------- */
  PAYMENT_LINK_BASE: "https://sociabuzz.com/velmorasmp_store/donate"

};
