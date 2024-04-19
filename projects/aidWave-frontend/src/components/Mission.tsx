import { SelectedPage } from "../types/navbar";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faEye } from "@fortawesome/free-solid-svg-icons";

type MissionProps = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Mission = ({ setSelectedPage }: MissionProps) => {
  return (
    <section id="mission/vision" className="py-24 min-h-full ">
      <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.MissionVision)} className="mx-auto w-5/6 md:flex">
        <div className="w-full py-8 px-4">
          <div className="max-w-[1240px] mx-auto grid md:grid-cols-2">
            <div className="w-[500px] mx-auto my-4 relative">
              <FontAwesomeIcon icon={faBullseye} className="absolute text-black opacity-35 text-[220px] left-36 top-40 transform -translate-y-1/2" />
              <h1 className="text-4xl text-center font-bold text-[#FFDE59] relative z-10">Mission</h1>
              <p className="mt-8 text-lg relative z-10">
                To revolutionize humanitarian aid allocation by creating a transparent, secure, and decentralized platform where individuals
                can directly participate in directing resources to communities in crisis. We strive to empower communities, foster trust
                through blockchain technology, and ensure that aid reaches those who need it most effectively.
              </p>
            </div>
            <div className="flex flex-col justify-center mt-64 relative">
              <FontAwesomeIcon icon={faEye} className="absolute text-black opacity-35 text-[220px] left-36 top-32 transform -translate-y-1/2" />
              <h1 className="text-4xl text-center font-bold text-[#FFDE59] relative z-10">Vision</h1>
              <p className="mt-8 text-lg relative z-10">
                A world where humanitarian aid reaches those who need it most, guided by the collective wisdom and empowered votes of a
                global community.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Mission;
