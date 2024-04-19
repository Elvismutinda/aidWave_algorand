import React from "react";
import { motion } from "framer-motion";
import Logo from "../assets/logo.svg";
import { SelectedPage } from "../types/navbar";

type AboutProps = {
  setSelectedPage: (value: SelectedPage) => void;
};

const About = ({ setSelectedPage }: AboutProps) => {
  return (
    <section id="about" className="mx-auto min-h-full w-5/6 pt-24 pb-10">
      <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.About)}>
        <div className="flex mt-8 items-center justify-between gap-20 ">
          <div>
            <div className="relative">
              <div className="">
                <h1 className="text-4xl font-bold text-[#FFDE59]">About Us</h1>
              </div>
            </div>

            <p className="my-5 text-lg">
              AidWave empowers you to directly participate in allocating critical resources. By becoming a registered user, you can:
            </p>
            <ul className="ml-4 list-disc text-lg">
              <li>
                Review verified proposals: Gain insight into the needs of communities around the globe through well-researched and
                transparent proposals.
              </li>
              <li>
                Cast your vote: Have a say in where humanitarian aid goes. Your vote contributes to a collective decision that prioritizes
                the most pressing needs.
              </li>
              <li>Track progress: Witness the impact of your vote as aid reaches the designated locations.</li>
            </ul>
          </div>
          <img src={Logo} alt="about" className="h-10 w-10 mx-auto" />
        </div>
      </motion.div>
    </section>
  );
};

export default About;
