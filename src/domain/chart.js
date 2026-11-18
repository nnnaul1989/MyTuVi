import { PALACE_NAMES, STEMS, BRANCHES, HOURS, ELEMENT_COPY } from '../data/tuViData.js';

const mod = (number, divisor) => ((number % divisor) + divisor) % divisor;
const NAP_AM_ELEMENTS = ['Kim','Hỏa','Mộc','Thổ','Kim','Hỏa','Thủy','Thổ','Kim','Mộc','Thủy','Thổ','Hỏa','Mộc','Thủy','Kim','Hỏa','Mộc','Thổ','Kim','Hỏa','Thủy','Thổ','Kim','Mộc','Thủy','Thổ','Hỏa','Mộc','Thủy'];
const NAP_AM_NAMES = ['Hải Trung Kim','Lư Trung Hỏa','Đại Lâm Mộc','Lộ Bàng Thổ','Kiếm Phong Kim','Sơn Đầu Hỏa','Giản Hạ Thủy','Thành Đầu Thổ','Bạch Lạp Kim','Dương Liễu Mộc','Tuyền Trung Thủy','Ốc Thượng Thổ','Tích Lịch Hỏa','Tùng Bách Mộc','Trường Lưu Thủy','Sa Trung Kim','Sơn Hạ Hỏa','Bình Địa Mộc','Bích Thượng Thổ','Kim Bạch Kim','Phú Đăng Hỏa','Thiên Hà Thủy','Đại Trạch Thổ','Thoa Xuyến Kim','Tang Đố Mộc','Đại Khê Thủy','Sa Trung Thổ','Thiên Thượng Hỏa','Thạch Lựu Mộc','Đại Hải Thủy'];
const FIVE_ELEMENT_BUREAU = {Kim:4, Mộc:3, Thủy:2, Hỏa:6, Thổ:5};
const BUREAU_NAMES = {2:'Thủy Nhị Cục',3:'Mộc Tam Cục',4:'Kim Tứ Cục',5:'Thổ Ngũ Cục',6:'Hỏa Lục Cục'};
const MAJOR_STARS = ['Tử Vi','Liêm Trinh','Thiên Đồng','Vũ Khúc','Thái Dương','Thiên Cơ','Thiên Phủ','Thái Âm','Tham Lang','Cự Môn','Thiên Tướng','Thiên Lương','Thất Sát','Phá Quân'];
const THAI_TUE_CYCLE = ['Thái Tuế','Thiếu Dương','Tang Môn','Thiếu Âm','Quan Phù','Tử Phù','Tuế Phá','Long Đức','Bạch Hổ','Phúc Đức','Điếu Khách','Trực Phù'];
const BAC_SY_CYCLE = ['Bác Sĩ','Lực Sĩ','Thanh Long','Tiểu Hao','Tướng Quân','Tấu Thư','Phi Liêm','Hỷ Thần','Bệnh Phù','Đại Hao','Phục Binh','Quan Phủ'];
const TRUONG_SINH_CYCLE = ['Tràng Sinh','Mộc Dục','Quan Đới','Lâm Quan','Đế Vượng','Suy','Bệnh','Tử','Mộ','Tuyệt','Thai','Dưỡng'];

function sexagenaryIndex(stem, branch) {
  for (let index=0; index<60; index++) if (index%10===stem && index%12===branch) return index;
  throw new Error('Can Chi năm sinh không tạo thành một cặp hợp lệ.');
}
function birthYearDetails(year) {
  const cycle=mod(year-4,60), stem=cycle%10, branch=cycle%12, pair=Math.floor(cycle/2);
  return {cycle,stem,branch,yearStem:STEMS[stem],yearBranch:BRANCHES[branch],natalElement:NAP_AM_ELEMENTS[pair],natalElementName:NAP_AM_NAMES[pair]};
}
function palacePositions(month, hour) {
  // Start at Dần (month 1/hour Tý), move forward by lunar month and backward by birth hour.
  const ming=mod(2+month-1-hour,12);
  const than=mod(2+month-1+hour,12);
  return {ming,than};
}
function palaceStemAt(branch, yearStem) {
  // Ngũ Hổ Độn: year stem sets the stem at Dần; the ten stems then follow the branches.
  const stemAtDan=mod(Math.floor(yearStem/2)*2+2,10);
  return mod(stemAtDan+branch-2,10);
}
function bureauFor(yearStem, mingBranch) {
  const menhStem=palaceStemAt(mingBranch,yearStem);
  const cycle=sexagenaryIndex(menhStem,mingBranch);
  const napAm=NAP_AM_ELEMENTS[Math.floor(cycle/2)];
  return {number:FIVE_ELEMENT_BUREAU[napAm],element:napAm,stem:STEMS[menhStem]};
}
function placeMajorStars(bureau, lunarDay) {
  // Tử Vi is found from lunar day + bureau; the fixed Tử Vi and Thiên Phủ sequences follow.
  let amount=bureau, ziwei=2;
  while(amount<lunarDay){amount+=bureau;ziwei++;}
  let correction=amount-lunarDay;
  if(correction%2===1)correction=-correction;
  const tuVi=mod(ziwei+correction,12), thienPhu=mod(4-tuVi,12);
  const result=[
    ['Tử Vi',tuVi],['Liêm Trinh',mod(tuVi+4,12)],['Thiên Đồng',mod(tuVi+7,12)],
    ['Vũ Khúc',mod(tuVi+8,12)],['Thái Dương',mod(tuVi+9,12)],['Thiên Cơ',mod(tuVi+11,12)],
    ['Thiên Phủ',thienPhu],['Thái Âm',mod(thienPhu+1,12)],['Tham Lang',mod(thienPhu+2,12)],
    ['Cự Môn',mod(thienPhu+3,12)],['Thiên Tướng',mod(thienPhu+4,12)],
    ['Thiên Lương',mod(thienPhu+5,12)],['Thất Sát',mod(thienPhu+6,12)],['Phá Quân',mod(thienPhu+10,12)]
  ];
  return result;
}
function addStar(palaces, branch, name, kind='minor') {
  palaces[branch].stars.push({name,kind});
}
function placeAuxiliaryStars(palaces,{yearStem,yearBranch,ming,month,hour,bureau,gender}) {
  const yearIsYang=yearStem%2===0;
  const direction=gender==='male'?(yearIsYang?1:-1):gender==='female'?(yearIsYang?-1:1):1;
  const locTonByStem=[2,3,5,6,5,6,8,9,11,0];
  const locTon=locTonByStem[yearStem];
  const branchCycle=(names,start,step=1)=>names.forEach((name,index)=>addStar(palaces,mod(start+index*step,12),name));

  branchCycle(THAI_TUE_CYCLE,yearBranch);
  branchCycle(BAC_SY_CYCLE,locTon,direction);
  const truongSinhStart={2:8,3:11,4:5,5:8,6:2}[bureau];
  branchCycle(TRUONG_SINH_CYCLE,truongSinhStart,direction);

  // Month and hour based auxiliary pairs commonly used in Vietnamese charts.
  const taPhu=mod(4+month-1,12), huuBat=mod(3-taPhu,12);
  const vanKhuc=mod(4+hour,12), vanXuong=mod(2-vanKhuc,12);
  addStar(palaces,taPhu,'Tả Phù'); addStar(palaces,huuBat,'Hữu Bật');
  addStar(palaces,vanKhuc,'Văn Khúc'); addStar(palaces,vanXuong,'Văn Xương');
  addStar(palaces,locTon,'Lộc Tồn');
  addStar(palaces,mod(locTon-1,12),'Đà La'); addStar(palaces,mod(locTon+1,12),'Kình Dương');
  addStar(palaces,mod(11+hour,12),'Địa Kiếp');
  addStar(palaces,mod(11-hour,12),'Địa Không');
}

