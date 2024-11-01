export type JSONValue = { [key: string]: JSONValue } | JSONValue[] | string | number | boolean | null;
export type JSONContainer = { [key: string]: JSONValue } | JSONValue[];