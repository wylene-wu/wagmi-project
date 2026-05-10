import { cookieStorage, createConfig, createStorage, http } from "@wagmi/vue";
import { injected, metaMask } from "@wagmi/vue/connectors";
import { Chains, defaultChain, ethMainnet, ethSepolia } from "@/config/constant";

export const config = createConfig({
  chains: Chains,
  connectors: [injected(), metaMask()],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [defaultChain.id]: http(),
    [ethMainnet.id]: http(),
    [ethSepolia.id]: http(),
  },
});

declare module "@wagmi/vue" {
  interface Register {
    config: typeof config;
  }
}
