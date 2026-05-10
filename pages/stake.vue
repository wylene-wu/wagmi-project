<template>
  <div class="relative mx-auto max-w-3xl space-y-6 overflow-hidden">
    <section class="relative">
      <h1 class="mt-4 text-3xl font-bold leading-tight text-text sm:text-4xl">
        Stake
      </h1>
    </section>

    <section
      class="relative overflow-hidden rounded-[28px] border border-accent/20 bg-panel p-5 shadow-[0_28px_120px_rgba(0,0,0,0.44),0_0_52px_color-mix(in_srgb,var(--color-mint)_12%,transparent)] sm:p-6"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_34%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-mint)_10%,transparent),transparent_36%)]"
      />

      <div class="relative space-y-5">
        <div>
          <p class="text-xs font-semibold uppercase text-subtle">Action</p>
          <h2 class="mt-1 text-xl font-bold text-white">
            {{ submitLoading ? "Processing stake" : "Stake input" }}
          </h2>
        </div>

        <div class="rounded-xl border border-white/10 bg-surface/90 p-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              id="stake-amount"
              type="text"
              class="min-h-14 flex-1 bg-transparent text-3xl font-bold text-white outline-none placeholder:text-subtle focus:ring-0"
              placeholder="0"
              :value="stakeInputVal"
              @input="handleStakeInputChange"
              :disabled="submitLoading"
            />
            <div
              class="flex min-h-12 items-center gap-3 rounded-2xl border border-accent/20 bg-accent/10 px-4"
            >
              <img src="/imgs/ethereum.svg" class="h-6 w-6" alt="Ethereum" />
              <span class="font-semibold text-accent">ETH</span>
            </div>
          </div>
          <div
            class="mt-4 flex items-center justify-between gap-4 text-sm text-muted"
          >
            <p>$</p>
            <div class="flex items-center gap-3">
              <span>Balance: {{ ethBalance?.balance || "-" }}</span>
              <button
                type="button"
                class="cursor-pointer min-h-9 rounded-full border border-accent/25 bg-accent/10 px-4 text-sm font-semibold text-accent transition duration-200 hover:border-accent/55 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:border-accent/10 disabled:bg-accent/5 disabled:text-accent/30"
                @click="handleMaxClick"
                :disabled="submitLoading"
              >
                Max
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl border border-mint/20 bg-mint/10 text-mint-text"
          >
            <TransferIcon class="h-7 w-7 rotate-90" />
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/4 p-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label class="sr-only" for="receive-amount">Receive amount</label>
            <input
              id="receive-amount"
              type="text"
              inputmode="decimal"
              readonly
              class="min-h-14 flex-1 bg-transparent text-3xl font-bold text-white outline-none placeholder:text-subtle focus:ring-0"
              placeholder="0"
            />
            <div
              class="min-w-10 flex min-h-12 items-center rounded-2xl border border-mint/20 bg-mint/10 px-4 font-semibold text-mint-text"
            >
              {{ wstethBalance?.symbol }}
            </div>
          </div>
          <div
            class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted"
          >
            <p>$</p>
            <p>Balance: {{ wstethBalance?.balance || "-" }}</p>
          </div>
        </div>

        <div
          class="grid gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-2"
        >
          <div
            v-for="step in transactionSteps"
            :key="step.id"
            :class="[
              'relative overflow-hidden rounded-2xl border p-4 transition duration-200',
              step.id === activeStakeStep
                ? 'border-accent/45 bg-accent/10 shadow-[0_0_28px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]'
                : isTransactionStepDone(step.id)
                  ? 'border-mint/35 bg-mint/10'
                  : 'border-white/10 bg-panel/70',
            ]"
          >
            <div class="flex items-start gap-3">
              <span
                :class="[
                  'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                  step.id === activeStakeStep
                    ? 'border-accent/50 text-accent'
                    : isTransactionStepDone(step.id)
                      ? 'border-mint/50 text-mint-text'
                      : 'border-white/15 text-subtle',
                ]"
              >
                <span
                  v-if="step.id === activeStakeStep"
                  class="h-2 w-2 animate-pulse rounded-full bg-accent motion-reduce:animate-none"
                />
                <span v-else-if="isTransactionStepDone(step.id)">✓</span>
                <span v-else>{{ step.order }}</span>
              </span>
              <div class="min-w-0">
                <p
                  :class="[
                    'font-semibold',
                    step.id === activeStakeStep
                      ? 'text-accent'
                      : isTransactionStepDone(step.id)
                        ? 'text-mint-text'
                        : 'text-white',
                  ]"
                >
                  {{ step.title }}
                </p>
                <p class="mt-1 text-xs leading-5 text-muted">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="cursor-pointer min-h-14 w-full rounded-2xl border border-accent/30 bg-accent/15 text-lg font-semibold text-accent shadow-[0_0_32px_color-mix(in_srgb,var(--color-accent)_14%,transparent)] transition duration-200 hover:border-accent/60 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:border-accent/10 disabled:bg-accent/5 disabled:text-accent/30 disabled:shadow-none disabled:hover:border-accent/10 disabled:hover:bg-accent/5"
          :disabled="isStakeDisabled"
          @click="handleStakeSubmit"
        >
          {{ submitLoading ? "Processing..." : "Stake" }}
        </button>
      </div>
    </section>

    <section
      class="grid gap-3 rounded-xl border border-white/10 bg-panel p-5 text-sm shadow-[0_18px_70px_rgba(0,0,0,0.26)]"
    >
      <div class="flex items-center justify-between gap-4">
        <p class="text-subtle">Exchange Rate</p>
        <p class="font-semibold text-soft">
          1 ETH = {{ tokensPerStEth || "-" }} {{ wstethBalance?.symbol }}
        </p>
      </div>
      <div class="flex items-center justify-between gap-4">
        <p class="text-subtle">Fee</p>
        <p :class="['text-right font-semibold']">
          {{
            stakeInputValDecimal.eq(0)
              ? "-"
              : approveFeeEth
                ? `${approveFeeEth} ETH`
                : "-"
          }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAccount } from "@wagmi/vue";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import Decimal from "decimal.js";

