import { useState } from "react";
import TechnicianNavbar from "../../../shared/components/TechnicianNavbar";
import Footer from "../../../shared/components/Footer";

import ServiceStats from "../components/ServiceStats";
import ServiceFilter from "../components/ServiceFilter";
import ServiceCard from "../components/ServiceCard";


const initialServices = [
  {
    id: 1,
    image:
      "https://njom-alkhalij.net/wp-content/uploads/2024/02/00cf78dd20d71f6c4b461236f4b54fdf.jpg",
    title: "تسريب مفاجئ في المطبخ",
    description: "يوجد تسريب مياه قوي تحت الحوض يحتاج إلى إصلاح...",
    price: 450,
    status: "المجدولة",
    location: "المعادي",
    time: "12 د",
    imagesCount: 3,
  },

  {
    id: 2,
    image:
      "https://demo.bravisthemes.com/fixera/wp-content/uploads/2024/03/img-sv-1-600x400.webp",
    title: "تصليح تكييف",
    description: "التكييف لا يعمل ويحتاج إلى صيانة.",
    price: 300,
    status: "قيد الانتظار",
    location: "مدينة نصر",
    time: "20 د",
    imagesCount: 2,
  },

  {
    id: 3,
    image:
      "https://5.imimg.com/data5/CW/JD/MQ/SELLER-6160261/electrical-installation-services-500x500.jpg",
    title: "صيانة كهرباء",
    description: "يوجد عطل في لوحة الكهرباء.",
    price: 600,
    status: "مقبول",
    location: "المهندسين",
    time: "15 د",
    imagesCount: 4,
  },

  {
    id: 4,
    image:
      "https://www.nojomcon.com/images/blog/plumping.webp",
    title: "إصلاح سباكة",
    description: "تغيير ماسورة مياه.",
    price: 500,
    status: "معلقة",
    location: "الجيزة",
    time: "30 د",
    imagesCount: 1,
  },
];

export default function Services() {

const [services, setServices] = useState(initialServices);
const [selectedService, setSelectedService] = useState(null);
const [activeFilter, setActiveFilter] = useState("الكل");


  const handleDelete = (id) => {
    setServices((prev) =>
      prev.filter((service) => service.id !== id)
    );
  };


  const handleEdit = (service) => {
    setSelectedService(service);
  };


  const handleSaveEdit = () => {
    setServices((prev) =>
      prev.map((item) =>
        item.id === selectedService.id
          ? selectedService
          : item
      )
    );

    setSelectedService(null);
  };

  const filteredServices = services.filter((service) => {
  if (activeFilter === "الكل") return true;

 return service.status === activeFilter;
});

  return (
    <>
      <TechnicianNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">

        <ServiceStats
          totalOffers={services.length}
          acceptedOffers={
            services.filter(
              (item) => item.status === "مقبول"
            ).length
          }
          pendingOffers={
            services.filter(
              (item) => item.status === "قيد الانتظار"
            ).length
          }
        />


       <ServiceFilter
  active={activeFilter}
  setActive={setActiveFilter}
/>


       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6" dir="rtl">

          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
              onDelete={() => handleDelete(service.id)}
              onEdit={() => handleEdit(service)}
            />
          ))}

        </div>


        {/* المودال هنا قبل قفل main */}

        {selectedService && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-6 w-[400px]">

              <h2 className="text-xl font-bold mb-5 text-right">
                تعديل العرض
              </h2>


              <input
                className="w-full border rounded-xl p-3 mb-3 text-right"
                value={selectedService.title}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    title: e.target.value,
                  })
                }
              />


              <input
                className="w-full border rounded-xl p-3 mb-3 text-right"
                value={selectedService.price}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    price: e.target.value,
                  })
                }
              />


              <div className="flex gap-3">

                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 border rounded-xl py-2"
                >
                  إلغاء
                </button>


                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white rounded-xl py-2"
                >
                  حفظ
                </button>

              </div>

            </div>

          </div>
        )}


      </main>

      <Footer />
    </>
  );
}
