import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8' };

async function chat(req, res) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const { question, chart } = JSON.parse(body || '{}');
  if (!question?.trim()) return respond(res, 400, { error: 'Hãy nhập câu hỏi trước nhé.' });
  if (!process.env.OPENAI_API_KEY) return respond(res, 200, { answer: `Mình đã nhận câu hỏi: “${question.trim()}”.\n\nHiện ứng dụng chưa được cấu hình OPENAI_API_KEY nên chưa thể gọi AI trực tuyến. Bạn vẫn có thể xem phần luận giải có sẵn trong lá số. Khi triển khai, hãy đặt OPENAI_API_KEY ở môi trường máy chủ; khóa sẽ không được gửi xuống trình duyệt.\n\nLưu ý: Tử vi là góc nhìn tham khảo, không thay thế tư vấn chuyên môn hay quyết định quan trọng.` });
  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', input: [
        { role: 'system', content: 'Bạn là trợ lý giải thích văn hóa Tử Vi bằng tiếng Việt, giọng điệu dễ hiểu, có chừng mực. Xem tử vi là tham khảo/giải trí; không khẳng định định mệnh, không đưa lời khuyên y tế, pháp lý, đầu tư. Nêu rõ giới hạn nếu dữ liệu lá số chưa đầy đủ.' },
        { role: 'user', content: `Thông tin lá số (chỉ dùng làm ngữ cảnh tham khảo): ${JSON.stringify(chart || {})}\n\nCâu hỏi: ${question}` }
      ] })
    });
    const data = await response.json();
    if (!response.ok) return respond(res, 502, { error: data.error?.message || 'Không thể kết nối dịch vụ AI lúc này.' });
    const answer = data.output?.flatMap(x => x.content || []).find(x => x.type === 'output_text')?.text || 'AI chưa tạo được câu trả lời.';
    respond(res, 200, { answer });
  } catch { respond(res, 502, { error: 'Lỗi kết nối dịch vụ AI. Vui lòng thử lại.' }); }
}
function respond(res, status, data) { res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }); res.end(JSON.stringify(data)); }

http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/chat') return chat(req, res);
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const target = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!target.startsWith(root)) return respond(res, 403, { error:'Forbidden' });
  try {
    const info = await stat(target); const file = info.isDirectory() ? path.join(target, 'index.html') : target;
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(Number(process.env.PORT || 3000), '127.0.0.1', () => console.log(`La So Tu Vi running at http://localhost:${process.env.PORT || 3000}`));
