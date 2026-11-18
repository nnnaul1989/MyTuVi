export const icon=(name)=>({spark:'✦',arrow:'↗',save:'♡',close:'×',chat:'⌁',back:'←',trash:'⌫'}[name]||'•');
export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function header(eyebrow,title,subtitle,action=''){return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`;}
