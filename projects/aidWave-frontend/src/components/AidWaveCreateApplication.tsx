import { ReactNode, useState } from "react";
import { AidWave, AidWaveClient } from "../contracts/AidWave";
import { useWallet } from "@txnlab/use-wallet";
import * as algokit from "@algorandfoundation/algokit-utils";

type Props = {
  buttonClass: string;
  buttonLoadingNode?: ReactNode;
  buttonNode: ReactNode;
  typedClient: AidWaveClient;
  setAppID: (appID: number) => void;
};

const AidWaveCreateApplication = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [proposal, setProposal] = useState<string>("");

  const { activeAddress, signer } = useWallet();
  const sender = { signer, addr: activeAddress! };

  const callMethod = async () => {
    setLoading(true);
    console.log(`Calling createApplication`);
    await props.typedClient.create.createApplication(
      {
        proposal,
      },
      { sender }
    );

    await props.typedClient.appClient.fundAppAccount({ sender, amount: algokit.microAlgos(200_000) });

    await props.typedClient.bootstrap({}, { sender, sendParams: { fee: algokit.microAlgos(2_000) } });

    const { appId } = await props.typedClient.appClient.getAppReference();

    props.setAppID(Number(appId));
    setLoading(false);
  };

  return (
    <div>
      <input type="text" className="input input-bordered m-2" onChange={(e) => setProposal(e.currentTarget.value)} />
      <button className={props.buttonClass} onClick={callMethod}>
        {loading ? props.buttonLoadingNode || props.buttonNode : props.buttonNode}
      </button>
    </div>
  );
};

export default AidWaveCreateApplication;
