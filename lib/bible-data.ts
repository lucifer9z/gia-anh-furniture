// ==================== BIBLE DATA — GIA ANH FURNITURE ====================
// Nội thất ngoài trời — Bàn ghế outdoor — B2C (Shopee / FB / TikTok)

export interface BibleFile {
  title: string;
  content: string;
}

export interface BibleModule {
  name: string;
  desc: string;
  icon: string;
  files: Record<string, BibleFile>;
}

export const BIBLE_MODULES: Record<string, BibleModule> = {
  '01-RESEARCH': {
    name: 'Research', desc: 'Scan đối thủ, trend nội thất outdoor', icon: '🔍',
    files: {
      'bible': { title: 'Bible — Research Nội Thất Outdoor', content: `# 01-RESEARCH — Nghiên Cứu Thị Trường Nội Thất Outdoor

> **Lưu ý**: AI KHÔNG thể tự search Shopee/TikTok. Anh cần tự thu thập data rồi paste vào prompt để AI phân tích.

## QUY TRÌNH RESEARCH THỰC TẾ

### Bước 1: THU THẬP (anh tự làm, 20 phút)

**Shopee** — Search "bàn ghế sân vườn", "bàn ghế ngoài trời", sort theo "Bán chạy":
- Screenshot top 5 sản phẩm (tên, giá, lượt bán, rating)
- Mở 2-3 shop → note: giá, chất liệu, ảnh thực tế
- Đọc 10 review 1-3 sao → note: khách chê gì (ship hỏng, chất liệu kém, lắp khó...)

**TikTok** — Search "bàn ghế ngoài trời", "decor sân vườn":
- Scroll 10 video → note: views, hook, kiểu quay
- Save 3 video nhiều views nhất

**Facebook** — Vào facebook.com/ads/library, tìm "bàn ghế outdoor":
- Screenshot 5 ads đang chạy
- Note: headline, hình/video, offer, chất liệu quảng cáo

### Bước 2: PASTE VÀO AI ĐỂ PHÂN TÍCH

Dùng prompt "Phân tích đối thủ" hoặc "Phân tích review" bên dưới.

### Bước 3: RA ACTION

AI sẽ cho 3 action cụ thể → ghi vào Tasks hôm nay.` },
      'ai-competitor': { title: 'Prompt: Phân tích đối thủ', content: `# PHÂN TÍCH ĐỐI THỦ NGOÀI TRỜI

\`\`\`
Bạn là chuyên gia e-commerce nội thất outdoor VN.

Tôi đã thu thập data 5 đối thủ bán bàn ghế ngoài trời trên [Shopee/FB/TikTok]:

[PASTE DATA Ở ĐÂY — VD:]
Shop A: Bộ bàn ghế mây nhựa 4 ghế 2.890K, 350 lượt bán, rating 4.7, "freeship lắp đặt"
Shop B: Bàn ghế gỗ keo ngoài trời 1.990K, 820 lượt bán, rating 4.5, "bảo hành 2 năm"
Shop C: Bàn ghế nhôm đúc 4.500K, 120 lượt bán, rating 4.9, "chống gỉ 10 năm"
Shop D: Bộ sofa mây nhựa góc L 5.890K, 65 lượt bán, rating 4.8, "tặng nệm outdoor"
Shop E: Ghế xếp ngoài trời 890K, 1.2K lượt bán, rating 4.3, "giá rẻ nhất"

Shop tôi: Bộ bàn ghế mây nhựa 2.590K, 50 lượt bán, chưa có rating

Phân tích:
1. AI BÁN CHẠY NHẤT? Tại sao? (giá, chất liệu, offer?)
2. RANGE GIÁ nào đang thắng theo từng phân khúc?
3. CHẤT LIỆU nào được ưa chuộng nhất?
4. SHOP TÔI thiếu gì so với top?
5. 3 ACTION cụ thể tôi cần làm NGAY?
\`\`\`` },
      'ai-review': { title: 'Prompt: Đọc review khách', content: `# PHÂN TÍCH REVIEW — Nội Thất Outdoor

\`\`\`
Bạn là product analyst cho shop nội thất ngoài trời.

Dưới đây là 15 review 1-3 sao từ khách mua bàn ghế outdoor của đối thủ [TÊN SHOP]:

[PASTE REVIEW Ở ĐÂY — VD:]
⭐ 1 - "Ship gãy chân ghế, đóng gói sơ sài"
⭐ 2 - "Mây nhựa bong tróc sau 3 tháng ngoài trời"
⭐ 1 - "Lắp ráp cực khó, không có hướng dẫn"
⭐ 3 - "Bàn đẹp nhưng ghế ngồi cứng, không có nệm"
⭐ 2 - "Gỗ bị mối sau 6 tháng, không chịu nước"
⭐ 1 - "Giao hàng 15 ngày, shop không hỗ trợ"
⭐ 3 - "Kích thước nhỏ hơn hình, ban công hẹp vừa nhưng sân thì bé"
⭐ 2 - "Ốc vít thiếu, phải tự mua thêm"

Phân tích:
1. TOP 3 VẤN ĐỀ khách chê nhiều nhất?
2. Mỗi vấn đề: SHOP TÔI có thể TRÁNH bằng cách nào?
3. Đâu là CƠ HỘI để tôi làm TỐT HƠN đối thủ?
4. Viết 3 USP cho shop tôi dựa trên điểm yếu đối thủ.
5. Gợi ý 3 cam kết có thể dùng trong AD: "Cam kết không gãy khi ship" / "Bảo hành 3 năm"...
\`\`\`` },
      'ai-trend': { title: 'Prompt: Trend Outdoor', content: `# PHÂN TÍCH TREND — Nội Thất Ngoài Trời

\`\`\`
Bạn là trend analyst cho ngành nội thất outdoor VN.

Tôi đã note 8 video TikTok hot nhất tuần này về nội thất sân vườn:

[PASTE Ở ĐÂY — VD:]
1. 1.8M views - "Biến ban công 4m² thành quán cafe" - before/after, chill music
2. 750K views - "Unbox bộ bàn ghế outdoor 2 triệu - có xứng đáng?" - unbox, honest review
3. 520K views - "Setup sân vườn cho Tết chỉ 5 triệu" - tutorial, step by step
4. 430K views - "So sánh ghế mây nhựa vs gỗ keo - cái nào bền hơn?" - so sánh
5. 380K views - "Tour sân vườn nhà 200m² decor tự làm" - tour, aesthetic

Phân tích:
1. TOP 3 KIỂU VIDEO đang viral?
2. HOOK phổ biến nhất?
3. Video nào SHOP TÔI có thể LÀM NGAY?
4. Viết 5 ý tưởng video cho shop bàn ghế outdoor, bắt chước style đang viral.
\`\`\`` }
    }
  },
  '02-SOURCING': {
    name: 'Sourcing', desc: 'Chọn NCC, chất liệu, tính biên', icon: '🏭',
    files: {
      'bible': { title: 'Bible — Nguồn Hàng Outdoor', content: `# 02-SOURCING — Nguồn Hàng Nội Thất Ngoài Trời

## CHẤT LIỆU PHỔ BIẾN

| Chất liệu | Ưu điểm | Nhược điểm | Giá nhập ước tính |
|-----------|---------|------------|------------------|
| Mây nhựa PE | Chịu nắng mưa, nhẹ, đa dạng kiểu | Cần khung sắt tốt | 800K-2tr/bộ |
| Gỗ keo tràm | Đẹp tự nhiên, giá vừa | Cần xử lý chống mối | 600K-1.5tr/bộ |
| Nhôm đúc | Bền vĩnh viễn, sang trọng | Nặng, giá cao | 2-5tr/bộ |
| Sắt sơn tĩnh điện | Rẻ, chắc | Dễ gỉ nếu sơn kém | 500K-1.2tr/bộ |
| Composite/WPC | Giả gỗ bền, chịu nước | Giá trung bình | 1-3tr/bộ |

## 5 TIÊU CHÍ CHỌN NCC

| # | Tiêu chí | Ngưỡng | Check |
|---|---------|--------|-------|
| 1 | Chất liệu | Chịu UV, chịu nước, không bong tróc | Test 3 tháng ngoài trời |
| 2 | Khung chịu lực | Không gãy khi 120kg ngồi | Test tải trọng |
| 3 | Đóng gói | Không vỡ khi ship xa | Thử ship test |
| 4 | MOQ | ≤ 10 bộ/lần đặt | Đàm phán |
| 5 | Lead time | ≤ 10 ngày | Theo dõi |

## CÔNG THỨC TÍNH BIÊN

\`\`\`
Biên ròng = Giá bán - Giá nhập - Phí sàn - Ship - Ads/đơn - Đóng gói

Ví dụ FB Ads (bộ bàn ghế 2.890K):
2.890K - 1.200K - 0 - 150K - 200K - 50K = 1.290K (biên 45%)

Ví dụ Shopee (giá bán 3.290K, phí 15%):
3.290K - 1.200K - 494K - 0 - 0 - 50K = 1.546K (biên 47%)

⚠️ Lưu ý: Ship hàng cồng kềnh = 100-300K/đơn (tùy khu vực)
\`\`\`` },
      'ai-sourcing': { title: 'Prompt: Tìm NCC mới', content: `# TÌM NCC NỘI THẤT OUTDOOR

\`\`\`
Bạn là chuyên gia sourcing nội thất ngoài trời tại VN.

Tôi cần tìm NCC cho sản phẩm: [bàn ghế mây nhựa / gỗ keo / nhôm đúc]
Budget nhập: [X]K/bộ
MOQ mong muốn: [X] bộ/lần
Khu vực ưu tiên: [HCM / Bình Dương / Đồng Nai]

Hãy:
1. Gợi ý 5 khu vực/làng nghề sản xuất nội thất outdoor tại VN
2. Cách tiếp cận NCC (trực tiếp / Alibaba / 1688)
3. 10 câu hỏi PHẢI HỎI khi gặp NCC
4. Checklist kiểm tra mẫu trước khi đặt lô lớn
5. Mẫu hợp đồng đơn giản (điều khoản quan trọng)
\`\`\`` }
    }
  },
  '03-OFFER': {
    name: 'Offer', desc: 'Công thức offer, giá theo kênh, combo set', icon: '💰',
    files: {
      'bible': { title: 'Bible — Offer Nội Thất Outdoor', content: `# 03-OFFER — Công Thức Offer Nội Thất Ngoài Trời

## 7 THÀNH PHẦN OFFER

| # | Thành phần | Ví dụ cụ thể |
|---|-----------|-------------|
| 1 | Sản phẩm chính | Bộ bàn ghế mây nhựa 4 ghế |
| 2 | Giá | 2.890K (FB) / 3.290K (Shopee) / 3.490K (TikTok) |
| 3 | Cam kết | Bảo hành 2 năm, đổi trả 30 ngày |
| 4 | Quà tặng | Tặng 4 nệm ngồi outdoor (trị giá 400K) |
| 5 | Combo | Bộ bàn + 4 ghế + ô dù = 4.990K (tiết kiệm 1.200K) |
| 6 | Urgency | "Chỉ 20 bộ giá ưu đãi" / "Freeship tuần này" |
| 7 | Social proof | "500+ sân vườn đã dùng bộ này" |

## GIÁ THEO KÊNH

| Kênh | Giá bán | Phí sàn | Biên |
|------|---------|---------|------|
| FB Ads | 2.890K | 0% | 40-50% |
| Shopee | 3.290K | 15% | 35-45% |
| TikTok | 3.490K | 20% | 30-40% |

> ⚠️ FB Ads vẫn là kênh LỜI nhất cho hàng giá trị cao!

## PHÂN KHÚC GIÁ

| Phân khúc | Range giá | Target |
|-----------|----------|--------|
| Phổ thông | 1-3 triệu/bộ | Ban công, sân nhỏ |
| Trung cấp | 3-8 triệu/bộ | Sân vườn gia đình |
| Cao cấp | 8-20 triệu/bộ | Villa, resort, cafe |` },
      'ai-offer': { title: 'AI Offer Generator', content: `# AI OFFER GENERATOR — Nội Thất Outdoor

\`\`\`
Bạn là chuyên gia e-commerce tối ưu offer cho nội thất ngoài trời VN.

SẢN PHẨM: [Bộ bàn ghế mây nhựa 4 ghế]
GIÁ NHẬP: [X]K
GIÁ BÁN HIỆN TẠI: [X]K
KÊNH: [FB Ads / Shopee / TikTok]

Hãy đề xuất 5 offer khác nhau:

Offer 1: Set combo (bàn + ghế + ô dù + nệm)
Offer 2: Giảm giá trực tiếp + freeship lắp đặt
Offer 3: Flash sale (giới hạn 20 bộ)
Offer 4: Mua 1 tặng phụ kiện (nệm, khăn trải, đèn solar)
Offer 5: Trả góp 0% (3-6 tháng)

Mỗi offer: Headline + Chi tiết + Biên ước tính
\`\`\`` }
    }
  },
  '04-CONTENT': {
    name: 'Content', desc: 'Script video, hook, angle setup outdoor', icon: '🎬',
    files: {
      'bible': { title: 'Bible — Content Nội Thất Outdoor', content: `# 04-CONTENT — Máy Nội Dung Outdoor

## 5 TRỤ CONTENT

| Trụ | Tỷ lệ | Ví dụ |
|-----|-------|-------|
| Educate | 30% | "Cách chọn bàn ghế chịu nắng mưa" |
| Prove | 25% | Setup thật, khách review, before/after |
| Sell | 20% | "Flash sale bộ bàn ghế 2.890K" |
| Inspire | 15% | Tour sân vườn đẹp, decor ideas |
| Trend | 10% | Bắt trend TikTok, biến hóa không gian |

## 15 ANGLE VIDEO NỘI THẤT OUTDOOR

### SETUP & BEFORE/AFTER (5)
1. Biến ban công trống → quán cafe mini
2. Before/after sân vườn (time-lapse)
3. Setup bộ bàn ghế outdoor trong 5 phút
4. Decor sân vườn cho Tết / party
5. Biến góc sân thành nơi đọc sách

### SO SÁNH & REVIEW (5)
6. So sánh mây nhựa vs gỗ vs nhôm
7. Test chịu mưa: để ngoài trời 1 tháng
8. Unbox bộ bàn ghế outdoor Shopee
9. Khách review sau 6 tháng sử dụng
10. So sánh giá: 2 triệu vs 10 triệu

### BÁN HÀNG (5)
11. Flash sale countdown
12. Tour showroom / kho hàng
13. Đóng gói ship đơn lớn
14. Livestream lắp ráp + tư vấn
15. "Sân vườn của khách" — UGC compilation` },
      'ai-script': { title: 'AI Script Engine', content: `# AI SCRIPT ENGINE — Outdoor

## VIẾT 10 HOOK
\`\`\`
Viết 10 hook video 3 giây cho: bộ bàn ghế ngoài trời mây nhựa 2.890K
Target: Gia đình có sân vườn/ban công, 28-45 tuổi
Platform: [TikTok / Facebook Reels]
Yêu cầu: Gây tò mò, visual, có số cụ thể
\`\`\`

## VIẾT SCRIPT 30s
\`\`\`
Viết kịch bản video 30 giây:

Sản phẩm: [bộ bàn ghế mây nhựa 4 ghế 2.890K]
Angle: [setup before/after / review chất liệu / so sánh]
Hook: [hook đã chọn]
Offer: [2.890K, freeship lắp đặt, tặng 4 nệm, bảo hành 2 năm]

Format:
[0-3s] HOOK: ...
[3-10s] VẤN ĐỀ: ...
[10-20s] GIẢI PHÁP: ...
[20-27s] BẰNG CHỨNG: ...
[27-30s] CTA: ...
\`\`\`` }
    }
  },
  '05-DISTRIBUTION': {
    name: 'Distribution', desc: 'FB Ads, Shopee, TikTok cho hàng cồng kềnh', icon: '📢',
    files: {
      'bible': { title: 'Bible — Phân Phối Outdoor', content: `# 05-DISTRIBUTION — Phân Phối Nội Thất Outdoor

## CHIẾN LƯỢC KÊNH

| Kênh | Vai trò | Biên ròng | Lưu ý |
|------|---------|----------|-------|
| FB Ads | 💰 KÊNH CHÍNH | 40-50% | Tốt cho hàng giá trị cao |
| Shopee | 🏪 Bổ trợ | 35-45% | Phí ship cồng kềnh cao |
| TikTok | 📢 Awareness | 30-40% | Video setup rất viral |

> ⚠️ Nội thất outdoor = hàng CỒ KỀNH → ship đắt, dễ hỏng. FB Ads chốt qua inbox, tự ship = LỜI nhất.

## ĐẶC THÙ HÀNG CỒ KỀNH

- **Ship**: 100-300K/đơn (nội thành) → cộng vào giá hoặc freeship có điều kiện
- **Đóng gói**: Xốp PE + thùng carton 5 lớp + đai kiện → 50-100K/bộ
- **Lắp đặt**: Tự lắp (video HD) hoặc lắp tận nơi (cộng phí / free)
- **Tỷ lệ hỏng khi ship**: 3-8% → cần policy đổi trả rõ ràng` },
      'fb-ads': { title: 'FB Ads Playbook', content: `# FB ADS — PLAYBOOK NGOÀI TRỜI

## CẤU TRÚC CAMPAIGN

\`\`\`
Campaign 1: COLD (người chưa biết)
├── Ad set 1: Broad (25-50 tuổi, có nhà/sân vườn)
├── Ad set 2: Interest (home decor, gardening, outdoor living)
└── Ad set 3: LAL 1% (từ data khách đã mua)
    └── Mỗi ad set: 3-5 video (setup, before/after, review)

Campaign 2: RETARGET
├── Xem video >50%
├── Inbox chưa chốt
└── Cart abandonment (Shopee)
\`\`\`

## QUY TẮC ADS HÀNG GIÁ TRỊ CAO

| Chỉ số | Tốt | Trung bình | Cắt |
|--------|-----|-----------|-----|
| CPM | <80K | 80-150K | >150K |
| CPC | <5K | 5-10K | >10K |
| CPA (inbox) | <30K | 30-60K | >60K |
| Tỷ lệ chốt | >20% | 10-20% | <10% |

> 💡 Hàng giá trị cao: KH cần thời gian quyết định → Retarget rất quan trọng!` }
    }
  },
  '06-SALES': {
    name: 'Sales', desc: 'Tư vấn, chốt đơn, báo giá bàn ghế', icon: '💬',
    files: {
      'bible': { title: 'Bible — Chốt Đơn Outdoor', content: `# 06-SALES — Chốt Đơn Nội Thất Ngoài Trời

## FLOW CHỐT 7 BƯỚC

\`\`\`
1. CHÀO (<15 phút)
   "Dạ chào anh/chị! A/C đang xem bộ [tên SP] đúng không ạ?"

2. TƯ VẤN KHÔNG GIAN
   "Sân vườn nhà a/c rộng khoảng bao nhiêu m² ạ?"
   "A/C muốn đặt ở sân vườn, ban công hay bên hồ bơi?"

3. GỢI Ý BỘ PHÙ HỢP
   "Với diện tích [X]m², em gợi ý bộ [X] — vừa đủ, không chật!"

4. ĐỀ XUẤT OFFER
   "Bộ này 2.890K, freeship lắp đặt. Đặt hôm nay em tặng 4 nệm outdoor!"

5. XỬ LÝ TỪ CHỐI (xem tab Objection Handler)

6. CHỐT
   "A/C cho em: Tên, SĐT, Địa chỉ. Em sẽ giao + lắp trong 3-5 ngày!"

7. CONFIRM
   Gọi/Zalo confirm trong 2 giờ (hàng giá trị cao = cần confirm)
\`\`\`

## GỢI Ý THEO DIỆN TÍCH

| Diện tích | Gợi ý | Range giá |
|-----------|-------|----------|
| Ban công 3-6m² | Bộ 2 ghế + bàn tròn nhỏ | 1.5-2.5tr |
| Sân nhỏ 10-20m² | Bộ 4 ghế + bàn chữ nhật | 2.5-4tr |
| Sân vườn 20-50m² | Bộ 6 ghế + bàn + ô dù | 4-8tr |
| Sân lớn >50m² | Set sofa góc L + bàn + phụ kiện | 8-15tr |` },
      'ai-objection': { title: 'Xử lý từ chối', content: `# 8 OBJECTION PHỔ BIẾN — NỘI THẤT OUTDOOR

## 1. "Đắt quá"
\`\`\`
"Dạ em hiểu! Nhưng bộ này dùng 5-10 năm ngoài trời — tính ra chưa tới 2K/ngày.
Hàng rẻ hơn thường bong tróc sau 1 mùa mưa, lại phải mua lại đắt hơn ạ."
\`\`\`

## 2. "Sợ ship hỏng"
\`\`\`
"A/C yên tâm! Em đóng gói 5 lớp xốp + thùng 5 lớp + đai kiện.
Nếu hỏng khi giao, em ĐỔI MỚI 100% miễn phí ạ!"
\`\`\`

## 3. "Sợ để ngoài trời mau hỏng"
\`\`\`
"Chất liệu [mây nhựa PE / nhôm] chịu UV, chịu mưa nắng quanh năm.
Em bảo hành 2 năm — nếu bong tróc trong 2 năm em đổi miễn phí!"
\`\`\`

## 4. "Lắp ráp khó không?"
\`\`\`
"Lắp rất đơn giản — em gửi video hướng dẫn chi tiết.
Hoặc A/C ở [khu vực], em cho thợ qua lắp FREE luôn ạ!"
\`\`\`

## 5. "Để suy nghĩ thêm"
\`\`\`
"Dạ A/C cứ suy nghĩ! Nhưng đợt freeship lắp đặt chỉ còn tuần này.
Em giữ giá cho A/C 3 ngày nhé?"
\`\`\`` }
    }
  },
  '07-FULFILLMENT': {
    name: 'Fulfillment', desc: 'Đóng gói cồng kềnh, ship, lắp đặt', icon: '📦',
    files: {
      'bible': { title: 'Bible — Fulfillment Outdoor', content: `# 07-FULFILLMENT — Đóng Gói & Giao Hàng Cồng Kềnh

## QUY TRÌNH ĐÓNG GÓI

\`\`\`
1. KIỂM TRA (trước khi đóng)
   □ Đủ bộ (bàn + ghế + ốc vít + dụng cụ)
   □ Không xước, không lỗi
   □ Kèm hướng dẫn lắp ráp

2. ĐÓNG GÓI (5 lớp)
   □ Lớp 1: Xốp PE bọc mỗi chi tiết
   □ Lớp 2: Foam góc cạnh
   □ Lớp 3: Thùng carton 5 lớp
   □ Lớp 4: Đai kiện
   □ Lớp 5: Dán "FRAGILE" + "HÀNG DỄ VỠ"

3. SHIP
   □ Nội thành: Xe tải nhỏ tự giao (0-150K)
   □ Liên tỉnh: Nhà xe / GHTK / J&T cồng kềnh
   □ Tracking number gửi khách qua Zalo
\`\`\`

## CHI PHÍ SHIP THAM KHẢO

| Khu vực | Bộ 4 ghế + bàn | Bộ sofa góc L |
|---------|---------------|--------------|
| Nội thành HCM | 80-120K | 150-250K |
| Liên tỉnh gần | 150-250K | 300-500K |
| Liên tỉnh xa | 250-400K | 500-800K |

> 💡 Tip: "Freeship nội thành" = offer mạnh, chi phí thấp!` }
    }
  },
  '08-RETENTION': {
    name: 'Retention', desc: 'Bảo hành, chăm sóc, upsell phụ kiện', icon: '🔄',
    files: {
      'bible': { title: 'Bible — Giữ Chân Khách', content: `# 08-RETENTION — Giữ Chân & Upsell

## HÀNH TRÌNH SAU MUA

\`\`\`
Ngày 1: Giao hàng + lắp đặt → Chụp ảnh setup gửi khách
Ngày 3: Zalo hỏi thăm "A/C dùng OK không?"
Ngày 30: Gửi tips bảo quản nội thất outdoor
Ngày 90: Gợi ý phụ kiện (nệm mới, ô dù, đèn solar)
Ngày 180: Mời review + discount 10% đơn tiếp theo
Ngày 365: Nhắc bảo trì + giới thiệu bạn bè giảm 15%
\`\`\`

## UPSELL PHỤ KIỆN

| Phụ kiện | Giá bán | Biên | Khi nào gợi ý |
|----------|---------|------|---------------|
| Nệm ngồi outdoor | 100-200K/cái | 60% | Khi chốt đơn |
| Ô dù sân vườn | 500K-1.5tr | 50% | Combo với bàn ghế |
| Đèn solar | 150-400K | 55% | Sau 1 tháng |
| Khăn trải bàn outdoor | 80-150K | 65% | Sau 1 tháng |
| Bao phủ chống mưa | 200-500K | 50% | Mùa mưa |

## CHƯƠNG TRÌNH GIỚI THIỆU

\`\`\`
Khách giới thiệu bạn mua → GIẢM 15% đơn tiếp
Bạn được giới thiệu → GIẢM 10% đơn đầu
→ Win-win, chi phí acquisition = 0
\`\`\`` }
    }
  },
  '09-FINANCE': {
    name: 'Finance', desc: 'Biên ròng theo SP, chi phí ship, P&L', icon: '📊',
    files: {
      'bible': { title: 'Bible — Tài Chính Outdoor', content: `# 09-FINANCE — Tài Chính Nội Thất Outdoor

## BẢNG GIÁ & BIÊN RÒNG

| Sản phẩm | Nhập | Bán (FB) | Bán (Shopee) | Biên FB | Biên Shopee |
|----------|------|---------|-------------|---------|------------|
| Bộ 4 ghế mây nhựa | 1.2tr | 2.89tr | 3.29tr | 45% | 38% |
| Bộ 2 ghế ban công | 600K | 1.59tr | 1.89tr | 48% | 40% |
| Sofa góc L outdoor | 3tr | 6.89tr | 7.49tr | 42% | 35% |
| Ô dù sân vườn | 300K | 890K | 990K | 50% | 42% |
| Ghế xếp ngoài trời | 150K | 490K | 590K | 55% | 45% |

## CHI PHÍ ẨN CẦN TÍNH

| Hạng mục | Chi phí | Ghi chú |
|----------|---------|---------|
| Ship cồng kềnh | 100-400K/đơn | Tùy khu vực |
| Đóng gói chắc | 50-100K/bộ | Xốp + carton 5 lớp |
| Hàng hỏng khi ship | ~5% giá nhập | Dự phòng |
| Lắp đặt | 0-200K/đơn | Free hoặc thu phí |
| Bảo hành/đổi trả | ~3% doanh thu | Dự phòng |

## P&L MẪU THÁNG 1

\`\`\`
Doanh thu: 60 đơn × 3tr = 180tr
Giá nhập: 60 × 1.2tr = 72tr
Ship: 60 × 150K = 9tr
Đóng gói: 60 × 70K = 4.2tr
Ads (FB): 15tr
Vận hành: 10tr
────────────────────
Lợi nhuận: 69.8tr (biên 39%)
\`\`\`` }
    }
  },
  '10-TEAM': {
    name: 'Team', desc: 'Phân vai, quy trình, KPI', icon: '👥',
    files: {
      'bible': { title: 'Bible — Team Outdoor', content: `# 10-TEAM — Tổ Chức Team

## CẤU TRÚC TEAM (giai đoạn đầu, 3-5 người)

| Vai trò | Người | Việc chính | KPI |
|---------|-------|-----------|-----|
| 👑 Leader | 1 | Chiến lược, NCC, tài chính | Doanh thu / Biên |
| 📢 Ads + Content | 1 | Quay video, chạy ads, đăng bài | ROAS, CPA |
| 💬 Sales | 1-2 | Tư vấn inbox, chốt đơn, Zalo | Tỷ lệ chốt, doanh thu |
| 📦 Kho + Ship | 1 | Nhập hàng, đóng gói, giao hàng | Tỷ lệ hỏng, tốc độ |

## DAILY STANDUP (15 phút, 9h sáng)

\`\`\`
1. Hôm qua: Bao nhiêu đơn? Vấn đề gì?
2. Hôm nay: Ai làm gì? Priority?
3. Block: Cần hỗ trợ gì?
\`\`\`

## KPI HÀNG TUẦN

| Metric | Target tháng 1 | Target tháng 3 |
|--------|---------------|----------------|
| Đơn hàng | 40-60/tháng | 100-150/tháng |
| Doanh thu | 120-180tr | 300-450tr |
| ROAS | >3x | >4x |
| Tỷ lệ chốt (inbox) | >15% | >25% |
| Tỷ lệ hoàn/hỏng | <5% | <3% |` }
    }
  },
  '11-MASTER': {
    name: 'Master Plan', desc: 'Roadmap scale, mở rộng, vision', icon: '🗺️',
    files: {
      'bible': { title: 'Bible — Master Plan', content: `# 11-MASTER PLAN — Roadmap Scale

## PHASE 1: LAUNCH (tháng 1-3) — "Chạy đơn đầu tiên"
- ✅ Chọn 3-5 SKU bestseller (bàn ghế mây nhựa phổ thông)
- ✅ Setup shop Shopee + page FB + TikTok
- ✅ Chạy FB Ads test 5-10tr/tuần
- ✅ Target: 40-60 đơn/tháng

## PHASE 2: OPTIMIZE (tháng 4-6) — "Tối ưu biên"
- Mở rộng 10-15 SKU
- Scale ads → 15-25tr/tuần
- Tối ưu đóng gói giảm hỏng
- Target: 100-150 đơn/tháng

## PHASE 3: SCALE (tháng 7-12) — "Đa kênh"
- Thêm Shopee Mall / TikTok Shop
- KOC review nội thất outdoor
- Showroom nhỏ hoặc kho xem hàng
- Target: 200-300 đơn/tháng

## PHASE 4: BRAND (năm 2) — "Thương hiệu"
- Sản phẩm OEM mang thương hiệu riêng
- B2B: bán cho resort, cafe, dự án
- Hệ thống đại lý
- Target: 500+ đơn/tháng` }
    }
  },
};

