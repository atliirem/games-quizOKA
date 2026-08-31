# Kelime Düellosu — Quiz Arena

Çocukların İngilizce renkleri görsel ve sesli sorularla pekiştirmesini amaçlayan, tarayıcı tabanlı mini bir quiz oyunudur. Oyuncu; Gigi, Mimi veya Bobo karakterlerinden biriyle eşleşir ve 10 soruluk zamanlı bir düelloda yarışır.

## Özellikler

- Rastgele rakip eşleştirme ekranı
- Görsel seçme, sesi dinleyip görsel bulma ve ses kartı eşleştirme soruları
- Her soru için geri sayım sayacı
- Doğru cevap serisi ve anlık skor takibi
- Oyuncu ile rakibin ilerlemesini gösteren animasyonlu yarış alanı
- Ses açma ve kapatma seçeneği
- Klavyedeki `1`, `2` ve `3` tuşlarıyla cevap verme desteği
- Maç sonunda yeniden oynama veya yeni rakip bulma seçenekleri
- Mobil ve masaüstü ekranlara uyumlu arayüz

## Oynanış

1. Eşleştirme tamamlandıktan sonra **Start the Duel** düğmesine basın.
2. Soruyu okuyun veya ses kaydını dinleyin.
3. Süre dolmadan doğru seçeneği işaretleyin.
4. On turun sonunda en yüksek puana ulaşarak düelloyu kazanın.

Puanlama sistemi:

- Yalnızca oyuncu doğru cevap verirse **300 puan** kazanır.
- Oyuncu ve rakip aynı anda doğru cevap verirse ikisi de **100 puan** kazanır.
- Oyuncu yanlış cevap verdiğinde veya süre dolduğunda rakip **300 puan** kazanır.

## Yerel Olarak Çalıştırma

Proje yalnızca HTML, CSS ve JavaScript kullanır; kurulum veya derleme adımı gerektirmez.

`index.html` dosyasını doğrudan tarayıcıda açabilir ya da proje klasöründe basit bir yerel sunucu başlatabilirsiniz:

```bash
python3 -m http.server 8000
```

Ardından tarayıcınızda [http://localhost:8000](http://localhost:8000) adresini açın.

## Proje Yapısı

```text
.
├── index.html          # Sayfa yapısı ve oyun pencereleri
├── style.css           # Tasarım, responsive düzen ve animasyonlar
├── game.js             # Sorular, oyun durumu, puanlama ve düello mantığı
└── assets/             # Karakterler, görseller ve ses dosyaları
```

## Özelleştirme

- Yeni soru eklemek veya mevcut soruları değiştirmek için `game.js` içindeki `QUESTIONS` dizisini düzenleyin.
- Rakip karakterleri değiştirmek için `OPPONENTS` dizisini güncelleyin.
- Tur süresi ve oyun davranışı `game.js` içindeki durum ve zamanlayıcı ayarlarından değiştirilebilir.
- Renkler, yazı tipleri, kartlar ve animasyonlar `style.css` üzerinden özelleştirilebilir.

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- Web Audio API ve Speech Synthesis API
