"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";

type Props = { isPro: boolean };

const SubscriptionButton = ({ isPro }: Props) => {
  const [loading, setLoading] = useState(false);
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      disabled={loading}
      onClick={handleSubscription}
      className="px-6 py-3 font-bold text-white transition-colors duration-200 bg-purple-600 rounded-lg shadow-xl hover:bg-purple-800"
    >
      {isPro ? "Manage Subscriptions" : "Get Pro"}
    </Button>
  );
};

export default SubscriptionButton;
