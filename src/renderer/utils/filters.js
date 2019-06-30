export function parseTime(time) {
  let o;
  if(typeof time === 'string' || typeof time === 'number') o = new Date(time);
  let year = o.getFullYear();
  let month = o.getMonth() + 1;
  month = month >= 10 ? month : '0' + month;
  let date = o.getDate();
  date = date >= 10 ? date : '0' + date;
  return `${year}-${month}-${date}`;
};

export function parseTimeWithoutYear(time) {
  let t = parseTime(time).split('-');
  return t.slice(1).join('-');
};

export function parseTimeWithoutDate(time) {
  let t = parseTime(time).split('-');
  return t.slice(0, -1).join('-');
};