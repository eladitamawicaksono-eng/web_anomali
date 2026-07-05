/* ============================================================================
   FILE INI: js/main.js
   ============================================================================
   Ini adalah "otak" website: yang mengatur form awal (platform+nickname),
   pindah halaman (Lobby/Rank/Credits/Staff), menampilkan kartu rank dari
   config.js, menghitung diskon & voucher, dan simulasi checkout.

   PEMULA: file ini boleh tidak disentuh sama sekali. Semua yang biasanya
   perlu diubah (harga, warna, nama server, dst) sudah ada di js/config.js.
   Baca komentar di setiap fungsi kalau kamu penasaran cara kerjanya.
   ============================================================================ */

/* State player yang sedang login (disimpan di memori selama tab dibuka) */
const AppState = {
  player: null,        // { nickname, platform, avatar, rawInput }
  activeVoucher: null,  // { code, percent }
  pendingRank: null     // rank yang sedang dibeli (untuk modal checkout)
};

/* --------------------------------------------------------------------------
   1. TERAPKAN WARNA DARI config.js KE CSS
   -------------------------------------------------------------------------- */
function applyTheme() {
  const root = document.documentElement.style;
  const t = CONFIG.THEME;
  root.setProperty('--bg', t.bgColor);
  root.setProperty('--bg-alt', t.bgColorAlt);
  root.setProperty('--orange', t.accentOrange);
  root.setProperty('--red', t.accentRed);
  root.setProperty('--gold', t.accentGold);
  root.setProperty('--text', t.textColor);
  root.setProperty('--text-muted', t.textMuted);
}

/* --------------------------------------------------------------------------
   2. ISI INFORMASI SERVER (logo, nama, dsb) KE SETIAP TEMPAT YANG BUTUH
   -------------------------------------------------------------------------- */
function applyServerInfo() {
  const s = CONFIG.SERVER_INFO;
  document.title = `${s.name} - Web Store`;
  document.querySelectorAll('.js-server-name').forEach(el => el.textContent = s.name);
  document.querySelectorAll('.js-server-tagline').forEach(el => el.textContent = s.tagline);
  document.querySelectorAll('.js-logo').forEach(el => el.src = s.logo);
  document.querySelectorAll('.js-domain').forEach(el => el.textContent = s.domain);
  document.querySelectorAll('.js-ip-java').forEach(el => el.textContent = s.ipJava);
  document.querySelectorAll('.js-ip-bedrock').forEach(el => el.textContent = `${s.ipBedrock}:${s.portBedrock}`);
  document.querySelectorAll('.js-discord-link').forEach(el => el.href = s.discordInvite);
}

/* --------------------------------------------------------------------------
   3. EMBER PARTIKEL DI HERO (efek visual ringan, sesuai tema api)
   -------------------------------------------------------------------------- */
function spawnEmbers() {
  const wrap = document.getElementById('emberWrap');
  if (!wrap) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const e = document.createElement('span');
    e.className = 'ember';
    e.style.left = Math.random() * 100 + '%';
    e.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    e.style.animationDuration = (5 + Math.random() * 6) + 's';
    e.style.animationDelay = (Math.random() * 8) + 's';
    e.style.opacity = 0.4 + Math.random() * 0.5;
    wrap.appendChild(e);
  }
}

/* --------------------------------------------------------------------------
   4. FORM GERBANG MASUK (pilih platform + isi nickname)
   -------------------------------------------------------------------------- */