import { TransferIcon } from "@/components/icons";
import useWalletBalance from "@/composables/useWalletBalance";
import useWriteContractTransaction from "@/composables/useWriteContractTransaction";
import { formatEther, formatUnits, parseUnits } from "viem";
import { stETHAbi } from "@/contracts/abi/stETH";
import { wstETHAbi } from "@/contracts/abi/wstETH";
import { getTransactionFeeInfo } from "@/utils/getTransactionFee";
import useTokensPerStEth from "@/composables/useTokensPerStEth";
import { defaultChain } from "@/config/constant";

definePageMeta({
  layout: "default",
});
const transactionSteps: TransactionStep[] = [
  {
    id: "approve",
    order: 1,
    title: "Approve",
    description: "Approve stETH wrapping and submit ETH for stETH.",
  },
  {
    id: "wrap",
    order: 2,
    title: "Wrap",
    description: "Wrap received stETH into wstETH.",
  },
];

type StakeStep = "idle" | "approve" | "wrap" | "success";
type TransactionStep = {
  id: Extract<StakeStep, "approve" | "wrap">;
  order: number;
  title: string;
  description: string;
};

const runtimeConfig = useRuntimeConfig();
const { StETHAddress, WstETHAddress, VaultContractDecimals } =
  runtimeConfig.public;
const { ethBalance, wstethBalance, refetchBalances } = useWalletBalance();
const { address, chainId } = useAccount();
const { simulateAndWriteTransaction } = useWriteContractTransaction();
const toast = useToast();
const tokensPerStEth = useTokensPerStEth();

const submitLoading = ref(false);
const stakeInputVal = ref("");
const approveFeeEth = ref("");
const activeStakeStep = ref<StakeStep>("idle");

const enabled = chainId.value === defaultChain.id && !!address.value;
const completedStepIdsByActiveStep: Record<StakeStep, TransactionStep["id"][]> =
  {
    idle: [],
    approve: [],
    wrap: ["approve"],
    success: ["approve", "wrap"],
  };
const isTransactionStepDone = (stepId: TransactionStep["id"]): boolean =>
  completedStepIdsByActiveStep[activeStakeStep.value].includes(stepId);

let approveFeeRequestId = 0;
let approveFeeTimer: ReturnType<typeof setTimeout> | undefined;

