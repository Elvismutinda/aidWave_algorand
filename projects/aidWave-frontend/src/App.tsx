import React, { useEffect, useState } from "react";
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

  const setState = async () => {
    try {
      const state = await typedClient.getGlobalState();

      setProposal(state.proposal!.asString());
    } catch (error) {
      console.warn(error)
      setProposal("Invalid App ID, please set a valid App ID or create a new application");
    }
  };

  // Everytime the App ID changes, we update the proposal
  useEffect(() => {
    if (appID === 0) {
      setProposal("The app ID must be set manually or via the create application button before loading the proposal");
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

                <h1 className="font-bold m-2">Proposal App ID</h1>

                <input
                  type="number"
                  className="input unput-bordered"
                  value={appID}
                  onChange={(e) => setAppID(e.currentTarget.valueAsNumber || 0)}
                />

                <h1 className="font-bold m-2">Proposal</h1>

                <textarea className="textarea textarea-bordered m-2" value={proposal} />

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
              </div>

              <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
            </div>
          </div>
        </div>
      </WalletProvider>
    </SnackbarProvider>
  );
}
