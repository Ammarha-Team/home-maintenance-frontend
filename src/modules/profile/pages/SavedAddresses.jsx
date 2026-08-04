import { useState } from "react";
import { MapPin, Pencil, Trash2, Plus, X } from "lucide-react";

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "المنزل",
      city: "القاهرة - مدينة نصر",
      address: "شارع عباس العقاد",
    },
    {
      id: 2,
      title: "العمل",
      city: "القاهرة - التجمع الخامس",
      address: "شارع التسعين الشمالي",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    address: "",
  });

  const openAddModal = () => {
    setEditingId(null);

    setFormData({
      title: "",
      city: "",
      address: "",
    });

    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);

    setFormData({
      title: item.title,
      city: item.city,
      address: item.address,
    });

    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("هل تريد حذف هذا العنوان؟")) {
      setAddresses(addresses.filter((item) => item.id !== id));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (
      !formData.title ||
      !formData.city ||
      !formData.address
    ) {
      alert("يرجى إدخال جميع البيانات");
      return;
    }

    if (editingId) {
      setAddresses(
        addresses.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formData,
              }
            : item
        )
      );
    } else {
      setAddresses([
        ...addresses,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setShowModal(false);

    setEditingId(null);

    setFormData({
      title: "",
      city: "",
      address: "",
    });
  };

  return (
    <div
      className="max-w-3xl mx-auto py-10 px-6"
      dir="rtl"
    >
      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        العناوين المحفوظة
      </h1>

      <div className="space-y-5">
        {addresses.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="text-blue-600" />
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    {item.title}
                  </h2>

                  <p className="text-gray-600">
                    {item.city}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {item.address}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(item)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={openAddModal}
          className="w-full border-2 border-dashed border-blue-300 rounded-2xl py-5 text-blue-600 font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
        >
          <Plus />

          إضافة عنوان جديد
        </button>

        {showModal && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40"></div>

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between p-5 border-b">
                  <button
                    onClick={() => setShowModal(false)}
                  >
                    <X />
                  </button>

                  <h2 className="font-bold text-xl">
                    {editingId
                      ? "تعديل العنوان"
                      : "إضافة عنوان جديد"}
                  </h2>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="block mb-2">
                      اسم العنوان
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="المنزل"
                      className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">
                      المدينة
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="القاهرة"
                      className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                                    <div>
                    <label className="block mb-2">
                      العنوان بالتفصيل
                    </label>

                    <textarea
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="اكتب العنوان بالتفصيل"
                      className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">

                    <button
                      onClick={handleSave}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                      {editingId ? "حفظ التعديلات" : "إضافة العنوان"}
                    </button>

                    <button
                      onClick={() => {
                        setShowModal(false);

                        setEditingId(null);

                        setFormData({
                          title: "",
                          city: "",
                          address: "",
                        });
                      }}
                      className="flex-1 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold transition"
                    >
                      إلغاء
                    </button>

                  </div>

                </div>
              </div>
            </div>
          </>
        )}

        {addresses.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-14 text-center">

            <MapPin
              size={40}
              className="mx-auto text-gray-300 mb-4"
            />

            <h3 className="text-lg font-semibold text-gray-700">
              لا توجد عناوين محفوظة
            </h3>

            <p className="text-gray-500 mt-2">
              اضغط على "إضافة عنوان جديد" لإضافة أول عنوان.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}