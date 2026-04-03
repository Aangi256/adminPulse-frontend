export default function StatusStepper({ status }: any) {
  const steps = ["DESIGN", "QC", "PRODUCTION", "ACCOUNT", "DISPATCH"];

  return (
    <div className="flex gap-2">
      {steps.map((step) => (
        <div
          key={step}
          className={`p-2 border ${
            step === status ? "bg-green-500 text-white" : ""
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}