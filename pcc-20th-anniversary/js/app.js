/* ==========================================================================
   PCC Public Site — app.js
   Memuat data/posts.json dan render ke galeri + cerita.
   ========================================================================== */

(function () {
  const POSTS_URL = 'data/posts.json';
  const galleryGrid = document.getElementById('galleryGrid');
  const storiesGrid = document.getElementById('storiesGrid');

  // Set tahun di footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // State
  let posts = [];

  // Fetch data
  async function loadPosts() {
    try {
      const res = await fetch(POSTS_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Gagal memuat data postingan');
      posts = await res.json();
      render();
    } catch (err) {
      console.error(err);
      // Tampilkan placeholder kosong yang ramah agar tidak error total
      if (galleryGrid) galleryGrid.innerHTML = emptyState('Belum ada foto. Silakan tambah melalui halaman Admin.');
      if (storiesGrid) storiesGrid.innerHTML = emptyState('Belum ada cerita. Silakan tambah melalui halaman Admin.');
    }
  }

  function emptyState(msg) {
    return `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#64748b;">${msg}</div>`;
  }

  // Format tanggal Indonesia
  function formatDateISO(iso) {
    if (!iso) return '-';
    const d = new Date(iso + 'T00:00:00');
    const opts = { day: 'numeric', month: 'long', year: 'numeric' };
    return d.toLocaleDateString('id-ID', opts);
  }

  function render() {
    renderGallery();
    renderStories();
  }

  function renderGallery() {
    if (!galleryGrid) return;
    if (posts.length === 0) {
      galleryGrid.innerHTML = emptyState('Belum ada foto di galeri.');
      return;
    }

    galleryGrid.innerHTML = posts.map((p, i) => {
      const img = p.image || 'assets/images/placeholder.svg';
      return `
        <article class="gallery-item" style="animation-delay: ${i * 0.08}s">
          <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy" />
          <div class="overlay">
            <div class="date">${formatDateISO(p.date)}</div>
            <div class="title">${escapeHtml(p.title)}</div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderStories() {
    if (!storiesGrid) return;
    if (posts.length === 0) {
      storiesGrid.innerHTML = emptyState('Belum ada cerita kegiatan.');
      return;
    }

    storiesGrid.innerHTML = posts.map((p, i) => {
      const img = p.image || 'assets/images/placeholder.svg';
      return `
        <article class="story-card" style="animation-delay: ${i * 0.08}s">
          <div class="story-img">
            <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy" />
          </div>
          <div class="story-body">
            <div class="story-meta">
              <span>${formatDateISO(p.date)}</span>
              <span>${p.tipe || 'Kegiatan'}</span>
            </div>
            <h3 class="story-title">${escapeHtml(p.title)}</h3>
            <p class="story-text">${escapeHtml(p.cerita || '')}</p>
            <a href="#" class="story-read">Baca selengkapnya →</a>
          </div>
        </article>
      `;
    }).join('');
  }

  // Escape HTML agar aman dari XSS sederhana saat menampilkan data JSON
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Inisialisasi
  document.addEventListener('DOMContentLoaded', loadPosts);
})();