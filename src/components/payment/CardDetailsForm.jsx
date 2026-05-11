// src/components/payment/CardDetailsForm.jsx

const inputBase =
  "w-full border-2 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 bg-white transition-colors";
const inputOk  = "border-gray-200";
const inputErr = "border-red-400 focus:ring-red-400";

const Label = ({ children }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{children}</label>
);

const ErrorMsg = ({ msg }) =>
  msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;

// ── formatters ──────────────────────────────────────────
const fmtCardNumber = (v) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const fmtExpiry = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};

export default function CardDetailsForm({
  cardName, setCardName,
  cardNumber, setCardNumber,
  expiry, setExpiry,
  cvc, setCvc,
  errors,
}) {
  const handleCardNumber = (e) => setCardNumber(fmtCardNumber(e.target.value));
  const handleExpiry    = (e) => setExpiry(fmtExpiry(e.target.value));
  const handleCvc       = (e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4));

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Card details</h2>
      <div className="flex flex-col gap-4">

        {/* Cardholder name */}
        <div>
          <Label>Cardholder's name</Label>
          <input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Seen on your card"
            className={`${inputBase} ${errors?.cardName ? inputErr : inputOk}`}
          />
          <ErrorMsg msg={errors?.cardName} />
        </div>

        {/* Card number */}
        <div>
          <Label>Card number</Label>
          <input
            value={cardNumber}
            onChange={handleCardNumber}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
            className={`${inputBase} ${errors?.cardNumber ? inputErr : inputOk}`}
          />
          <ErrorMsg msg={errors?.cardNumber} />
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Expiry</Label>
            <input
              value={expiry}
              onChange={handleExpiry}
              placeholder="MM/YY"
              inputMode="numeric"
              maxLength={5}
              className={`${inputBase} ${errors?.expiry ? inputErr : inputOk}`}
            />
            <ErrorMsg msg={errors?.expiry} />
          </div>
          <div>
            <Label>CVC</Label>
            <input
              value={cvc}
              onChange={handleCvc}
              placeholder="123"
              inputMode="numeric"
              maxLength={4}
              className={`${inputBase} ${errors?.cvc ? inputErr : inputOk}`}
            />
            <ErrorMsg msg={errors?.cvc} />
          </div>
        </div>

      </div>
    </div>
  );
}