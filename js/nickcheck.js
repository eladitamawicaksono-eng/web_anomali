/* ============================================================================
   FILE INI: js/nickcheck.js
   ============================================================================
   Fungsi untuk mengecek apakah nickname yang diketik player itu BENAR-BENAR
   ada di Minecraft (Java) atau Xbox Live (Bedrock).

   PENJELASAN PENTING UNTUK PEMULA:
   ------------------------------------------------------------------------
   - Untuk JAVA: kita pakai API publik "playerdb.co". API ini menyimpan data
     akun Minecraft Java resmi (Mojang). Kalau nickname valid, kita dapat
     UUID + gambar skin (avatar) player tsb, lalu kita tampilkan di web.

   - Untuk BEDROCK: Minecraft Bedrock TIDAK punya sistem akun seperti Java,
     nickname Bedrock sebenarnya adalah "Gamertag Xbox Live" milik player.
     Server yang pakai plugin Geyser+Floodgate otomatis menambahkan titik
     "." di depan nickname Bedrock supaya tidak bentrok dengan nama Java.
     Contoh: kalau gamertag Xbox = "SteveGamer", maka di server & di web
     ini akan tampil sebagai ".SteveGamer".

     Kita mengecek keabsahan gamertag Xbox tsb memakai API publik GeyserMC
     (api.geysermc.org) yang mengubah gamertag menjadi XUID (ID Xbox).
     Kalau ditemukan -> nickname valid. Kalau tidak -> kemungkinan salah
     ketik atau gamertag tsb belum pernah main Minecraft Bedrock.

   Kalau suatu saat API publik ini down/berubah, kamu cukup ganti URL fetch
   di bawah ini tanpa perlu ubah bagian lain dari website.
   ============================================================================ */

const NickCheck = {

  /**
   * Cek nickname Java lewat playerdb.co
   * @param {string} username - nickname tanpa titik
   * @returns {Promise<{valid:boolean, uuid?:string, avatar?:string, error?:string}>}
   */
  async checkJava(username) {
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) {
      return { valid: false, error: "Format nickname Java tidak valid (3-16 karakter, huruf/angka/underscore)." };
    }
    try {
      const res = await fetch(`https://playerdb.co/api/player/minecraft/${encodeURIComponent(username)}`);
      const data = await res.json();
      if (data && data.code === "player.found") {
        return {
          valid: true,
          uuid: data.data.player.id,
          avatar: data.data.player.avatar
        };
      }
      return { valid: false, error: "Nickname tidak ditemukan di database Mojang." };
    } catch (e) {
      return { valid: false, error: "Gagal menghubungi server pengecekan. Coba lagi." };
    }
  },

  /**
   * Cek nickname Bedrock (gamertag Xbox) lewat api.geysermc.org
   * @param {string} gamertagWithDot - nickname termasuk titik di depan, contoh ".SteveGamer"
   * @returns {Promise<{valid:boolean, xuid?:string, error?:string}>}
   */
  async checkBedrock(gamertagWithDot) {
    if (!gamertagWithDot.startsWith(".")) {
      return { valid: false, error: 'Nickname Bedrock wajib diawali tanda titik "." (otomatis ditambahkan Floodgate).' };
    }
    const gamertag = gamertagWithDot.slice(1);
    if (!/^[A-Za-z0-9 ]{1,15}$/.test(gamertag)) {
      return { valid: false, error: "Format gamertag Xbox tidak valid." };
    }
    try {
      const res = await fetch(`https://api.geysermc.org/v2/xbox/xuid/${encodeURIComponent(gamertag)}`);
      if (!res.ok) {
        return { valid: false, error: "Gamertag tidak ditemukan di Xbox Live. Cek ejaan gamertag kamu." };
      }
      const data = await res.json();
      if (data && data.xuid) {
        return { valid: true, xuid: data.xuid };
      }
      return { valid: false, error: "Gamertag tidak ditemukan di Xbox Live." };
    } catch (e) {
      return { valid: false, error: "Gagal menghubungi server pengecekan. Coba lagi." };
    }
  }
};
