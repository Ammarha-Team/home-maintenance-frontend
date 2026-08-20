import RequestServiceForm from "./RequestServiceForm";

export default function RequestServiceModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
    >
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <RequestServiceForm onClose={onClose} />
      </div>
    </div>
  );
}
