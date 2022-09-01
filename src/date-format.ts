import formatInTimeZone from 'date-fns-tz/esm/formatInTimeZone';

export default function dateToString(date: Date) {
  return formatInTimeZone(date, 'Asia/Tokyo', 'yyyy.M.d');
}