function initGate() {
  const platformBtns = document.querySelectorAll('.platform-btn');
  const nickInput = document.getElementById('nickname');
  const nickPrefix = document.getElementById('nickPrefix');
  const statusEl = document.getElementById('nickStatus');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarImg = document.getElementById('avatarImg');
  const avatarLabel = document.getElementById('avatarLabel');
  const continueBtn = document.getElementById('continueBtn');

  let platform = 'java'; // default
  let verified = null;   // hasil terakhir dari NickCheck

  function setPlatform(p) {
    platform = p;
    platformBtns.forEach(b => b.classList.toggle('active', b.dataset.platform === p));
    const showDot = p === 'bedrock';
    nickPrefix.classList.toggle('show', showDot);
    nickInput.classList.toggle('has-prefix', showDot);
    nickInput.placeholder = showDot ? 'SteveGamer (tanpa titik, otomatis ditambahkan)' : 'Steve123';
    resetStatus();
  }

  function resetStatus() {
    verified = null;
    statusEl.textContent = '';
    statusEl.className = 'nick-status';
    avatarPreview.classList.remove('show');
    continueBtn.disabled = true;
  }

  platformBtns.forEach(btn => {
    btn.addEventListener('click', () => setPlatform(btn.dataset.platform));
  });

  let debounceTimer = null;
  nickInput.addEventListener('input', () => {
    resetStatus();
    clearTimeout(debounceTimer);
    const raw = nickInput.value.trim();
    if (!raw) return;
    debounceTimer = setTimeout(() => runCheck(raw), 550);
  });

  async function runCheck(raw) {
    statusEl.textContent = 'Mengecek nickname...';
    statusEl.className = 'nick-status info';
    let result, finalNick;

    if (platform === 'java') {
      finalNick = raw;
      result = await NickCheck.checkJava(finalNick);
    } else {
      finalNick = '.' + raw;
      result = await NickCheck.checkBedrock(finalNick);
    }

    if (result.valid) {
      verified = { nickname: finalNick, platform, avatar: result.avatar || null };
      statusEl.textContent = platform === 'java'
        ? `Ditemukan! UUID: ${result.uuid.slice(0, 8)}...`
        : `Gamertag Xbox valid.`;
      statusEl.className = 'nick-status ok';
      if (result.avatar) {
        avatarImg.src = result.avatar;
        avatarLabel.textContent = finalNick;
        avatarPreview.classList.add('show');
      } else {
        avatarLabel.textContent = `Bedrock: ${finalNick}`;
        avatarImg.src = CONFIG.SERVER_INFO.logo;
        avatarPreview.classList.add('show');
      }
      continueBtn.disabled = false;
    } else {
      verified = null;
      statusEl.textContent = result.error;
      statusEl.className = 'nick-status err';
      continueBtn.disabled = true;
    }
  }

  continueBtn.addEventListener('click', () => {
    if (!verified) return;
    AppState.player = verified;
    document.getElementById('gateScreen').style.display = 'none';
    renderPlayerChip();
  });

  setPlatform('java');
}

function renderPlayerChip() {
  const chip = document.getElementById('playerChip');
  if (!AppState.player) { chip.style.display = 'none'; return; }
  const p = AppState.player;
  chip.style.display = 'flex';
  chip.innerHTML = `
    <img src="${p.avatar || CONFIG.SERVER_INFO.logo}" alt="avatar">
    <span>${p.nickname}</span>
    <span class="platform-badge">${p.platform === 'java' ? 'JAVA' : 'BEDROCK'}</span>
  `;
}

/* --------------------------------------------------------------------------
   5. NAVIGASI ANTAR HALAMAN (Lobby / Rank / Credits / Staff)
   -------------------------------------------------------------------------- */
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
  document.getElementById('lobbyHero').style.display = pageId === 'lobby' ? 'block' : 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNav() {
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => goTo(el.dataset.goto));
  });
}

/* --------------------------------------------------------------------------
   6. HITUNG HARGA (harga asli - discount rank - voucher tambahan)
   -------------------------------------------------------------------------- */
function computeFinalPrice(rank) {
  let price = rank.price;
  if (rank.discount > 0) price = price * (1 - rank.discount / 100);
  if (AppState.activeVoucher) price = price * (1 - AppState.activeVoucher.percent / 100);
  return Math.round(price);
}

function formatCurrency(n) {
  return CONFIG.SERVER_INFO.currency + ' ' + n.toLocaleString('id-ID');
}

/* --------------------------------------------------------------------------
   7. RENDER KARTU RANK
   -------------------------------------------------------------------------- */
