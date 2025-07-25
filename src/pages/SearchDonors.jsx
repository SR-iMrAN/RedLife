import React, { useState, useEffect } from 'react';
import { FaSearchLocation, FaTint, FaMapMarkerAlt, FaMapMarkedAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Swal from 'sweetalert2';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SearchDonor = () => {
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
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold text-red-700 mb-4">Find a Blood Donor</h2>
            <p className="text-gray-600 mb-6">Search for a donor by selecting the required blood group and location.</p>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold"><FaTint className="inline mr-2 text-red-600" />Blood Group</label>
                <select name="bloodGroup" value={filters.bloodGroup} onChange={handleChange} className="select select-bordered w-full">
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold"><FaMapMarkerAlt className="inline mr-2 text-blue-600" />District</label>
                <select name="district" value={filters.district} onChange={handleChange} className="select select-bordered w-full">
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold"><FaMapMarkedAlt className="inline mr-2 text-green-600" />Upazila</label>
                <select name="upazila" value={filters.upazila} onChange={handleChange} className="select select-bordered w-full">
                  <option value="">Select Upazila</option>
                  {availableUpazilas.map((u, i) => <option key={i} value={u}>{u}</option>)}
                </select>
              </div>

              <button onClick={handleSearch} className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2">
                <FaSearchLocation /> Search Donors
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <DotLottieReact
              src="https://lottie.host/e592b08a-a7a6-4aa5-b1ab-42a96be57f0e/RIXdQ7Jk3P.lottie"
              loop
              autoplay
              style={{ width: '100%', maxWidth: 400 }}

            />
             <p className="text-lg font-semibold mt-4 text-gray-600">Sorry, No donor found</p>
          </motion.div>
          
        </div>

        {/* Result Section */}
        {searched && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Search Results</h3>
            {donors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full table-zebra border">
                  <thead className="bg-red-100 text-red-800">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Blood Group</th>
                      <th>Location</th>
                      <th>Photo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{donor.name}</td>
                        <td className="font-bold text-red-600">{donor.bloodGroup}</td>
                        <td>{donor.upazila}, {donor.district}</td>
                        <td>
                          <img src={donor.photoURL} alt={donor.name} className="w-10 h-10 rounded-full" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No donors found for this criteria.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchDonor;
