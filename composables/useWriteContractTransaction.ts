import { useWriteContract } from "@wagmi/vue";
import {
  decodeErrorResult,
  type Abi,
  type SimulateContractParameters,
} from "viem";

import { defaultChain } from "@/config/constant";
import {
  publicClient,
  waitForTransactionSuccess,
  type ContractParameters,
} from "@/utils/contractTransaction";
import { getTransactionFeeInfo } from "@/utils/getTransactionFee";

const useWriteContractTransaction = () => {
  const { writeContractAsync } = useWriteContract();
  const toast = useToast();

  const simulateAndWriteTransaction = async (
    txData: ContractParameters,
    isApprove = false,
  ) => {
    let hash: `0x${string}` | undefined;

    try {
      const transactionFee = await getTransactionFeeInfo(txData);
      const { to: _to, value, ...simulateTxData } = txData;
      const simulate = await publicClient.simulateContract({
        ...simulateTxData,
        ...transactionFee,
        ...(value != null && value !== 0n ? { value } : {}),
        chain: defaultChain,
      } as SimulateContractParameters);

      hash = await writeContractAsync(simulate.request);

      toast.info(
        isApprove
          ? "Approve transaction submitted"
          : "Transaction submitted. Waiting for confirmation...",
        { duration: 2000 },
      );

      const receipt = await waitForTransactionSuccess(hash);

      toast.success(
        isApprove
          ? "Approve allowance transaction success"
          : "Transaction confirmed",
      );

      return { simulate, receipt };
    } catch (err: unknown) {
      let error = err;
      if (err instanceof Error) {
        error = {
          ...err,
          message: err.message,
          name: err.name,
          stack: err.stack,
          hash,
        };
      } else if (typeof err === "string") {
        error = { message: err, hash };
      } else {
        error = { ...(err as object), hash };
      }

      const errorData = (err as { data?: string })?.data;
      if (!errorData) throw error;

      try {
        const decoded = decodeErrorResult({
          abi: txData.abi as Abi,
          data: errorData as `0x${string}`,
        });

        error = {
          message: decoded?.errorName,
          decoded,
          raw: err,
          hash,
        };
      } catch {
        error = {
          message: "ContractDecodingError",
          hash,
        };
      }
      throw error;
    }
  };

  return {
    simulateAndWriteTransaction,
  };
};

export default useWriteContractTransaction;
