const KEY='annhien.savedCharts.v1';
export const getCharts=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
export const saveChart=chart=>{const charts=getCharts().filter(item=>item.id!==chart.id);charts.unshift(chart);localStorage.setItem(KEY,JSON.stringify(charts));return charts};
export const deleteChart=id=>{const charts=getCharts().filter(chart=>chart.id!==id);localStorage.setItem(KEY,JSON.stringify(charts));return charts};
