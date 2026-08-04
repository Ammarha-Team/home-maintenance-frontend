import { useState } from "react";

export default function Notifications() {
  const [settings, setSettings] = useState({
    orders: true,
    messages: true,
    offers: false,
  });

  const toggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const Item = ({ title, value, onClick }) => (
    <div className="flex items-center justify-between py-4 border-b">
      <span className="font-medium">{title}</span>

      <button
        onClick={onClick}
        className={`w-12 h-6 rounded-full transition ${
          value ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full mt-0.5 transition ${
            value ? "mr-6" : "mr-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-6" dir="rtl">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        الإشعارات
      </h1>

      <div className="bg-white rounded-2xl shadow p-6">

        <Item
          title="إشعارات الطلبات"
          value={settings.orders}
          onClick={() => toggle("orders")}
        />

        <Item
          title="إشعارات الرسائل"
          value={settings.messages}
          onClick={() => toggle("messages")}
        />

        <Item
          title="العروض والخصومات"
          value={settings.offers}
          onClick={() => toggle("offers")}
        />

      </div>
    </div>
  );
}