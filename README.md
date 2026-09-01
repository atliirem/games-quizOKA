# OKA Word Duel — Quiz Arena

OKA Word Duel, çocukların İngilizce renkleri görsel ve sesli sorularla pekiştirmesi için hazırlanmış tarayıcı tabanlı bir mini quiz oyunudur. Oyuncu, dünyanın farklı ülkelerinden rastgele seçilen bir rakiple eşleşir ve 10 soruluk zamanlı bir düelloya katılır.

## Özellikler

- 10 ülkeden toplam 30 farklı rakip karakter
- Bayrak, ülke ve karakter bilgileriyle animasyonlu rakip eşleştirme ekranı
- Her oyunda karışık sırayla sunulan 10 soru
- Görsele bakıp doğru renk kelimesini seçme soruları
- Rengi dinleyip eşleşen görseli bulma soruları
- Görsele karşılık gelen ses kartını seçme soruları
- Her soru için 10 saniyelik geri sayım
- Doğru cevap serisi, anlık skor ve liderlik farkı takibi
- Oyuncu ile rakibin ilerlemesini gösteren animasyonlu yarış alanı
- Ses dosyaları, geri bildirim sesleri ve tarayıcı konuşma sentezi desteği
- Ses açma/kapatma kontrolü
- Klavyedeki `1`, `2` ve `3` tuşlarıyla cevap verme desteği
- Doğru cevaplarda puan animasyonları ve konfeti efekti
- Maç sonunda rövanş veya yeni rakip bulma seçenekleri
- Mobil ve masaüstü ekranlara uyumlu arayüz

## Oynanış

1. Eşleştirme animasyonunun tamamlanmasını bekleyin.
2. **Start the Duel** düğmesine basın.
3. `3, 2, 1, GO!` geri sayımından sonra soruyu okuyun veya ses kaydını dinleyin.
4. Süre dolmadan doğru seçeneği işaretleyin. Cevabı fare/dokunmatik ekranla ya da `1`, `2`, `3` tuşlarıyla verebilirsiniz.
5. On turun sonunda en yüksek puanı alan taraf düelloyu kazanır.

Bir seçenek işaretlendikten sonra rakip de cevabını verir ve turun sonucu gösterilir. Dinleme sorularında ana ses tekrar oynatılabilir; ses kartı sorularında her kart ayrı ayrı dinlenebilir.

## Puanlama

- Yalnızca oyuncu doğru cevap verirse oyuncu **300 puan** kazanır.
- Oyuncu ve rakip aynı anda doğru cevap verirse ikisi de **100 puan** kazanır.
- Oyuncu yanlış cevap verdiğinde veya süre dolduğunda rakip **300 puan** kazanır.

Rakibin doğru cevap verme davranışı oyun tarafından otomatik olarak belirlenir. Oyuncu yanlış cevap verdiğinde rakip doğru cevap verir; oyuncu doğru cevap verdiğinde rakibin de doğru cevap verme olasılığı vardır.

## Yerel Olarak Çalıştırma

Proje yalnızca HTML, CSS ve Vanilla JavaScript kullanır. Paket kurulumu veya derleme adımı gerektirmez.

Proje klasöründe bir yerel HTTP sunucusu başlatın:

```bash
python3 -m http.server 8081
```

Ardından tarayıcıda [http://localhost:8081](http://localhost:8081) adresini açın.

`8081` portu kullanımdaysa başka bir port seçebilirsiniz:

```bash
python3 -m http.server 9000
```

Ses dosyalarının ve diğer varlıkların sorunsuz yüklenmesi için projeyi `index.html` dosyasına çift tıklamak yerine yerel bir HTTP sunucusu üzerinden çalıştırmanız önerilir.

## Proje Yapısı

```text
.
├── index.html                      # Sayfa yapısı, oyun alanı ve diyaloglar
├── style.css                       # Responsive tasarım ve animasyonlar
├── game.js                         # Sorular, rakipler, zamanlayıcı ve oyun mantığı
└── assets/
    ├── oika-logo.png               # OKA logosu
    ├── student-avatar.png          # Oyuncu avatarı
    ├── rivals/square/              # Ülkelere göre rakip portreleri
    └── color-hunt/
        ├── images/                 # Renk ve sahne görselleri
        └── audio/                  # Kelime ve cümle ses kayıtları
```

## İçerik ve Özelleştirme

- Yeni soru eklemek veya mevcut soruları değiştirmek için `game.js` içindeki `QUESTIONS` dizisini düzenleyin.
- Ülke listesini değiştirmek için `COUNTRIES`, rakip adlarını ve portrelerini değiştirmek için `FIXED_CHARACTERS` yapılarını güncelleyin.
- Tur süresi `startTimer()` içindeki `state.duration` değeriyle belirlenir.
- Rakibin başarı olasılığı `rivalKnowsAnswer()` fonksiyonundan değiştirilebilir.
- Puan kuralları `calculatePoints()` fonksiyonunda bulunur.
- Renkler, kartlar, responsive düzen ve animasyonlar `style.css` üzerinden özelleştirilebilir.

Yeni rakip görsellerini `assets/rivals/square/` klasörüne ekleyin. Bir rakip görseli yüklenemezse arayüz otomatik olarak ülke bayrağını içeren bir yedek avatar gösterir.

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- HTML Dialog API
- Web Audio API
- Speech Synthesis API

## Tarayıcı Uyumluluğu

Güncel Chrome, Edge, Firefox ve Safari sürümleri önerilir. Bazı tarayıcılar otomatik ses oynatmayı kullanıcı etkileşimine kadar engelleyebilir; bu durumda oyunu başlattıktan sonra dinleme düğmesine basın.
