import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaTint,
  FaEye,
  FaReact,
} from 'react-icons/fa';
import { Cardio } from 'ldrs/react'
import 'ldrs/react/Cardio.css'

// Default values shown

const getShuffleInitial = () => ({
  opacity: 0,
  scale: 0.5,
  rotate: (Math.random() - 0.5) * 60,
  x: (Math.random() - 0.5) * 100,
  y: (Math.random() - 0.5) * 100,
});

const PublicDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['public-donation-requests'],
    queryFn: async () => {
      const res = await axiosSecure.get('/bloodrequests/all');
      return res.data;
    },
  });

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === 'pending'),
    [requests]
  );

  const totalPages = Math.ceil(pendingRequests.length / itemsPerPage);

  const paginatedData = useMemo(
    () =>
      pendingRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [pendingRequests, currentPage]
  );

  const columns = useMemo(
    () => [
      {
        header: 'Recipient',
        accessorKey: 'recipientName',
      },
      {
        header: 'Location',
        cell: ({ row }) =>
          `${row.original.recipientDistrict}, ${row.original.recipientUpazila}`,
      },
      {
        header: 'Date',
        accessorKey: 'donationDate',
      },
      {
        header: 'Time',
        accessorKey: 'donationTime',
      },
      {
        header: 'Blood Group',
        accessorKey: 'bloodGroup',
        cell: ({ getValue }) => (
          <span className="font-bold text-red-600">{getValue()}</span>
        ),
      },
      {
        header: 'Action',
        cell: ({ row }) => (
          <Link
            to={`/donation-request/${row.original._id}`}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            View
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="flex items-center justify-center text-4xl font-extrabold mb-8 text-red-700 tracking-wide select-none gap-3">
        <FaReact className="text-red-700" />
        Blood Donation Requests (Pending Only)
      </h2>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading... <span><Cardio
  size="50"
  stroke="4"
  speed="2"
  color="black" 
/></span> </p>
      ) : paginatedData.length === 0 ? (
        <p className="text-center text-gray-600">No pending donation requests found.</p>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid gap-6 md:hidden">
            {/* SVG Clip Path */}
            <svg width="0" height="0">
              <defs>
                <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
                  <path d="M0,0.1 C0.25,0.2 0.75,0 1,0.1 L1,1 C0.75,0.9 0.25,1 0,1 Z" />
                </clipPath>
              </defs>
            </svg>

            <AnimatePresence>
              {paginatedData.map((req, index) => (
                <motion.div
                  key={req._id}
                  initial={getShuffleInitial()}
                  animate={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 18,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="relative text-black p-6 select-none overflow-hidden shadow-lg"
                >
                  {/* Clipped Card */}
                  <div
                    style={{ clipPath: 'url(#waveClip)' }}
                    className="bg-white p-6 pt-12 rounded-lg relative z-10 flex flex-col gap-4"
                  >
                    {/* Animated Red Stroke */}
                    <motion.svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 z-0 w-full h-full"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: [0, 200, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <motion.path
                        d="M0,10 C25,20 75,0 100,10 L100,100 C75,90 25,100 0,100 Z"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="1"
                        strokeDasharray="200"
                      />
                    </motion.svg>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-red-600 font-semibold text-lg">Recipient Name:</h3>
                        <p className="font-medium">{req.recipientName}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <h3 className="text-red-600 font-semibold text-lg flex items-center gap-1">
                          <FaMapMarkerAlt />
                          Location:
                        </h3>
                        <p className="font-medium">{req.recipientDistrict}, {req.recipientUpazila}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <h3 className="text-red-600 font-semibold text-lg flex items-center gap-1">
                          <FaCalendarAlt />
                          Date:
                        </h3>
                        <p className="font-medium">{req.donationDate}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <h3 className="text-red-600 font-semibold text-lg flex items-center gap-1">
                          <FaClock />
                          Time:
                        </h3>
                        <p className="font-medium">{req.donationTime}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <h3 className="text-red-600 font-semibold text-lg flex items-center gap-1">
                          <FaTint />
                          Blood Group:
                        </h3>
                        <p className="font-bold text-xl">{req.bloodGroup}</p>
                      </div>

                      <div className="mt-4 flex justify-center">
                        <Link
                          to={`/donation-request/${req._id}`}
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
                        >
                          <FaEye size={20} />
                          View Request
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Table view for larger screens */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-[700px] w-full text-sm table-auto">
              <thead className="bg-red-200 text-red-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-3 text-left uppercase whitespace-nowrap"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-red-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 whitespace-nowrap text-black">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-4 py-1 rounded-md border text-sm font-semibold transition
                  ${
                    num === currentPage
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-transparent text-red-700 border-red-400 hover:bg-red-700 hover:text-white'
                  }
                `}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PublicDonationRequests;
