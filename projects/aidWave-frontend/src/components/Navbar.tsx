import { SelectedPage } from "../types/navbar";
import Link from "./Link";
import Logo from "../assets/logo.svg";
import { useState } from "react";
import ConnectWallet from "./ConnectWallet";

type NavbarProps = {
  isTopOfPage: boolean;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }: NavbarProps) => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const navbarBackground = isTopOfPage ? "bg-[#116F89]" : "bg-transparent drop-shadow";

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal);
  };

  return (
    <nav>
      <div className={`${navbarBackground} flex items-center justify-between fixed top-0 z-10 w-full py-4 text-white`}>
        <div className="flex items-center justify-between mx-auto w-5/6">
          <div className="flex items-center justify-between w-full gap-16">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="logo" className="w-10 h-10" />
              <h1 className="text-3xl font-bold text-[#FFDE59]">AidWave</h1>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-between gap-8 text-sm">
                <Link page="Home" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                <Link page="About" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                <Link page="Blockchain" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                <Link page="Mission/Vision" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                <Link page="Contact Us" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
              </div>
              <div className="flex items-center justify-between">
                <button data-test-id="connect-wallet" className="btn btn-secondary m-2 text-[#FFDE59]" onClick={toggleWalletModal}>
                  Wallet Connection
                </button>
                <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