export const AI_PROMPTS = [
  { module: '01-RESEARCH', name: 'Phân tích đối thủ outdoor (paste data)', prompt: 'Bạn là chuyên gia e-commerce nội thất outdoor VN.\n\nTôi đã thu thập data 5 đối thủ bán bàn ghế ngoài trời trên Shopee:\n\n[PASTE DATA Ở ĐÂY — VD:]\nShop A: Bàn ghế mây nhựa 2.890K, 350 lượt bán, rating 4.7, "freeship lắp đặt"\nShop B: Gỗ keo 1.990K, 820 lượt bán, rating 4.5\n...\n\nShop tôi: Mây nhựa 2.590K, 50 lượt bán, chưa có rating\n\nPhân tích:\n1. Ai BÁN CHẠY nhất? Tại sao?\n2. RANGE GIÁ đang thắng?\n3. CHẤT LIỆU nào ưa chuộng?\n4. Shop tôi THIẾU gì?\n5. 3 ACTION cần làm NGAY?' },
  { module: '01-RESEARCH', name: 'Đọc review khách đối thủ (paste review)', prompt: 'Bạn là product analyst cho shop nội thất ngoài trời.\n\nDưới đây là review 1-3 sao từ khách mua bàn ghế outdoor:\n\n[PASTE REVIEW Ở ĐÂY]\n\nPhân tích:\n1. TOP 3 vấn đề khách chê nhiều nhất?\n2. Shop tôi TRÁNH bằng cách nào?\n3. Viết 3 USP dựa trên điểm yếu đối thủ.\n4. 3 cam kết dùng trong VIDEO/AD.' },
  { module: '01-RESEARCH', name: 'Spy Ads đối thủ nội thất', prompt: 'Bạn là FB Ads strategist cho shop nội thất outdoor VN.\n\nTôi thu thập 5 ads từ fb.com/ads/library:\n\n[PASTE AD COPY Ở ĐÂY]\n\nPhân tích:\n1. Ad nào chạy LÂU NHẤT?\n2. HOOK hấp dẫn nhất?\n3. OFFER mạnh nhất?\n4. Viết 5 AD COPY cho bộ bàn ghế mây nhựa 2.890K, freeship lắp đặt, tặng 4 nệm.' },
  { module: '03-OFFER', name: 'Offer Generator — 5 offer nội thất', prompt: 'SẢN PHẨM: [bộ bàn ghế outdoor]\nGIÁ NHẬP: [X]K\nGIÁ BÁN: [X]K\nKÊNH: [FB/Shopee/TikTok]\n\nĐề xuất 5 offer:\n1. Combo set (bàn + ghế + ô dù)\n2. Freeship lắp đặt\n3. Flash sale 20 bộ\n4. Tặng phụ kiện\n5. Trả góp 0%\n\nMỗi offer: Headline + Chi tiết + Biên + Khi nào dùng' },
  { module: '04-CONTENT', name: 'Viết 10 Hook video outdoor', prompt: 'Viết 10 hook video 3 giây:\nSP: [bàn ghế ngoài trời mây nhựa 2.890K]\nTarget: Gia đình có sân vườn/ban công, 28-45\nPlatform: [TikTok/FB Reels]\nYêu cầu: Gây tò mò, visual, số cụ thể' },
  { module: '04-CONTENT', name: 'Script Video 30s setup outdoor', prompt: 'Kịch bản video 30s:\nSP: [bộ bàn ghế mây nhựa 4 ghế 2.890K]\nAngle: [setup before/after / review chất liệu / so sánh]\nOffer: [2.890K, freeship lắp đặt, tặng 4 nệm]\n\n[0-3s] HOOK\n[3-10s] VẤN ĐỀ\n[10-20s] GIẢI PHÁP\n[20-27s] BẰNG CHỨNG\n[27-30s] CTA' },
  { module: '04-CONTENT', name: 'Caption FB + TikTok nội thất', prompt: 'Viết 3 caption cho video bàn ghế outdoor:\n- Caption 1: Ngắn cho TikTok\n- Caption 2: Trung cho Facebook\n- Caption 3: Dài storytelling\nCó hashtag, tone thân thiện, CTA.' },
  { module: '06-SALES', name: 'Xử lý Objection nội thất', prompt: 'Script xử lý objection:\n1. "Đắt quá"\n2. "Sợ ship hỏng"\n3. "Sợ để ngoài trời mau hỏng"\n4. "Lắp ráp khó không?"\n5. "Để suy nghĩ"\n6. "Bên kia rẻ hơn"\n7. "Giao lâu không?"\n8. "Chất liệu gì?"' },
  { module: '06-SALES', name: 'Tư vấn theo diện tích', prompt: 'Khách có sân vườn [X]m².\nBudget: [X] triệu.\nNhu cầu: [uống cafe/ăn ngoài trời/decor/party]\n\nGợi ý:\n1. Bộ phù hợp nhất\n2. Layout sắp xếp\n3. Phụ kiện bổ sung\n4. Offer tốt nhất' },
  { module: '09-FINANCE', name: 'Báo cáo ngày', prompt: 'Data hôm nay:\nFB: Spend [X]K, Inbox [X], Đơn [X], CPA [X]K\nShopee: Đơn [X], DT [X]K\nTikTok: Views [X], Đơn [X]\nShip: Giao [X], Thành [X], Hỏng [X]\n\n1. Tốt/xấu?\n2. Top 3 việc ngày mai\n3. Cảnh báo?' },
  { module: '09-FINANCE', name: 'Phân tích SKU nội thất', prompt: 'Phân tích SKU:\n| SKU | Mẫu | Chất liệu | Giá | Đơn tuần | Hoàn |\n\n1. Xếp hạng theo LỢI NHUẬN\n2. SCALE/GIỮ/BỎ\n3. Chất liệu/mẫu bán chạy nhất?\n4. Nhập thêm gì?' },
];

