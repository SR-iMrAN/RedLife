import { useState, useContext, useEffect } from "react";
import {
  FaHeart,
  FaHandHoldingUsd,
  FaPlusCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,FaDonate, 
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { renderToStaticMarkup } from "react-dom/server";
import StripeWrapper from "../components/StripeWrapper";
import { AuthContext } from "../provider/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 5;

const Fundingpage = () => {
  const [amount, setAmount] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fundings, setFundings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();


  useEffect(() => {
    axiosSecure
      .get("/fundings")
      .then((res) => setFundings(res.data))
      .catch((err) => console.error("Failed to fetch fundings:", err));
  }, [axiosSecure]);


  const handleRequest = async () => {
    const fundData = {
      userName: user.displayName,
      email: user.email,
      amount: parseFloat(amount),
      date: new Date(),
    };

    try {
      const res = await axiosSecure.post("/fundings", fundData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Thank you!",
          text: "Your donation has been successfully received.",
        });
        setAmount("");
        setShowPayment(false);
        setShowForm(false);
        setCurrentPage(1);

        // Refresh fundings table
        const updated = await axiosSecure.get("/fundings");
        setFundings(updated.data);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while saving your donation.",
      });
    }
  };

  // Confirm before payment
  const confirmPayment = async () => {
    const result = await Swal.fire({
      title: renderToStaticMarkup(
        <FaCreditCard style={{ color: "#22c55e", fontSize: "48px" }} />
      ),
      html: "<p>Are you sure you want to proceed with the payment?</p>",
      showCancelButton: true,
      confirmButtonText:
        renderToStaticMarkup(<FaCheckCircle />) + " Yes, pay now",
      cancelButtonText: renderToStaticMarkup(<FaTimesCircle />) + " Cancel",
      focusConfirm: false,
      customClass: {
        popup: "swal2-dark",
      },
    });

    return result.isConfirmed;
  };

 
  const handlePaymentRequest = async () => {
    const confirmed = await confirmPayment();
    if (confirmed) {
      await handleRequest();
    } else {
  
      setShowPayment(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(fundings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFundings = fundings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 mt-8 bg-white rounded-xl shadow-lg">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-md mb-6 shadow flex items-start gap-3">
  <FaDonate className="text-3xl mt-1 text-red-500 animate-bounce" />
  <div>
    <p className="text-lg font-semibold flex items-center gap-2">
      
      Your generosity saves lives<FaHeart className="text-red-500" />
    </p>
    <p className="text-sm text-gray-700">
      Every dollar you donate brings us closer to ensuring no one has to wait for blood in a moment of crisis.
      Together, we can create a future where every heartbeat is protected. Thank you for standing with <span className="text-sm font-bold"><span className="text-red-600">Red</span><span className="text-green-600">Life</span></span>.
    </p>
  </div>
</div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaHeart className="text-red-500 animate-pulse" /> All Fundings
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <FaPlusCircle /> Give Fund <GiMoneyStack />
        </button>
      </div>
{/* Motivational Message */}

      {/* Donation Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-10">
          <label className="block text-lg font-medium mb-2 text-gray-700">
            <FaHandHoldingUsd className="inline mr-2 text-green-600" />
            Donation Amount ( $ USD)
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount e.g. 25 (Minimum $1)"
            className="input input-bordered w-full mb-4"
            min="1"
            required
          />

          {!showPayment && amount > 0 && (
            <button
              onClick={() => setShowPayment(true)}
              className="btn btn-success w-full text-white tracking-wide"
            >
              Proceed to Secure Payment
            </button>
          )}

          {showPayment && (
            <div className="mt-6">
              <StripeWrapper
                amount={parseFloat(amount)}
                handleRequest={handlePaymentRequest}
              />
            </div>
          )}
        </div>
      )}

      {/* Funding Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-red-100 text-red-600">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Amount ( $ USD)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentFundings.length > 0 ? (
              currentFundings.map((fund, index) => (
                <tr key={fund._id} className="hover">
                  <td>{startIndex + index + 1}</td>
                  <td>{fund.userName}</td>
                  <td>
                    {
                      fund.email.replace(/^(.{3})(.*)@.*(\..*)$/, (_, first, rest, tld) =>
  `${first}${"*".repeat(rest.length)}@***${tld}`
                    )}
                  </td>
                  <td>${fund.amount.toFixed(2)}</td>
                  <td>{new Date(fund.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No donations found yet.
                </td>
              </tr>
            )}
          </tbody>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <tfoot>
              <tr>
                <td colSpan="5" className="text-center space-x-2 py-4">
                  <button
                    className="btn btn-sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm ${
                        currentPage === i + 1 ? "btn-primary" : ""
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default Fundingpage;
