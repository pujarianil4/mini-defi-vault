import { ConnectButton } from "@rainbow-me/rainbowkit";
import { config } from "../config/wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useBalance,
} from "wagmi";
import { formatEther, parseEther } from "viem";

import { waitForTransactionReceipt } from "@wagmi/core";
import "../styles/main.scss";

// Max uint256 value
const maxInt = 115792089237316195423570985008687907853269984665640564039457n;
// Vault contract address on Sepolia
const VAULT_ADDRESS = "0xE3f15a81abAbEbF2Cb80654D246220Aa7BaD3945" as const;
const VAULT_ABI = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getBalanceFor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

type TxMsg = {
  msg: string;
  type: "error" | "success" | "";
};

function VaultInterface() {
  const { address, isConnected } = useAccount();
  const { data: walletBalance } = useBalance({
    address: address ?? "0x0000000000000000000000000000000000000000",
    unit: "ether",
  });
  const [isMaxWithdraw, setIsMaxWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [txMsg, setTxMsg] = useState<TxMsg>({
    msg: "",
    type: "",
  });

  const { data: balance, refetch } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getBalanceFor",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const { writeContract: deposit } = useWriteContract();

  const { writeContract: withdraw } = useWriteContract();

  const showMsg = (status: "error" | "success") => {
    if (status === "error") {
      setTxMsg({
        msg: "Transaction failed!",
        type: "error",
      });
    } else {
      setTxMsg({
        msg: "Transaction completed!",
        type: "success",
      });
    }

    setTimeout(() => {
      setTxMsg({
        msg: "",
        type: "",
      });
    }, 2000);
  };

  if (!isConnected) {
    return (
      <div className='vault-interface'>
        <h1>Vault Interface</h1>
        <div className='section'>
          <p>Please connect your wallet to interact with the vault.</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  const handleWaitForTransactionReceipt = async (hash: `0x${string}`) => {
    const transactionReceipt = await waitForTransactionReceipt(config, {
      confirmations: 1,
      hash,
    });
    refetch();
    setIsDepositing(false);
    setIsWithdrawing(false);
    showMsg("success");
    console.log("transactionReceipt", transactionReceipt);
  };
  const handleDeposit = () => {
    if (!depositAmount) return;
    try {
      setIsDepositing(true);
      deposit(
        {
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: "deposit",
          value: parseEther(depositAmount),
        },
        {
          onSuccess: (hash) => {
            setDepositAmount("");
            handleWaitForTransactionReceipt(hash);
          },

          onError: () => {
            setIsDepositing(false);
            showMsg("error");
          },
        }
      );
    } catch (error) {
      setIsDepositing(false);
      showMsg("error");
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    try {
      setIsWithdrawing(true);
      withdraw(
        {
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: "withdraw",
          args: [isMaxWithdraw ? maxInt : parseEther(withdrawAmount)],
        },
        {
          onSuccess: (hash) => {
            setWithdrawAmount("");
            setIsMaxWithdraw(false);
            handleWaitForTransactionReceipt(hash);
          },

          onError: () => {
            setIsWithdrawing(false);
            showMsg("error");
          },
        }
      );
    } catch (error) {
      setIsWithdrawing(false);
      showMsg("error");
    }
  };

  const handleMax = (type: "deposit" | "withdraw") => {
    if (type === "deposit") {
      setDepositAmount(formatEther(walletBalance?.value ?? 0n));
    } else {
      setIsMaxWithdraw(true);
      setWithdrawAmount(formatEther(balance ?? 0n));
    }
  };

  return (
    <div className='vault-interface'>
      <div className='header'>
        <h1>Vault Interface</h1>
        <ConnectButton />
      </div>

      {txMsg.msg && <div className={txMsg.type}>{txMsg.msg}</div>}

      <div className='section'>
        <h2>Your Balance</h2>
        <p>
          {balance?.toString() ? `${formatEther(balance)} ETH` : "Loading..."}
        </p>
      </div>

      <div className='section'>
        <h2>Deposit ETH</h2>

        <div className='input-container'>
          <input
            type='number'
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder='Amount in ETH'
            className='input-field'
            disabled={isDepositing}
          />
          <button onClick={() => handleMax("deposit")} className='max-button'>
            Max
          </button>
        </div>
        <button
          onClick={handleDeposit}
          className='deposit-button'
          disabled={isDepositing || !depositAmount}
        >
          {isDepositing ? "Depositing..." : "Deposit"}
        </button>
      </div>

      <div className='section'>
        <h2>Withdraw ETH</h2>
        <div className='input-container'>
          <input
            type='number'
            value={withdrawAmount}
            onChange={(e) => {
              setWithdrawAmount(e.target.value);
              setIsMaxWithdraw(false);
            }}
            placeholder='Amount in ETH'
            className='input-field'
            disabled={isWithdrawing}
          />
          <button onClick={() => handleMax("withdraw")} className='max-button'>
            Max
          </button>
        </div>

        <button
          onClick={handleWithdraw}
          className='withdraw-button'
          disabled={isWithdrawing}
        >
          {isWithdrawing ? "Withdrawing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
}

export default VaultInterface;
