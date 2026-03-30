"use client";

export default function WhatsAppCapture() {
  const handleClick = () => {
    const phone = "91XXXXXXXXXX"; // replace
    const message = encodeURIComponent(
      "Hi, I want to grow my coaching institute using GROWCAD"
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium"
    >
      Chat on WhatsApp
    </button>
  );
}