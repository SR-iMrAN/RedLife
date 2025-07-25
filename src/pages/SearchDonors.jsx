import React, { useState, useEffect } from 'react';
import { FaSearchLocation, FaTint, FaMapMarkerAlt, FaMapMarkedAlt, FaHome,FaEnvelope,FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SearchDonor = () => {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [upazilasData, setUpazilasData] = useState([]);
  const [availableUpazilas, setAvailableUpazilas] = useState([]);

  const [filters, setFilters] = useState({
    bloodGroup: '',
    district: '',
    upazila: '',
  });

  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const d = await fetch('/assets/districts.json').then(res => res.json());
        const u = await fetch('/assets/upazilas.json').then(res => res.json());
        setDistricts(d);
        setUpazilasData(u);
      } catch (error) {
        Swal.fire('Error loading location data');
      }
    };
    fetchLocationData();
  }, []);

  useEffect(() => {
    if (filters.district) {
      const selectedDistrict = districts.find(d => d.name === filters.district);
      const upz = upazilasData.filter(u => parseInt(u.district_id) === parseInt(selectedDistrict?.id));
      setAvailableUpazilas(upz.map(u => u.name));
      setFilters(prev => ({ ...prev, upazila: '' }));
    } else {
      setAvailableUpazilas([]);
    }
  }, [filters.district, districts, upazilasData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (!filters.bloodGroup || !filters.district || !filters.upazila) {
      return Swal.fire({ icon: 'error', title: 'Please select all fields' });
    }

    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:3004/donors?${query}`);
      const data = await res.json();
      setDonors(data);
      setSearched(true);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Failed to fetch donors' });
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-red-700 mb-4">Find a Blood Donor</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">Search for a donor by selecting the required blood group and location.</p>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-sm">
                  <FaTint className="inline mr-2 text-red-600" />
                  Blood Group
                </label>
                <select name="bloodGroup" value={filters.bloodGroup} onChange={handleChange} className="select select-bordered w-full text-sm">
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-sm">
                  <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                  District
                </label>
                <select name="district" value={filters.district} onChange={handleChange} className="select select-bordered w-full text-sm">
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-sm">
                  <FaMapMarkedAlt className="inline mr-2 text-green-600" />
                  Upazila
                </label>
                <select name="upazila" value={filters.upazila} onChange={handleChange} className="select select-bordered w-full text-sm">
                  <option value="">Select Upazila</option>
                  {availableUpazilas.map((u, i) => <option key={i} value={u}>{u}</option>)}
                </select>
              </div>

              <button onClick={handleSearch} className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2 text-sm md:text-base">
                <FaSearchLocation /> Search Donors
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center">
            <DotLottieReact
              src="https://lottie.host/e592b08a-a7a6-4aa5-b1ab-42a96be57f0e/RIXdQ7Jk3P.lottie"
              loop
              autoplay
              style={{ width: '100%', maxWidth: 400 }}
            />
            {!searched && (
              <p className="text-sm md:text-lg font-semibold mt-4 text-gray-600">Please select options and search to find a donor.</p>
            )}
            {searched && donors.length === 0 && (
              <p className="text-sm md:text-lg font-semibold mt-4 text-red-500">Sorry, no donor found.</p>
            )}
            <div className="mt-6 w-full flex justify-center">
              <button
                onClick={() => navigate('/')}
                className="flex gap-2 items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-5 md:py-3 rounded-md transition text-sm md:text-base"
              >
                <FaHome size={18} />
                Home
              </button>
            </div>
          </motion.div>
        </div>

        {/* Result Section */}
{searched && donors.length > 0 && (
  <div className="mt-12">
    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Search Results</h3>

    {/* Table View for md+ */}
    <div className="hidden md:block overflow-x-auto">
  <table className="min-w-full table-auto border-collapse table-zebra border text-sm md:text-base">
    <thead className="bg-red-100 text-red-800">
      <tr>
        <th className="px-4 py-2 text-left">#</th>
        <th className="px-4 py-2 text-left">Name</th>
        <th className="px-4 py-2 text-left">Blood Group</th>
        <th className="px-4 py-2 text-left">Location</th>
        <th className="px-4 py-2 text-left">Photo</th>
        <th className="px-4 py-2 text-left">Email</th>
      </tr>
    </thead>
    <tbody>
      {donors.map((donor, i) => (
        <tr key={i} className="border-t">
          <td className="px-4 py-2">{i + 1}</td>
          <td className="px-4 py-2">{donor.name}</td>
          <td className="px-4 py-2 font-bold text-red-600">{donor.bloodGroup}</td>
          <td className="px-4 py-2">{donor.upazila}, {donor.district}</td>
          <td className="px-4 py-2">
            <img src={donor.photoURL} alt={donor.name} className="w-10 h-10 rounded-full" />
          </td>
          <td className="px-4 py-2">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${donor.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {donor.email}
            </a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    
    {/* Card View for mobile only */}
<div className="md:hidden space-y-4">
  {donors.map((donor, i) => (
    <div key={i} className="border rounded-lg p-4 shadow-md bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-red-700 font-semibold text-base">
          <FaUser /> {donor.name}
        </div>
        <div className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1">
          <FaTint /> {donor.bloodGroup}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
        <FaMapMarkerAlt className="text-green-600" />
        <span>{donor.upazila}, {donor.district}</span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <img src={donor.photoURL} alt={donor.name} className="w-12 h-12 rounded-full" />
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${donor.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
        >
          <FaEnvelope /> {donor.email}
        </a>
      </div>
    </div>
  ))}
</div>

  </div>
)}

      </div>
    </section>
  );
};

export default SearchDonor;
