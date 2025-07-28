import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosSecure";
import { AuthContext } from "../provider/AuthProvider";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, handleRequest }) => {
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const axios = useAxiosPublic();

  useEffect(() => {
    if (amount > 0) {
      axios
        .post("/create-payment-intent", {
          amount,
          user: { name: user.displayName, email: user.email },
        })
        .then(({ data }) => setClientSecret(data.clientSecret));
    }
  }, [amount, axios, user, user.displayName, user.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: result.error.message,
      });
    } else if (result.paymentIntent.status === "succeeded") {
      await handleRequest(); 
      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: "Thank you for your donation.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        className="border p-3 rounded-md mb-4"
        options={{ style: { base: { fontSize: "16px" } } }}
      />
      <button
        className="btn btn-success w-full"
        type="submit"
        disabled={!stripe || !clientSecret}
      >
        Pay ${amount}
      </button>
    </form>
  );
};

const StripeWrapper = ({ amount, handleRequest }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm handleRequest={handleRequest} amount={amount} />
  </Elements>
);

export default StripeWrapper;
