"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  sendSMS,
  sendWhatsApp,
} from "@/modules/communication/api";
import Button from "@/components/ui/Button";

// 🔥 OPTIONAL: Replace with real hook later
const useFeatureAccess = () => {
  return {
    whatsapp: true, // change based on plan
  };
};

export default function CommunicationPage() {
  const access = useFeatureAccess();

  // ✅ STATE
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<
    "sms" | "whatsapp"
  >("sms");

  // ✅ LIMIT UI (dummy for now)
  const used = 80;
  const limit = 100;

  // ✅ MUTATIONS
  const smsMutation = useMutation({
    mutationFn: sendSMS,
  });

  const waMutation = useMutation({
    mutationFn: sendWhatsApp,
  });

  // ✅ SEND HANDLER
  const handleSend = () => {
    if (!phone.trim()) {
      alert("Phone required");
      return;
    }

    if (!message.trim()) {
      alert("Message required");
      return;
    }

    if (channel === "sms") {
      smsMutation.mutate({ phone, message });
    } else {
      if (!access.whatsapp) {
        alert("Upgrade to use WhatsApp");
        return;
      }

      waMutation.mutate({ phone, message });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h2 className="text-xl font-semibold">
        Communication
      </h2>

      {/* 🔥 LIMIT INFO */}
      <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
        <p className="text-sm text-yellow-400">
          Usage: {used} / {limit}
        </p>
      </div>

      {/* 🔥 CHANNEL SELECT */}
      <select
        value={channel}
        onChange={(e) =>
          setChannel(
            e.target.value as "sms" | "whatsapp"
          )
        }
        className="p-2 border border-white/10 rounded-xl bg-white/5 w-full"
      >
        <option value="sms">SMS</option>
        <option value="whatsapp">WhatsApp</option>
      </select>

      {/* 🔥 PHONE INPUT */}
      <input
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
        className="p-2 border border-white/10 rounded-xl bg-white/5 w-full"
      />

      {/* 🔥 MESSAGE INPUT */}
      <textarea
        placeholder="Enter message"
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        className="p-2 border border-white/10 rounded-xl bg-white/5 w-full"
        rows={4}
      />

      {/* 🔥 SEND BUTTON */}
      <Button
        onClick={handleSend}
        loading={
          smsMutation.isPending ||
          waMutation.isPending
        }
      >
        Send Message
      </Button>

      {/* 🔥 SUCCESS / ERROR STATES */}
      {smsMutation.isSuccess && (
        <p className="text-green-400 text-sm">
          SMS sent successfully ✅
        </p>
      )}

      {waMutation.isSuccess && (
        <p className="text-green-400 text-sm">
          WhatsApp sent successfully ✅
        </p>
      )}

      {(smsMutation.isError ||
        waMutation.isError) && (
        <p className="text-red-400 text-sm">
          Failed to send message ❌
        </p>
      )}
    </div>
  );
}