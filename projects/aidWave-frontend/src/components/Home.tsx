import React from "react";
import { motion } from "framer-motion";
import { SelectedPage } from "../types/navbar";
import CreateProposal from "./CreateProposal";
import SearchProposal from "./SearchProposal";

type HomeProps = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Home = ({ setSelectedPage }: HomeProps) => {
  const [openCreateProposalModal, setOpenCreateProposalModal] = React.useState<boolean>(false);
  const [openSearchProposalModal, setOpenSearchProposalModal] = React.useState<boolean>(false);

  const toggleCreateProposalModal = () => {
    setOpenCreateProposalModal(!openCreateProposalModal);
  };

  const toggleSearchProposalModal = () => {
    setOpenSearchProposalModal(!openSearchProposalModal);
  };

  return (
    <section id="home" className="py-24 min-h-full ">
      <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Home)} className="mx-auto w-5/6 md:flex">
        <div className="z-10 mt-32 md:basis-3/5">
          <div className="md:-mt-20">
            <div className="relative">
              <div className="before:absolute before:-top-20 before:-left-20 before:z-[-1] md:before:content-evolvetext">
                <h1 className="text-6xl">
                  Welcome to <div className="pt-2 font-bold text-[#FFDE59]">AidWave</div>
                </h1>
              </div>
            </div>

            <p className="mt-8 text-2xl">
              Shape the future of humanitarian aid with AidWave, a revolutionary decentralized application (dApp) built on transparency and
              community empowerment
            </p>
          </div>

          <div className="mt-8 flex items-center gap-8">
            <button className="btn btn-primary text-[#FFDE59]" onClick={toggleCreateProposalModal}>Create Proposal</button>
            <button className="btn btn-primary text-[#FFDE59]" onClick={toggleSearchProposalModal}>Search Proposals</button>
            <CreateProposal openModal={openCreateProposalModal} closeModal={toggleCreateProposalModal} />
            <SearchProposal openModal={openSearchProposalModal} closeModal={toggleSearchProposalModal} />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