const inputTokenValueDecimal = computed(
  () => new Decimal(ethBalance.value?.balance || 0),
);
const stakeInputValDecimal = computed(
  () => new Decimal(stakeInputVal.value || 0),
);
const isStakeDisabled = computed(
  () =>
    submitLoading.value ||
    !address.value ||
    stakeInputValDecimal.value.eq(0) ||
    !enabled,
);
const parsedStakeAmount = computed(() =>
  parseUnits(
    stakeInputValDecimal.value.toString(),
    Number(VaultContractDecimals),
  ),
);

watch(
  [address, parsedStakeAmount, isStakeDisabled],
  ([account, amountInput, isDisabled]) => {
    if (isDisabled) {
      approveFeeEth.value = "";
      return;
    }
    if (approveFeeTimer) clearTimeout(approveFeeTimer);

    const requestId = ++approveFeeRequestId;
    approveFeeTimer = setTimeout(async () => {
      const feeInfo = await getTransactionFeeInfo({
        account,
        address: StETHAddress as `0x${string}`,
        abi: stETHAbi,
        functionName: "approve",
        args: [WstETHAddress as `0x${string}`, amountInput],
      });

      if (requestId !== approveFeeRequestId) return;
      approveFeeEth.value = formatDisplayDecimal(
        formatUnits(feeInfo.gas * feeInfo.maxFeePerGas, 18),
        6,
      );
    }, 350);
  },
  { flush: "post" },
);

onBeforeUnmount(() => {
  if (approveFeeTimer) clearTimeout(approveFeeTimer);
});

const handleMaxClick = (): void => {
  const balance = ethBalance.value?.balance;
  stakeInputVal.value = balance || "0";
};

const handleStakeInputChange = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  let value = target.value;

  if (value === "") {
    stakeInputVal.value = "";
    return;
  }
  if (!/^\d*\.?\d*$/.test(value)) {
    stakeInputVal.value = "";
    target.value = stakeInputVal.value;
    return;
  }

  if (value.startsWith(".")) {
    value = `0${value}`;
  }

  const [intParts, decimalParts] = value.split(".");
  const endsWithDot = value.endsWith(".");
  if (intParts.length > 1 && intParts.startsWith("0")) {
    value =
      (intParts.replace(/^0+/, "") || "0") +
      (decimalParts ? `.${decimalParts}` : endsWithDot ? "." : "");
  }

  const decimalVault = new Decimal(endsWithDot ? `${value}0` : value);

  if (decimalVault.gt(inputTokenValueDecimal.value)) {
    stakeInputVal.value = inputTokenValueDecimal.value.toString();
    target.value = stakeInputVal.value;
    return;
  }
  if (decimalParts?.length > 5) {
    value = decimalVault.toFixed(5, Decimal.ROUND_DOWN);
  }

  stakeInputVal.value = value;
  target.value = stakeInputVal.value;
};

const handleStakeSubmit = async (): Promise<void> => {
  if (isStakeDisabled) return;

  try {
    submitLoading.value = true;
    if (["idle", "approve"].includes(activeStakeStep.value)) {
      activeStakeStep.value = "approve";
      await simulateAndWriteTransaction(
        {
          account: address.value,
          address: StETHAddress as `0x${string}`,
          abi: stETHAbi,
          functionName: "approve",
          args: [WstETHAddress as `0x${string}`, parsedStakeAmount.value],
        },
        true,
      );
      await simulateAndWriteTransaction({
        account: address.value,
        address: StETHAddress as `0x${string}`,
        abi: stETHAbi,
        functionName: "submit",
        args: [address.value],
        value: parsedStakeAmount.value,
      });

      activeStakeStep.value = "wrap";
    }

    await simulateAndWriteTransaction({
      account: address.value,
      address: WstETHAddress as `0x${string}`,
      abi: wstETHAbi,
      functionName: "wrap",
      args: [parsedStakeAmount.value],
    });

    activeStakeStep.value = "success";
    stakeInputVal.value = "";
    await refetchBalances();
    activeStakeStep.value = "idle";
  } catch (error: { message?: string; shortMessage?: string } | any) {
    console.error("Stake transaction error", error);
    const errorMessage =
      error?.shortMessage || error?.message || "Please try again.";
    toast.error("Stake transaction failed", {
      message: errorMessage,
    });
  } finally {
    submitLoading.value = false;
  }
};
</script>
