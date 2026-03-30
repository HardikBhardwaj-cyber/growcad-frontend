"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [institute, setInstitute] = useState("");

  const handleSubmit = () => {
    console.log({ name, institute });
    window.location.href = "/dashboard";
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Your Name"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />

      <Input
        placeholder="Institute Name"
        value={institute}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInstitute(e.target.value)
        }
      />

      <Button onClick={handleSubmit}>
        Continue
      </Button>
    </div>
  );
}