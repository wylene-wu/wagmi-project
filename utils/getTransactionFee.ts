import { encodeFunctionData } from "viem";

import {
  publicClient,
  type ContractParameters,
} from "@/utils/contractTransaction";

export const getTransactionFeeInfo = async ({
  account,
  to,
  value = 0n,
  ...txData
}: ContractParameters) => {
  const gasBuffer = 120n;
  const data = encodeFunctionData(txData);
  const target = to ?? txData.address;

  const [gas, fees] = await Promise.all([
    publicClient.estimateGas({
      account,
      to: target,
      value,
      data,
    }),
    publicClient.estimateFeesPerGas(),
  ]);

  return {
    gas: (gas * gasBuffer) / 100n,
    maxFeePerGas: fees.maxFeePerGas,
    maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
  };
};
