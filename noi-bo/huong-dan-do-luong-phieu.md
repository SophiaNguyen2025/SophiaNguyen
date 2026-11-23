# Đo lường phễu: Game → Test miễn phí → Báo cáo trả phí

## Các sự kiện đã gắn sẵn (Google Analytics 4)
| Bước | Sự kiện | Ghi chú |
|---|---|---|
| Vào chơi | game_start | |
| Chơi xong | game_complete (result = kết quả) | |
| Bấm sang test | game_cta_click | UTM: utm_campaign=game-<tên game> |
| Bấm trang loại MBTI | game_cta2_click | chỉ Tháp Mảnh Ghép |
| Bấm xem mẫu báo cáo | game_report_peek_click | |
| Bắt đầu test | test_start | |
| Xong test | test_complete | |
| Để lại email | generate_lead (có campaign = game nào) | |
| Bấm mua/đặt báo cáo | cta_report_click | |

## Cách xem trong GA4
1. Khám phá → Phân tích phễu (Funnel exploration) → tạo phễu: game_start → game_complete → game_cta_click → test_complete → generate_lead.
2. Thêm "Chiến dịch phiên" (utm_campaign) làm phân tích theo game: biết game nào dẫn nhiều người nhất.
3. Quản trị → Định nghĩa tùy chỉnh: tạo chiều "campaign" và "result" (phạm vi: sự kiện) nếu muốn lọc theo tham số.

## Facebook Pixel (tùy chọn, để chạy quảng cáo lại)
1. Tạo Pixel trong Meta Events Manager, copy dãy số ID.
2. Mở funnel.js, dòng CFG, điền FB_PIXEL_ID: 'dãy số'.
3. Lead và TestStart sẽ tự gửi lên Pixel.

## Lưu ý
Kết quả game là giải trí, chưa kiểm chứng như bài test. Hãy theo dõi 1-2 tuần rồi mới quyết định game nào đáng đẩy.
