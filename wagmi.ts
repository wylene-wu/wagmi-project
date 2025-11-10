import { cookieStorage, createConfig, createStorage, http } from "@wagmi/vue";
import { mainnet, sepolia } from "@wagmi/vue/chains";
import { injected, metaMask } from "@wagmi/vue/connectors";
import { Chains } from "@/config/constant";

export const config = createConfig({
  chains: Chains,
  connectors: [injected(), metaMask()],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

declare module "@wagmi/vue" {
  interface Register {
    config: typeof config;
  }
}
