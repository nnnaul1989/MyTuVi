# An Nhiên · Lá số tử vi

Web app responsive để lập lá số tham khảo, xem 12 cung/đại vận, hỏi đáp AI và lưu hồ sơ trên trình duyệt.

## Chạy ứng dụng

Yêu cầu Node.js 18 trở lên. Không cần cài package bên ngoài.

```sh
npm start
```

Mở http://localhost:3000. Để bật trả lời bằng OpenAI, cấu hình `OPENAI_API_KEY` trong môi trường máy chủ trước khi chạy; có thể đặt `OPENAI_MODEL` (mặc định `gpt-4.1-mini`). Không nhúng khóa API trong frontend. Khi chưa cấu hình khóa, endpoint hỏi đáp trả lời thông báo hướng dẫn.

## Cấu trúc

- `src/data`: dữ liệu tên cung, can chi, giờ sinh, các chủ đề luận giải.
- `src/domain`: chuyển đổi Âm/Dương lịch và dựng cấu trúc lá số.
- `src/services`: lưu localStorage và gọi API hỏi đáp.
- `src/views`: các màn hình tổng quan, nhập ngày sinh, lá số.
- `src/styles`: giao diện desktop và mobile.
- `server`: máy chủ HTTP tĩnh và API proxy AI.

## Lưu ý

Lịch Việt Nam được chuyển đổi theo thuật toán thiên văn UTC+7. Phần an sao/luận giải hiện là bản giản lược mang tính chiêm nghiệm, không phải hệ thống Tử Vi cổ điển đầy đủ hoặc lời dự báo chắc chắn. Lá số được lưu trong localStorage của trình duyệt hiện tại; xóa dữ liệu trình duyệt sẽ xóa các lá số đã lưu.