function renderRanks() {
  const grid = document.getElementById('rankGrid');
  grid.innerHTML = '';

  CONFIG.RANKS.forEach(rank => {
    const finalPrice = computeFinalPrice(rank);
    const hasDiscount = finalPrice < rank.price;
    const totalPercentOff = Math.round((1 - finalPrice / rank.price) * 100);

    const card = document.createElement('div');
    card.className = 'rank-card';
    card.style.borderColor = 'var(--border)';

    card.innerHTML = `
      <div class="flame-edge" style="background:${rank.color}"></div>
      <div class="card-top">
        <div class="rank-badge-row">
          <span class="rank-badge-emoji">${rank.badge}</span>
          ${hasDiscount ? `<span class="rank-discount-tag">-${totalPercentOff}%</span>` : ''}
        </div>
        <div class="rank-name" style="color:${rank.color}">${rank.name}</div>
        <div class="rank-price-row">
          ${hasDiscount ? `<span class="rank-price-old">${formatCurrency(rank.price)}</span>` : ''}
          <span class="rank-price-new">${formatCurrency(finalPrice)}</span>
        </div>
      </div>
      <ul class="rank-perks">
        ${rank.perks.map(p => `<li>${p}</li>`).join('')}
      </ul>
      <button class="rank-items-toggle" data-toggle="items-${rank.id}">▾ Lihat item bonus rank ini</button>
      <div class="rank-items-list" id="items-${rank.id}">
        ${rank.items.map(it => `<div class="item-row"><span>${it.icon} ${it.name}</span><span>x${it.qty}</span></div>`).join('')}
      </div>
      <div class="card-bottom">
        <button class="buy-btn" style="background:linear-gradient(90deg, ${rank.color}, var(--red))" data-buy="${rank.id}">Beli ${rank.name}</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = document.getElementById(btn.dataset.toggle);
      list.classList.toggle('show');
      btn.textContent = list.classList.contains('show')
        ? '▴ Sembunyikan item bonus'
        : '▾ Lihat item bonus rank ini';
    });
  });

  grid.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => openCheckout(btn.dataset.buy));
  });
}

/* --------------------------------------------------------------------------
   8. VOUCHER
   -------------------------------------------------------------------------- */
function initVoucher() {
  const input = document.getElementById('voucherInput');
  const btn = document.getElementById('voucherApply');
  const msg = document.getElementById('voucherMsg');

  btn.addEventListener('click', () => {
    const code = input.value.trim().toUpperCase();
    if (!code) return;
    const percent = CONFIG.VOUCHERS[code];
    if (percent) {
      AppState.activeVoucher = { code, percent };
      msg.textContent = `Voucher "${code}" berhasil dipakai! Diskon tambahan ${percent}% diterapkan ke semua rank.`;
      msg.className = 'voucher-msg ok';
      renderRanks();
    } else {
      AppState.activeVoucher = null;
      msg.textContent = 'Kode voucher tidak ditemukan / sudah tidak berlaku.';
      msg.className = 'voucher-msg err';
      renderRanks();
    }
  });
}

/* --------------------------------------------------------------------------
   9. CHECKOUT (simulasi - lihat TUTORIAL.md untuk sambungkan payment asli)
   -------------------------------------------------------------------------- */
function openCheckout(rankId) {
  if (!AppState.player) {
    alert('Sesi login tidak ditemukan, silakan refresh halaman dan isi ulang nickname.');
    return;
  }
  const rank = CONFIG.RANKS.find(r => r.id === rankId);
  AppState.pendingRank = rank;
  const finalPrice = computeFinalPrice(rank);

  document.getElementById('modalRankName').textContent = rank.name;
  document.getElementById('modalPlayer').textContent = `${AppState.player.nickname} (${AppState.player.platform === 'java' ? 'Java' : 'Bedrock'})`;
  document.getElementById('modalOriginal').textContent = formatCurrency(rank.price);
  document.getElementById('modalFinal').textContent = formatCurrency(finalPrice);

  document.getElementById('checkoutModal').classList.add('show');

  document.getElementById('payBtn').onclick = () => {
    const note = encodeURIComponent(
      `Pembelian rank ${rank.name} - Nickname: ${AppState.player.nickname} (${AppState.player.platform}) - Total: ${formatCurrency(finalPrice)}`
    );
    window.open(`${CONFIG.PAYMENT_LINK_BASE}?message=${note}`, '_blank');
  };
}

function initModal() {
  document.getElementById('modalCloseBtn').addEventListener('click', () => {
    document.getElementById('checkoutModal').classList.remove('show');
  });
  document.getElementById('checkoutModal').addEventListener('click', (e) => {
    if (e.target.id === 'checkoutModal') e.target.classList.remove('show');
  });
}

/* --------------------------------------------------------------------------
   10. RENDER STAFF & CREDITS
   -------------------------------------------------------------------------- */
function renderStaff() {
  const grid = document.getElementById('staffGrid');
  grid.innerHTML = CONFIG.STAFF.map(s => `
    <div class="staff-card">
      <img class="staff-avatar" src="https://mc-heads.net/avatar/${encodeURIComponent(s.name)}/100" alt="${s.name}">
      <div class="staff-name">${s.name}</div>
      <div class="staff-role" style="color:${s.color}">${s.role}</div>
    </div>
  `).join('');
}

function renderCredits() {
  const list = document.getElementById('creditsList');
  const totalRanks = CONFIG.RANKS.length;
  list.innerHTML = `
    <div class="credit-item"><span>Server</span><strong class="js-server-name"></strong></div>
    <div class="credit-item"><span>Total kategori rank tersedia</span><strong>${totalRanks}</strong></div>
    <div class="credit-item"><span>Platform didukung</span><strong>Java & Bedrock</strong></div>
    <div class="credit-item"><span>Desain & pengembangan webstore</span><strong>Tim ${CONFIG.SERVER_INFO.name}</strong></div>
  `;
  list.querySelector('.js-server-name').textContent = CONFIG.SERVER_INFO.name;
}

/* --------------------------------------------------------------------------
   INISIALISASI
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyServerInfo();
  spawnEmbers();
  initGate();
  initNav();
  renderRanks();
  initVoucher();
  initModal();
  renderStaff();
  renderCredits();
  goTo('lobby');
});
