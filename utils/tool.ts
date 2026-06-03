import Decimal from "decimal.js";

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function formatDisplayDecimal(
  val: Decimal | number | string,
  decimal = 2,
  toFixed = false,
) {
  if (!(val instanceof Decimal)) {
    val = new Decimal(val);
  }
  if (toFixed) {
    return val.toFixed(decimal, Decimal.ROUND_DOWN);
  }
  return val.toDecimalPlaces(decimal, Decimal.ROUND_DOWN).toString();
}

export const isSameAddress = (left?: string | null, right?: string | null) =>
  Boolean(left && right && left.toLowerCase() === right.toLowerCase());

export const timeNowLabelFormat = () =>
  new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
