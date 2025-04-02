export default class DateHelper {
  static compareDates(a: string, b: string): number;
  static compareDates(a: Date, b: Date): number;
  static compareDates(a: any, b: any) {
    if (typeof a === 'string') {
      a = new Date(a);
    }

    if (typeof b === 'string') {
      b = new Date(b);
    }

    return a.valueOf() - b.valueOf();
  }
}