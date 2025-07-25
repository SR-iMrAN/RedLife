import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUserPlus, FaSearch, FaTint } from 'react-icons/fa';
import { MdVolunteerActivism, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const fadeUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
  viewport: { once: true },
};

const Home = () => {
  const handleContactSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Message Sent!',
      text: 'We will get back to you shortly.',
      icon: 'success',
      confirmButtonText: 'Okay',
      confirmButtonColor: '#dc2626',
    });
    e.target.reset();
  };

  const handleAlreadyDonor = () => {
    Swal.fire({
      icon: 'info',
      title: 'You are already a donor!',
      confirmButtonColor: '#dc2626',
    });
  };

  return (
    <div className="text-gray-800">
      {/* Banner */}
      <section className="bg-red-100 py-16 px-4 md:px-20 flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.div
          className="space-y-6"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 leading-tight">
            Be a Lifesaver, <br /> Donate Blood Today
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleAlreadyDonor}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition"
            >
              <FaUserPlus /> Join as a Donor
            </button>
            <a
              href="/search"
              className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-red-600 hover:text-white transition"
            >
              <FaSearch /> Search Donors
            </a>
          </div>
        </motion.div>

        {/* Banner Image */}
        <motion.div
          className="md:w-1/2 mt-8 md:mt-0 flex justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <DotLottieReact
            src="https://lottie.host/02f30352-fc0f-461c-ac06-4ca25271784c/XfHlYvXM7r.lottie"
            autoplay
            loop
            style={{ width: '750px', height: 'auto' }}
          />
        </motion.div>
      </section>

      {/* Why Donate Section */}
      <motion.section className="py-16 px-4 md:px-20 bg-white" {...fadeUp}>
        <h2 className="text-3xl font-bold text-center text-red-600 mb-10">Why Donate Blood?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <motion.div className="p-6 bg-red-50 rounded-xl shadow-md hover:shadow-lg transition" {...fadeUp}>
            <FaTint className="text-5xl text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
            <p>Every drop of blood you donate can save up to three lives. Be a hero today.</p>
          </motion.div>

          <motion.div className="p-6 bg-red-50 rounded-xl shadow-md hover:shadow-lg transition" {...fadeUp}>
            <MdVolunteerActivism className="text-5xl text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Build Community</h3>
            <p>Join a network of donors and volunteers making a real difference in local lives.</p>
          </motion.div>

          <motion.div className="p-6 bg-red-50 rounded-xl shadow-md hover:shadow-lg transition" {...fadeUp}>
            <FaSearch className="text-5xl text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Find Nearby Donors</h3>
            <p>Search and connect with available donors instantly in your area.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section className="bg-gray-100 py-16 px-4" id="contact" {...fadeUp}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Contact Info */}
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold text-red-700 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-6">
              Need help or want to collaborate? We’re here to assist you!
            </p>
            <ul className="text-gray-600 text-sm space-y-4">
              <li className="flex items-center gap-2">
                <MdEmail className="text-red-500 text-xl" />
                contact@redlife.org
              </li>
              <li className="flex items-center gap-2">
                <MdPhone className="text-red-500 text-xl" />
                +880-1234-567890
              </li>
              <li className="flex items-center gap-2">
                <MdLocationOn className="text-red-500 text-xl" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleContactSubmit}
            className="bg-white p-6 rounded-xl shadow-md space-y-4"
            {...fadeUp}
          >
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border input input-info rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border input input-success rounded-md"
              required
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 border textarea textarea-warning rounded-md"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 w-full"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