// KPI Benchmarks — Outdoor Furniture
export const KPI_BENCHMARKS = {
  cpa: { good: 30, ok: 60, unit: 'K', lowerBetter: true },
  roas: { good: 4.0, ok: 2.5, unit: 'x', lowerBetter: false },
  close_rate: { good: 20, ok: 12, unit: '%', lowerBetter: false },
  boom_rate: { good: 8, ok: 15, unit: '%', lowerBetter: true },
  return_rate: { good: 5, ok: 10, unit: '%', lowerBetter: true },
  delivery_rate: { good: 92, ok: 85, unit: '%', lowerBetter: false },
};

// Decision Gates
export const DECISION_GATES = [
  { id: 1, name: 'Gate 1 — Cuối tuần 2', day: 14, checks: '≥3 đơn/ngày, CPA < 60K' },
  { id: 2, name: 'Gate 2 — Cuối tháng 1', day: 30, checks: '≥8 đơn/ngày, CPA < 40K, Biên > 30%' },
  { id: 3, name: 'Gate 3 — Cuối tháng 2', day: 60, checks: '≥15 đơn/ngày, P&L gần hòa' },
  { id: 4, name: 'Gate 4 — Cuối tháng 3', day: 90, checks: 'P&L dương, trend tăng' },
];

// Default daily tasks by role
export const DEFAULT_TASKS: Record<string, { text: string; time: string }[]> = {
  leader: [
    { text: 'Check inbox + đơn mới', time: 'morning' },
    { text: 'Họp standup 9:00', time: 'morning' },
    { text: 'Review data hôm qua', time: 'morning' },
    { text: 'Nhập số liệu cuối ngày', time: 'evening' },
  ],
  ads: [
    { text: 'Check CPA + ROAS campaigns', time: 'morning' },
    { text: 'Cắt ad set CPA > 60K', time: 'morning' },
    { text: 'Test 1-2 creative mới', time: 'afternoon' },
    { text: 'Báo cáo ads cho Leader', time: 'evening' },
  ],
  media: [
    { text: 'Quay 3-5 video (setup, review, before/after)', time: 'morning' },
    { text: 'Edit + đăng video TikTok', time: 'afternoon' },
    { text: 'Đăng video FB Reels', time: 'evening' },
  ],
  sales: [
    { text: 'Trả lời inbox FB + Shopee', time: 'morning' },
    { text: 'Tư vấn + chốt đơn', time: 'afternoon' },
    { text: 'Confirm COD qua điện thoại', time: 'afternoon' },
    { text: 'Báo cáo số chốt cho Leader', time: 'evening' },
  ],
  fulfillment: [
    { text: 'Kiểm tra + đóng gói đơn hàng', time: 'morning' },
    { text: 'Bàn giao nhà xe / shipper', time: 'morning' },
    { text: 'Check tracking đơn giao', time: 'afternoon' },
    { text: 'Cập nhật tồn kho', time: 'evening' },
  ],
};

// Role metadata
export const ROLES: Record<string, { name: string; color: string; icon: string }> = {
  leader: { name: 'Leader', color: '#6b8f5e', icon: '👑' },
  ads: { name: 'Ads', color: '#60a5fa', icon: '📢' },
  media: { name: 'Media', color: '#f472b6', icon: '🎬' },
  sales: { name: 'Sales', color: '#34d399', icon: '💬' },
  fulfillment: { name: 'Kho & Ship', color: '#fb923c', icon: '📦' },
};

// Content status pipeline
export const CONTENT_STATUSES = [
  { key: 'idea', label: '💡 Ý tưởng', color: '#6b8f5e' },
  { key: 'scripted', label: '📝 Script', color: '#60a5fa' },
  { key: 'filmed', label: '🎬 Quay', color: '#fbbf24' },
  { key: 'edited', label: '✂️ Edit', color: '#fb923c' },
  { key: 'posted', label: '✅ Đã đăng', color: '#34d399' },
];

