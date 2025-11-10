import { mainnet, sepolia, type Chain } from "@wagmi/vue/chains";

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

export const Chains = [ethMainnet, ethSepolia] as readonly [
  ImgChain,
  ...ImgChain[]
];
