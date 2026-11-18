import { PALACE_NAMES, STEMS, BRANCHES, HOURS, ELEMENT_COPY } from '../data/tuViData.js';

const mod = (n,m) => ((n%m)+m)%m;
export function buildChart(input) {
  const { name, gender, birth, birthHour, calendar } = input;
  const stemIndex=mod(birth.year-4,10), branchIndex=mod(birth.year-4,12), yearStem=STEMS[stemIndex], yearBranch=BRANCHES[branchIndex];
  // Nạp âm element by sexagenary pair (two consecutive years share one element).
  const napAm=['Kim','Hỏa','Mộc','Thổ','Kim','Hỏa','Thủy','Thổ','Kim','Mộc','Thủy','Thổ','Kim','Mộc','Thủy','Hỏa','Thổ','Mộc','Thủy','Hỏa','Thổ','Kim','Mộc','Hỏa','Thổ','Kim','Mộc','Thủy','Hỏa','Kim'];
  const element=napAm[Math.floor(mod(birth.year-4,60)/2)];
  const birthPalace=mod(2+birth.month-1-birthHour,12), palaces=[];
  for(let i=0;i<12;i++){
    const palaceIndex=mod(i-birthPalace,12), palaceName=PALACE_NAMES[palaceIndex];
    const palaceStem=STEMS[mod(stemIndex*2+i,10)], palaceBranch=BRANCHES[mod(i+2,12)];
    const stars=[];
    if(i===birthPalace) stars.push({name:'Chính tinh chủ mệnh',kind:'major'});
    if(i===mod(birthPalace+4,12)) stars.push({name:'Thiên hướng phát triển',kind:'support'});
    if(i===mod(birthPalace+8,12)) stars.push({name:'Nguồn lực & tích lũy',kind:'support'});
    if(i===mod(branchIndex+birth.month,12)) stars.push({name:'Điểm cần lưu tâm',kind:'note'});
    palaces.push({index:i,name:palaceName,stem:palaceStem,branch:palaceBranch,stars,description:palaceName==='Mệnh'?`Ngũ hành ${element} gợi nét ${ELEMENT_COPY[element]}. Đây là một chất liệu để tự quan sát, không phải khuôn mẫu cố định.`:`Cung ${palaceName} là một chủ đề để bạn chiêm nghiệm về trải nghiệm, lựa chọn và những mối quan hệ liên quan.`});
  }
  const daYun=Array.from({length:8},(_,i)=>({age:`${(i+1)*10}–${(i+2)*10-1}`,title:['Khởi nhịp','Bồi đắp','Mở rộng','Chuyển mình','Vững vàng','Thu hoạch','Chia sẻ','An nhiên'][i],theme:['Học cách nhận diện điểm mạnh và xây nền tảng cá nhân.','Tích lũy kỹ năng, nuôi dưỡng các mối quan hệ hỗ trợ.','Chủ động thử sức và điều chỉnh hướng đi qua trải nghiệm.','Rà soát ưu tiên, chọn điều phù hợp với giá trị của mình.','Củng cố thành quả và giữ nhịp sống cân bằng.','Chia sẻ kinh nghiệm, tận dụng nguồn lực đã vun bồi.','Làm mới mục tiêu, giữ sự linh hoạt trước thay đổi.','Trân trọng hành trình và đầu tư vào những điều có ý nghĩa.'][i]}));
  const shownBirth=input.inputDate||birth;
  const summary=`Lá số của ${name} được dựng từ ngày sinh ${shownBirth.day}/${shownBirth.month}/${shownBirth.year} (${calendar==='lunar'?'Âm lịch':'Dương lịch'}) và giờ ${HOURS[birthHour].split(' ')[0]}. Năm ${yearStem} ${yearBranch}, nạp âm tham khảo ${element}. Cấu trúc này gợi một số chủ đề để tự chiêm nghiệm; trải nghiệm thực tế và lựa chọn cá nhân mới là điều định hình cuộc sống.`;
  return {id:crypto.randomUUID(),name,gender,birth,inputDate:shownBirth,birthHour,calendar,yearStem,yearBranch,element,palaces,daYun,summary,createdAt:new Date().toISOString(),version:1};
}
