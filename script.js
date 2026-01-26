const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebarMenu = document.getElementById('sidebar-menu');
const closeBtn = document.getElementById('close-btn');
const overlay = document.getElementById('overlay');

// Menüyü aç
hamburgerBtn.addEventListener('click', () => {
    sidebarMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('menu-open');  // Body'ye class ekle
});

// Menüyü kapat (X butonuna tıklayınca)
closeBtn.addEventListener('click', () => {
    closeMenu();
});

// Overlay'e tıklayınca kapat
overlay.addEventListener('click', () => {
    closeMenu();
});

// Menüyü kapatma fonksiyonu
function closeMenu() {
    sidebarMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}