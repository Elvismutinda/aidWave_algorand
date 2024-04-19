import { useWallet } from "@txnlab/use-wallet";
import { useEffect, useState } from "react";
import { AidWaveClient } from "../contracts/AidWaveClient";
import * as algokit from "@algorandfoundation/algokit-utils";
import { getAlgodConfigFromViteEnvironment } from "../utils/network/getAlgoClientConfigs";
import Proposal from "./Proposal";

interface SearchProposalInterface {
  openModal: boolean;
  closeModal: () => void;
}

const SearchProposal = ({ openModal, closeModal }: SearchProposalInterface) => {
  const { providers, activeAddress } = useWallet();
  const [appID, setAppID] = useState<number>(0);
  const [proposal, setProposal] = useState<string>("");

  const setState = async () => {
    try {
      const state = await typedClient.getGlobalState();

      setProposal(state.proposal!.asString());
    } catch (error) {
      console.warn(error);
      setProposal("Invalid Proposal ID, please set a valid Proposal ID or create a new proposal");
    }
  };

  // Everytime the App ID changes, we update the proposal
  useEffect(() => {
    if (appID === 0) {
      setProposal("The Proposal ID must be set manually or via the create proposal button before loading the proposal");
      return;
    }

    setState();
  }, [appID]);

  const algodConfig = getAlgodConfigFromViteEnvironment();

  const algodClient = algokit.getAlgoClient({
    server: algodConfig.server,
    port: algodConfig.port,
    token: algodConfig.token,
  });

  const typedClient = new AidWaveClient(
    {
      resolveBy: "id",
      id: appID,
    },
    algodClient
  );

  return (
    <dialog
      id="search-proposal-modal"
      className={`modal ${openModal ? "modal-open" : ""}`}
      style={{ display: openModal ? "flex" : "none", justifyContent: "center", alignItems: "center", zIndex: 70 }}
    >
      <form method="dialog" className="modal-box text-black">
        <h3 className="font-bold text-2xl">Search Proposals</h3>

        <div className="grid m-2 pt-5">
          <div className="py-2" />
          <h1 className="font-bold m-2">Proposal ID</h1>

          <input
            type="number"
            className="input input-bordered"
            value={appID}
            onChange={(e) => setAppID(e.currentTarget.valueAsNumber || 0)}
          />

          <div className="divider" />

          <h1 className="font-bold m-2">AidWave Proposal</h1>

          <textarea className="textarea textarea-bordered m-2" value={proposal} readOnly />
        </div>

        <div className="modal-action">
          <button
            data-test-id="close-wallet-modal"
            className="btn"
            onClick={() => {
              closeModal();
            }}
          >
            Close
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default SearchProposal;