export function buildChart(input) {
  const {name,gender,birth,birthHour,calendar}=input;
  const year=birthYearDetails(birth.year);
  const {ming,than}=palacePositions(birth.month,birthHour);
  const bureauDetails=bureauFor(year.stem,ming), bureau=bureauDetails.number;
  const palaces=Array.from({length:12},(_,slot)=>{
    const branch=mod(slot+2,12), palaceName=PALACE_NAMES[mod(branch-ming,12)];
    return {index:slot,branchIndex:branch,name:palaceName,stem:STEMS[palaceStemAt(branch,year.stem)],branch:BRANCHES[branch],stars:[],description:palaceName==='Mệnh'?`Cung Mệnh tại ${BRANCHES[branch]}; bản mệnh ${year.natalElementName}, ${ELEMENT_COPY[year.natalElement]}. Đây là thông tin cấu trúc để tham khảo, không phải khuôn mẫu cố định.`:`Cung ${palaceName} tại ${BRANCHES[branch]} là một lĩnh vực trong cấu trúc lá số. Ý nghĩa cần được đọc cùng chính tinh, phụ tinh, tam hợp và các yếu tố liên quan.`};
  });
  for(const [name,branch] of placeMajorStars(bureau,birth.day)) addStar(palaces,branch,name,'major');
  placeAuxiliaryStars(palaces,{yearStem:year.stem,yearBranch:year.branch,ming,month:birth.month,hour:birthHour,bureau,gender});
  const summary=`Lá số của ${name} được dựng từ ngày sinh ${input.inputDate?.day||birth.day}/${input.inputDate?.month||birth.month}/${input.inputDate?.year||birth.year} (${calendar==='lunar'?'Âm lịch':'Dương lịch'}) và giờ ${HOURS[birthHour].split(' ')[0]}. Năm âm lịch ${year.yearStem} ${year.yearBranch}, bản mệnh ${year.natalElementName}; Mệnh an tại ${BRANCHES[ming]}, ${BUREAU_NAMES[bureau]}. Các sao được an theo bộ quy tắc đã chọn; trường phái khác nhau có thể có dị bản.`;
  const yangForward=gender==='male'?year.cycle%2===0:gender==='female'?year.cycle%2===1:true;
  const palaceSequence=Array.from({length:8},(_,i)=>palaces.find(palace=>palace.branchIndex===mod(ming+(yangForward?i:-i),12)));
  const daYun=palaceSequence.map((palace,i)=>({age:`${bureau+i*10}–${bureau+i*10+9}`,title:palace.name,theme:`Đại hạn đi qua cung ${palace.name}. Đọc cùng các sao trong cung, tam hợp, bản mệnh và hoàn cảnh thực tế.`}));
  return {id:crypto.randomUUID(),name,gender,birth,inputDate:input.inputDate||birth,birthHour,calendar,yearStem:year.yearStem,yearBranch:year.yearBranch,natalElement:year.natalElement,natalElementName:year.natalElementName,element:year.natalElement,bureau,bureauName:BUREAU_NAMES[bureau],mingBranch:BRANCHES[ming],thanBranch:BRANCHES[than],palaces,daYun,summary,createdAt:new Date().toISOString(),version:2,calculation:{school:'Quy tắc an sao Việt phái phổ biến',majorStarCount:14,auxiliaryCycles:['Thái Tuế','Bác Sĩ','Tràng Sinh']}};
}
