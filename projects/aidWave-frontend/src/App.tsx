import { useEffect, useState } from "react";
import { DeflyWalletConnect } from "@blockshake/defly-connect";
import { DaffiWalletConnect } from "@daffiwallet/connect";
import { PeraWalletConnect } from "@perawallet/connect";
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders } from "@txnlab/use-wallet";
import algosdk from "algosdk";
import { SnackbarProvider } from "notistack";
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from "./utils/network/getAlgoClientConfigs";
import { AidWaveClient } from "./contracts/AidWave";
import * as algokit from "@algorandfoundation/algokit-utils";
import { useWallet } from "@txnlab/use-wallet";
import ConnectWallet from "./components/ConnectWallet";
import Proposal from "./components/Proposal";
import Register from "./components/Register";
import Vote from "./components/Vote";

let providersArray: ProvidersArray;
if (import.meta.env.VITE_ALGOD_NETWORK === "") {
  const kmdConfig = getKmdConfigFromViteEnvironment();
  providersArray = [
    {
      id: PROVIDER_ID.KMD,
      clientOptions: {
        wallet: kmdConfig.wallet,
        password: kmdConfig.password,
        host: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
  ];
} else {
  providersArray = [
    { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
    { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
    { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
    { id: PROVIDER_ID.EXODUS },
    // If you are interested in WalletConnect v2 provider
    // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
  ];
}

export default function App() {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
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
      setProposal("Invalid App ID, please set a valid App ID or create a new application");
      resetState();
    }
  };

  // Everytime the App ID changes, we update the proposal
  useEffect(() => {
    if (appID === 0) {
      setProposal("The app ID must be set manually or via the create application button before loading the proposal");
      resetState();
      return;
    }

    setState();
  }, [appID]);

  const { activeAddress } = useWallet();

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal);
  };
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

  const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: algodConfig.network,
      nodeServer: algodConfig.server,
      nodePort: String(algodConfig.port),
      nodeToken: String(algodConfig.token),
    },
    algosdkStatic: algosdk,
  });

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider value={walletProviders}>
        <div className="hero min-h-screen bg-teal-400">
          <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
            <div className="max-w-md">
              <h1 className="text-4xl">
                Welcome to <div className="font-bold">AidWave</div>
              </h1>
              <p className="py-6">Vote for Change, Shape the Future: Your Voice Matters in Humanitarian Assistance</p>

              <div className="grid">
                <button data-test-id="connect-wallet" className="btn m-2" onClick={toggleWalletModal}>
                  Wallet Connection
                </button>
                <div className="divider" />

                <h1 className="font-bold m-2">Proposal ID</h1>

                <input
                  type="number"
                  className="input unput-bordered"
                  value={appID}
                  onChange={(e) => setAppID(e.currentTarget.valueAsNumber || 0)}
                />

                <h1 className="font-bold m-2">AidWave Proposal</h1>

                <textarea className="textarea textarea-bordered m-2" value={proposal} />

                <h1 className="font-bold m-2">Votes</h1>

                <p>{votesInFavor} / {votesTotal}</p>

                <div className="divider" />

                {activeAddress && appID === 0 && (
                  <Proposal
                    buttonClass="btn m-2"
                    buttonLoadingNode={<span className="loading loading-spinner" />}
                    buttonNode="Create Proposal"
                    typedClient={typedClient}
                    setAppID={setAppID}
                  />
                )}

                {activeAddress && appID !== 0 && registeredASA !== 0 && !registered && (
                  <Register
                    buttonClass="btn m-2"
                    buttonLoadingNode={<span className="loading loading-spinner" />}
                    buttonNode="Call register"
                    typedClient={typedClient}
                    registeredASA={registeredASA}
                    algodClient={algodClient}
                    setState={setState}
                  />
                )}

                {activeAddress && appID !== 0 && registeredASA !== 0 && registered && (
                  <div>
                    <Vote
                      buttonClass="btn m-2"
                      buttonLoadingNode={<span className="loading loading-spinner" />}
                      buttonNode="Vote Against"
                      typedClient={typedClient}
                      inFavor={false}
                      registeredASA={registeredASA}
                      setState={setState}
                    />
                    <Vote
                      buttonClass="btn m-2"
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

              <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
            </div>
          </div>
        </div>
      </WalletProvider>
    </SnackbarProvider>
  );
}
