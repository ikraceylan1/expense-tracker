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
// ========== SAYFA GEÇİŞLERİ ==========
const menuLinks = document.querySelectorAll('#sidebar-menu a');
const pages = document.querySelectorAll('.page');

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Hangi sayfaya gidileceğini al
        const targetPage = link.getAttribute('href').substring(1);
        
        // Tüm sayfaları gizle
        pages.forEach(page => page.classList.remove('active'));
        
        // Hedef sayfayı göster
        const targetElement = document.getElementById(targetPage);
        if (targetElement) {
            targetElement.classList.add('active');
        }
        
        // Menüyü kapat
        closeMenu();
    });
});

// ========== GELİR/GİDER BUTONLARI ==========
const gelirBtn = document.getElementById('gelir-btn');
const giderBtn = document.getElementById('gider-btn');
let transactionType = 'gelir'; // Varsayılan gelir

gelirBtn.addEventListener('click', () => {
    transactionType = 'gelir';
    gelirBtn.classList.add('active');
    giderBtn.classList.remove('active');
});

giderBtn.addEventListener('click', () => {
    transactionType = 'gider';
    giderBtn.classList.add('active');
    gelirBtn.classList.remove('active');
});

// ========== VERİ SAKLAMA ==========
let transactions = []; // Tüm işlemler burada

// ========== FORM GÖNDERİMİ ==========
const transactionForm = document.getElementById('transaction-form');

transactionForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle
    
    // Form verilerini al
    const aciklama = document.getElementById('aciklama').value;
    const miktar = parseFloat(document.getElementById('miktar').value);
    const kategori = document.getElementById('kategori').value;
    const tarih = document.getElementById('tarih').value;
    
    // Yeni işlem objesi oluştur
    const newTransaction = {
        id: Date.now(), // Benzersiz ID
        tip: transactionType,
        aciklama: aciklama,
        miktar: miktar,
        kategori: kategori,
        tarih: tarih
    };
    
    // Listeye ekle
    transactions.push(newTransaction);
    
    // Bakiyeleri güncelle
    updateBalance();
    
    // Formu temizle
    transactionForm.reset();
    
    // Başarı mesajı (opsiyonel)
    alert('✅ İşlem başarıyla eklendi!');
});

// ========== BAKİYE HESAPLAMA ==========
function updateBalance() {
    let totalGelir = 0;
    let totalGider = 0;
    
    transactions.forEach(transaction => {
        if (transaction.tip === 'gelir') {
            totalGelir += transaction.miktar;
        } else {
            totalGider += transaction.miktar;
        }
    });
    
    const bakiye = totalGelir - totalGider;
    
    // Ekrana yazdır
    document.getElementById('toplam-gelir').textContent = totalGelir.toFixed(2) + ' ₺';
    document.getElementById('toplam-gider').textContent = totalGider.toFixed(2) + ' ₺';
    document.getElementById('toplam-bakiye').textContent = bakiye.toFixed(2) + ' ₺';
    
    // Bakiye rengini değiştir (pozitif/negatif)
    const bakiyeElement = document.getElementById('toplam-bakiye');
    if (bakiye >= 0) {
        bakiyeElement.style.color = '#2aff5b';
    } else {
        bakiyeElement.style.color = '#ff6b6b';
    }
}

// ========== BUGÜNÜN TARİHİNİ OTOMATIK DOLDUR ==========
const tarihInput = document.getElementById('tarih');
const today = new Date().toISOString().split('T')[0];
tarihInput.value = today;