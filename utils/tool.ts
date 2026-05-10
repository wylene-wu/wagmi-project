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
