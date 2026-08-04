import logo from "../../../assets/logo.png";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6" dir="rtl">

      <div className="bg-white rounded-2xl shadow p-8 text-center">

        <img
          src={logo}
          alt="logo"
          className="w-28 mx-auto mb-5"
        />

        <h1 className="text-3xl font-bold text-blue-600">
          عمرها
        </h1>

        <p className="mt-5 text-gray-600 leading-8">
          تطبيق يربط العملاء بفنيين متخصصين في خدمات الصيانة
          المنزلية بطريقة سهلة وآمنة وسريعة.
        </p>

        <div className="mt-8 text-gray-500">
          Version 1.0.0
        </div>

      </div>

    </div>
  );
}