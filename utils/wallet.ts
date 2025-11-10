export function formatAddress(address: string | `0x${string}` | undefined) {
  address = address || "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}
