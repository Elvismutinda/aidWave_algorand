import Logo from "../assets/logo.svg";
import { SelectedPage } from "../types/navbar";
import { motion } from "framer-motion";

type FooterProps = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Footer = ({ setSelectedPage }: FooterProps) => {
  return (
    <footer id="contactus" className="py-16 bg-[#116F89]">
      <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.ContactUs)}>
        <div className="mx-auto justify-between w-5/6 gap-16 md:flex">
          <div className="mt-16 basis-1/2 md:mt-0">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="logo" className="w-10 h-10" />
              <h1 className="text-3xl font-bold text-[#FFDE59]">AidWave</h1>
            </div>
            <p className="my-5">Vote for Change, Shape the Future: Your Voice Matters in Humanitarian Assistance.</p>
            <p>© 2024 AidWave. All rights reserved.</p>
          </div>
          <div className="mt-16 basis-1/4 md:mt-0">
            <h4 className="font-bold">Find Us At</h4>
            <p className="mt-5">69, Kanairo Avenue, Nairobi CBD, Nairobi, Kenya</p>
          </div>
          <div className="mt-16 basis-1/4 md:mt-0">
            <h4 className="font-bold">Contact Us</h4>
            <p className="mt-5 mb-2">aidwave-support@gmail.com</p>
            <p>+254 712 345678</p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
