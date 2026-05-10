import { mainnet, sepolia, hoodi, type Chain } from "@wagmi/vue/chains";

export type WalletName = keyof typeof WalletIcons;
export type ImgChain = Chain & { icon: string };

export const WalletIcons = {
  MetaMask: "/imgs/metamask.png",
  WalletConnect: "/imgs/walletconnect.png",
} as const;

export const ethMainnet: ImgChain = {
  ...mainnet,
  icon: "/imgs/ethereum.svg",
};

export const ethSepolia: ImgChain = {
  ...sepolia,
  icon: "/imgs/ethereum.svg",
};

export const ethHoodi: ImgChain = {
  ...hoodi,
  icon: "/imgs/ethereum.svg",
};

export const defaultChain = ethHoodi;

export const Chains = [defaultChain, ethMainnet, ethSepolia] as readonly [
  ImgChain,
  ...ImgChain[],
];

export const VaultAddress = process.env
  .NUXT_PUBLIC_VAULT_ADDRESS as `0x${string}`;
export const VaultWithdrawAddress = process.env
  .NUXT_PUBLIC_VAULT_WITHDRAW_QUEUE_ADDRESS as `0x${string}`;
