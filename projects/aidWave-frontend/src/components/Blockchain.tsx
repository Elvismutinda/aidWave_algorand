import { motion } from "framer-motion";
import { SelectedPage } from "../types/navbar";
import Logo from "../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faSearch, faArrowsDownToPeople } from "@fortawesome/free-solid-svg-icons";

type BlockchainProps = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Blockchain = ({ setSelectedPage }: BlockchainProps) => {
  return (
    <section id="blockchain" className="mx-auto min-h-full w-5/6 py-24">
      <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Blockchain)}>
        <div className="md:my-5 md:w-3/5">
          <h1 className="text-4xl font-bold text-[#FFDE59]">How does AidWave leverage Algorand Blockchain Technology?</h1>
        </div>

        <div className="mt-5 items-center justify-between gap-8 md:flex">
          <div className="w-1/3 mt-5 rounded-md border-2 border-gray-100 px-5 py-16 text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-4 rounded-full bg-transparent">
                <FontAwesomeIcon icon={faShieldAlt} className="text-5xl" />
              </div>
            </div>

            <h4 className="text-2xl font-bold">Security</h4>
            <p className="my-3">
              Your vote is cryptographically secured and immutably recorded on the blockchain, safeguarding it against tampering or
              manipulation.
            </p>
          </div>

          <div className="w-1/3 mt-5 rounded-md border-2 border-gray-100 px-5 py-16 text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-4 rounded-full bg-transparent">
                <FontAwesomeIcon icon={faSearch} className="text-5xl" />
              </div>
            </div>

            <h4 className="text-2xl font-bold">Transparency</h4>
            <p className="my-3">
              Access to proposals and voting results is unrestricted, fostering transparency and reinforcing trust in the decision-making
              process.
            </p>
          </div>

          <div className="w-1/3 mt-5 rounded-md border-2 border-gray-100 px-5 py-16 text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-4 rounded-full bg-transparent">
                <FontAwesomeIcon icon={faArrowsDownToPeople} className="text-5xl" />
              </div>
            </div>

            <h4 className="font-bold text-2xl">Decentralization</h4>
            <p className="my-3">
              Decision-making is distributed across a decentralized network, ensuring no single authority holds control and empowering every
              participant in the community.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Blockchain;
