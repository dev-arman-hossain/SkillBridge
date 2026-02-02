import Image from "next/image";

const Reviews = () => {
  return (
    <div>
      <div className="w-full bg-[#F9FAFB] py-30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            What Our <span className="text-teal-500">Students</span> Say
          </h2>
          <p className="mt-4 text-gray-500">
            Join thousands of satisfied learners who achieved their goals
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-left">
              <div className="flex items-center gap-4">
                  <Image
                  src="/80.jpg"
                  alt="Tutor"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Emily Johnson</h4>
                  <p className="text-sm text-gray-500">University Student</p>
                </div>
              </div>

              <div className="flex gap-1 mt-4 text-orange-400">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <p className="mt-4 text-gray-600 leading-relaxed">
                "SkillBridge transformed my understanding of calculus. My tutor
                Sarah was patient and explained concepts in ways that finally
                made sense. Went from a C to an A"
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-left">
              <div className="flex items-center gap-4">
             <Image
                  src="/81.jpg"
                  alt="Tutor"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Michael Torres
                  </h4>
                  <p className="text-sm text-gray-500">Software Developer</p>
                </div>
              </div>

              <div className="flex gap-1 mt-4 text-orange-400">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <p className="mt-4 text-gray-600 leading-relaxed">
                "Learning Python for my career switch was daunting until I found
                Alex on SkillBridge. The personalized approach made all the
                difference. Now I'm a junior developer"
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-left">
              <div className="flex items-center gap-4">
                 <Image
                  src="/82.jpg"
                  alt="Tutor"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Sophie Chen</h4>
                  <p className="text-sm text-gray-500">High School Student</p>
                </div>
              </div>

              <div className="flex gap-1 mt-4 text-orange-400">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <p className="mt-4 text-gray-600 leading-relaxed">
                "Preparing for my SATs was stressful, but my SkillBridge tutor
                made it manageable. The flexible scheduling worked perfectly
                with my busy schedule"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
