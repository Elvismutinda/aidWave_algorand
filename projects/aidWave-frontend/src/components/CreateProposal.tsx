import { useWallet } from "@txnlab/use-wallet";
import Proposal from "./Proposal";
import { useEffect, useState } from "react";
import { AidWaveClient } from "../contracts/AidWaveClient";
import * as algokit from "@algorandfoundation/algokit-utils";
import { getAlgodConfigFromViteEnvironment } from "../utils/network/getAlgoClientConfigs";
import Vote from "./Vote";
import Register from "./Register";

interface CreateProposalInterface {
  openModal: boolean;
  closeModal: () => void;
}

const CreateProposal = ({ openModal, closeModal }: CreateProposalInterface) => {
  const { providers, activeAddress } = useWallet();
  const [appID, setAppID] = useState<number>(0);
  const [proposal, setProposal] = useState<string>("");
  const [registeredASA, setRegisteredASA] = useState<number>(0);
  const [registered, setRegistered] = useState<boolean>(false);
  const [votesTotal, setVotesTotal] = useState<number>(0);
  const [votesInFavor, setVotesInFavor] = useState<number>(0);

  const resetState = () => {
    setRegisteredASA(0);
    setRegistered(false);
    setVotesTotal(0);
    setVotesInFavor(0);
  };

  const setState = async () => {
    try {
      console.log(registered);
      const state = await typedClient.getGlobalState();
      const asa = state.registeredAsaId?.asNumber() || 0;

      setProposal(state.proposal!.asString());
      setRegisteredASA(asa);
      setVotesTotal(state.votesTotal?.asNumber() || 0);
      setVotesInFavor(state.votesInFavor?.asNumber() || 0);

      try {
        const assetInfo = await algodClient.accountAssetInformation(activeAddress!, asa).do();
        setRegistered(assetInfo["asset-holding"].amount === 1);
      } catch (error) {
        console.warn(error);
        setRegistered(false);
      }
    } catch (error) {
      console.warn(error);
      setProposal("Invalid Proposal ID, please set a valid Proposal ID or create a new proposal");
      resetState();
    }
  };

  // Everytime the App ID changes, we update the proposal
  useEffect(() => {
    if (appID === 0) {
      setProposal("The Proposal ID must be set manually or via the create proposal button before loading the proposal");
      resetState();
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
      id="create-proposal-modal"
      className={`modal ${openModal ? "modal-open" : ""}`}
      style={{ display: openModal ? "flex" : "none", justifyContent: "center", alignItems: "center", zIndex: 70 }}
    >
      <form method="dialog" className="modal-box text-black">
        <h3 className="font-bold text-2xl">Create a Proposal</h3>

        <div className="grid m-2 pt-5">
          <div className="py-2" />

          <h1 className="font-bold my-2">Proposal ID</h1>

          <input
            type="number"
            className="input input-bordered"
            value={appID}
            onChange={(e) => setAppID(e.currentTarget.valueAsNumber || 0)}
          />

          <h1 className="font-bold my-2">AidWave Proposal</h1>

          <textarea className="textarea textarea-bordered my-2" value={proposal} readOnly />

          <h1 className="font-bold m-2 text-center">Votes</h1>

          <p className="text-center">
            {votesInFavor} / {votesTotal}
          </p>

          <div className="divider" />

          {activeAddress && appID === 0 && (
            <Proposal
              buttonClass="btn btn-primary m-2"
              buttonLoadingNode={<span className="loading loading-spinner" />}
              buttonNode="Create Proposal"
              typedClient={typedClient}
              setAppID={setAppID}
            />
          )}

          {activeAddress && appID !== 0 && registeredASA !== 0 && !registered && (
            <Register
              buttonClass="btn btn-primary m-2"
              buttonLoadingNode={<span className="loading loading-spinner" />}
              buttonNode="Register to Vote"
              typedClient={typedClient}
              registeredASA={registeredASA}
              algodClient={algodClient}
              setState={setState}
            />
          )}

          {activeAddress && appID !== 0 && registeredASA !== 0 && registered && (
            <div>
              <Vote
                buttonClass="btn btn-secondary m-2"
                buttonLoadingNode={<span className="loading loading-spinner" />}
                buttonNode="Vote Against"
                typedClient={typedClient}
                inFavor={false}
                registeredASA={registeredASA}
                setState={setState}
              />
              <Vote
                buttonClass="btn btn-secondary m-2"
                buttonLoadingNode={<span className="loading loading-spinner" />}
                buttonNode="Vote in Favor"
                typedClient={typedClient}
                inFavor={true}
                registeredASA={registeredASA}
                setState={setState}
              />
            </div>
          )}
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

export default CreateProposal;
