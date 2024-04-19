/* eslint-disable no-console */
import { ReactNode, useState } from "react";
import { AidWave, AidWaveClient } from "../contracts/AidWaveClient";
import { useWallet } from "@txnlab/use-wallet";
import algosdk from "algosdk";
import * as algokit from "@algorandfoundation/algokit-utils";

type RegisterArgs = AidWave["methods"]["register(uint64)void"]["argsObj"];

type Props = {
  buttonClass: string;
  buttonLoadingNode?: ReactNode;
  buttonNode: ReactNode;
  typedClient: AidWaveClient;
  registeredASA: RegisterArgs["registeredASA"];
  algodClient: algosdk.Algodv2;
  setState: () => Promise<void>;
};

const Register = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { activeAddress, signer } = useWallet();
  const sender = { signer, addr: activeAddress! };

  const callMethod = async () => {
    setLoading(true);
    console.log(`Calling register`);
    console.log(sender);

    const registeredAsaOptInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      to: sender.addr,
      amount: 0,
      suggestedParams: await algokit.getTransactionParams(undefined, props.algodClient),
      assetIndex: Number(props.registeredASA),
    });

    await algokit.sendTransaction({ from: sender, transaction: registeredAsaOptInTxn }, props.algodClient);

    await props.typedClient.register(
      {
        registeredASA: props.registeredASA,
      },
      { sender,
        sendParams: { fee: algokit.microAlgos(3_000) },
        assets: [Number(props.registeredASA)]
      }
    );

    await props.setState();
    setLoading(false);
  };

  return (
    <button className={props.buttonClass} onClick={callMethod}>
      {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
    </button>
  );
};

export default Register;
