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
// SAYFA GEÇİŞLERİ 
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

// GELİR/GİDER BUTONLARI
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

// VERİ SAKLAMA 
let transactions = []; // Tüm işlemler burda

// FORM GÖNDERİMİ
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
        id: Date.now(), 
        tip: transactionType,
        aciklama: aciklama,
        miktar: miktar,
        kategori: kategori,
        tarih: tarih
    };
    
    // Listeye ekle
    transactions.push(newTransaction);
    
    saveTransactions(); 
    // Bakiyeleri güncelle
    updateBalance();
       displayTransactions(); 
    
    // Formu temizle
    transactionForm.reset();
     const today = new Date().toISOString().split('T')[0];
    tarihInput.value = today;
    // Başarı mesajı
    alert('✅ İşlem başarıyla eklendi!');
});

// BAKİYE HESAPLAMA 
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
    updateOverview();
}

// BUGÜNÜN TARİHİNİ OTOMATIK DOLDUR 
const tarihInput = document.getElementById('tarih');
const today = new Date().toISOString().split('T')[0];
tarihInput.value = today;
// İŞLEM GEÇMİŞİ 

const transactionList = document.getElementById('transaction-list');
const filterKategori = document.getElementById('filter-kategori');
const filterTip = document.getElementById('filter-tip');

// İşlemleri Listele
function displayTransactions() {
    // Filtreleri al
    const selectedKategori = filterKategori.value;
    const selectedTip = filterTip.value;
    
    // Filtrelenmiş işlemler
    let filteredTransactions = transactions;
    
    if (selectedKategori !== 'tumu') {
        filteredTransactions = filteredTransactions.filter(t => t.kategori === selectedKategori);
    }
    
    if (selectedTip !== 'tumu') {
        filteredTransactions = filteredTransactions.filter(t => t.tip === selectedTip);
    }
    
    // Liste boşsa
    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = '<p class="empty-message">Henüz işlem yok. Gelir veya gider ekleyin!</p>';
        return;
    }
    
    // İşlemleri sırala
    filteredTransactions.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
    
    // HTML oluşturduk
    transactionList.innerHTML = '';
    
    filteredTransactions.forEach(transaction => {
        const item = document.createElement('div');
        item.classList.add('transaction-item', transaction.tip);
        
        // Kategori emojisi
        const emojiMap = {
            'maaş': '💼',
            'yemek': '🍔',
            'ulaşım': '🚗',
            'alışveriş': '🛒',
            'eğlence': '🎮',
            'fatura': '📄',
            'diğer': '📦'
        };
        
        const emoji = emojiMap[transaction.kategori] || '📦';
        
        // Tarih formatla
        const tarih = new Date(transaction.tarih).toLocaleDateString('tr-TR');
        
        // İşaret (+ veya -)
        const sign = transaction.tip === 'gelir' ? '+' : '-';
        
        item.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-header">
                    <span class="transaction-category">${emoji}</span>
                    <span class="transaction-description">${transaction.aciklama}</span>
                </div>
                <div class="transaction-date">${tarih}</div>
            </div>
            <span class="transaction-amount ${transaction.tip}">${sign}${transaction.miktar.toFixed(2)} ₺</span>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">🗑️</button>
        `;
        
        transactionList.appendChild(item);
    });
}

// İşlem Sil
function deleteTransaction(id) {
    // Onay iste
    if (!confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
        return;
    }
    
    // Listeden çıkar
    transactions = transactions.filter(t => t.id !== id);
    
     saveTransactions();
    // Ekranı güncele
    displayTransactions();
    updateBalance();
}

filterKategori.addEventListener('change', displayTransactions);
filterTip.addEventListener('change', displayTransactions);

// BAKİYE/ÖZET SAYFASI 
// Özet sayfasını güncelle
function updateOverview() {
    // Genel bakiyeleri hesapla
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
    
    // Özet kartlarını güncelle
    document.getElementById('overview-bakiye').textContent = bakiye.toFixed(2) + ' ₺';
    document.getElementById('overview-gelir').textContent = totalGelir.toFixed(2) + ' ₺';
    document.getElementById('overview-gider').textContent = totalGider.toFixed(2) + ' ₺';
    
    // Bakiye rengini değiştir
    const bakiyeElement = document.getElementById('overview-bakiye');
    if (bakiye >= 0) {
        bakiyeElement.style.color = '#2aff5b';
    } else {
        bakiyeElement.style.color = '#ff6b6b';
    }
    
    // Kategori özetini güncelle
    updateCategorySummary();
    
    // Grafik güncelle
    updateChart();
}

// Kategori bazlı özet
function updateCategorySummary() {
    const categoryList = document.getElementById('category-list');
    
    // Sadece giderleri al
    const expenses = transactions.filter(t => t.tip === 'gider');
    
    if (expenses.length === 0) {
        categoryList.innerHTML = '<p class="empty-message">Henüz harcama yok.</p>';
        return;
    }
    

    const categoryTotals = {};
    
    expenses.forEach(expense => {
        if (!categoryTotals[expense.kategori]) {
            categoryTotals[expense.kategori] = 0;
        }
        categoryTotals[expense.kategori] += expense.miktar;
    });
    
    // Emoji haritası
    const emojiMap = {
        'maaş': '💼',
        'yemek': '🍔',
        'ulaşım': '🚗',
        'alışveriş': '🛒',
        'eğlence': '🎮',
        'fatura': '📄',
        'diğer': '📦'
    };
    
    
    categoryList.innerHTML = '';
    
   
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    sortedCategories.forEach(([kategori, total]) => {
        const item = document.createElement('div');
        item.classList.add('category-item');
        
        const emoji = emojiMap[kategori] || '📦';
        
        item.innerHTML = `
            <div class="category-name">
                <span>${emoji}</span>
                <span>${kategori.charAt(0).toUpperCase() + kategori.slice(1)}</span>
            </div>
            <span class="category-amount">${total.toFixed(2)} ₺</span>
        `;
        
        categoryList.appendChild(item);
    });
}
// GRAFİK

let expenseChart = null;

function updateChart() {
    const expenses = transactions.filter(t => t.tip === 'gider');
    
    if (expenses.length === 0) {
        if (expenseChart) {
            expenseChart.destroy();
            expenseChart = null;
        }
        return;
    }
    
    // Kategorilere göre topla
    const categoryTotals = {};
    
    expenses.forEach(expense => {
        if (!categoryTotals[expense.kategori]) {
            categoryTotals[expense.kategori] = 0;
        }
        categoryTotals[expense.kategori] += expense.miktar;
    });
    
    // Veri hazırla
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    // Renkler
    const colors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384'
    ];
    
    // Grafik varsa yok et
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    // Yeni grafik oluştur
    const ctx = document.getElementById('expense-chart').getContext('2d');
    
    expenseChart = new Chart(ctx, {
        type: 'doughnut', // Pasta grafik
        data: {
            labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}
// VERİ KAYDETME

// Sayfa yüklenince verileri yükle
window.addEventListener('DOMContentLoaded', () => {
    loadTransactions();
});

// LocalStorage'dan verileri yükle
function loadTransactions() {
    const saved = localStorage.getItem('transactions');
    if (saved) {
        transactions = JSON.parse(saved);
        updateBalance();
        displayTransactions();
        updateOverview();
    }
}

// LocalStorage'a kaydet
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}