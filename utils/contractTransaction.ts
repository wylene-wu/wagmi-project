import {
  createPublicClient,
  http,
  type SimulateContractParameters,
  type TransactionReceipt,
} from "viem";

import { defaultChain } from "@/config/constant";
import { sleep } from "@/utils/tool";

type TransactionParameters = {
  account?: `0x${string}`;
  to?: `0x${string}`;
  value?: bigint;
};

export type ContractParameters = Omit<
  SimulateContractParameters,
  "account" | "value"
> &
  TransactionParameters;

export const publicClient = createPublicClient({
  chain: defaultChain,
  transport: http(),
});

export const waitForTransactionSuccess = async (
  hash: `0x${string}`,
  retryCount = 0,
): Promise<{ hash: `0x${string}`; receipt: TransactionReceipt }> => {
  try {
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 300_000,
    });

    if (receipt.status !== "success") {
      throw {
        code: "transactionRevertedError",
        message: `Transaction failed (Hash: ${hash})`,
      };
    }

    return { hash, receipt };
  } catch (error) {
    if (
      retryCount < 3 &&
      (error as { code?: string })?.code !== "transactionRevertedError"
    ) {
      await sleep(1000);
      return waitForTransactionSuccess(hash, retryCount + 1);
    }

    throw error;
  }
};
