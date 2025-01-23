import JSONReader from "./JSONReader";

export default class JSONParser extends JSONReader {
  constructor(string: string) {
    super(JSON.parse(string));
  }
}