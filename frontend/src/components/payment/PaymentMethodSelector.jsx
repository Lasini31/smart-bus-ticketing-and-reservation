// src/components/payment/PaymentMethodSelector.jsx

const methods = [
  { id: "visa", label: "Visa", logo: "/icons/visa.svg" },
  { id: "paypal", label: "PayPal", logo: "/icons/paypal.svg" },
  { id: "mastercard", label: "Mastercard", logo: "/icons/mastercard.svg" },
  { id: "gpay", label: "Google Pay", logo: "/icons/gpay.svg" },
];

export default function PaymentMethodSelector({ selected, setSelectedMethod, errors }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Payment methods</h2>
      <div className="flex flex-wrap gap-3">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-label={m.label}
            onClick={() => setSelectedMethod(m.id)}
            className={`flex items-center justify-center px-4 py-2 rounded-full border-2 transition-all duration-150 bg-white
              ${selected === m.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-400"
              }`}
            style={{ minWidth: "72px", height: "42px" }}
          >
            <img src={m.logo} alt={m.label} style={{ height: "36px", objectFit: "contain" }} />
          </button>
        ))}
      </div>
      {errors?.selectedMethod && (
        <p className="text-red-500 text-xs mt-2">{errors.selectedMethod}</p>
      )}
    </div>
  );
}