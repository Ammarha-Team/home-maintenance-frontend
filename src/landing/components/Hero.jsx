export default function Hero(){

return(

<section 
dir="rtl"
className="bg-white py-16"
>

<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">


{/* Text */}

<div>

<div className="
inline-flex
items-center
gap-2
bg-blue-50
text-blue-600
px-5
py-2
rounded-full
text-sm
mb-6
">

🔧
صيانة منزلية بمقاييس عالمية

</div>


<h1 className="
text-5xl
font-bold
leading-tight
text-gray-900
">

صيانة منزلك أصبحت أسهل
<br/>

وأسرع مع 
<span className="text-blue-600">
 عَمرها
</span>

</h1>



<p className="
text-gray-500
mt-6
text-lg
leading-8
">

اختر أفضل الفنيين المعتمدين لخدمات
الصيانة المنزلية للأجهزة والكهرباء
والسباكة بضغطة زر واحدة.

</p>



<div className="flex gap-4 mt-8">


<button
className="
bg-blue-600
text-white
px-8
py-3
rounded-xl
font-semibold
"
>

طلب خدمة

</button>



<button
className="
border
border-blue-500
text-blue-600
px-8
py-3
rounded-xl
font-semibold
"
>

استكشف خدماتنا

</button>


</div>


</div>



{/* Image */}


<div className="relative flex justify-center">


<img

src="/images/hero.png"

className="
w-[420px]
rounded-2xl
shadow-xl
"

/>



{/* Cards */}


<div className="
absolute
top-8
right-0
bg-white
shadow-lg
rounded-xl
px-4
py-3
flex
items-center
gap-2
text-sm
">

🟠

فني محترف

</div>




<div className="
absolute
bottom-10
left-0
bg-white
shadow-lg
rounded-xl
px-4
py-3
text-sm
">

⭐ تقييم 4.9

</div>



<div className="
absolute
top-1/2
right-0
bg-white
shadow-lg
rounded-xl
px-4
py-3
text-sm
">

⏱ سرعة الحجز

</div>


</div>


</div>


</section>

)

}