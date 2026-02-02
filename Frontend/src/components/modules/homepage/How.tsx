const How = () => {
  return (
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            How <span className="text-orange-500">SkillBridge</span> Works
          </h2>
          <p className="mt-4 text-gray-300">
            Start your learning journey in just a few simple steps
          </p>

          <div className="relative mt-20">
            <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-white/20"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="relative">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center text-3xl">
                  🔍
                </div>

                <span className="absolute -top-2 right-1/2 translate-x-10 bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  1
                </span>

                <h3 className="mt-6 font-semibold text-lg">Find Your Tutor</h3>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Browse through our verified tutors, filter by subject, rating,
                  and availability.
                </p>
              </div>

              <div className="relative">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center text-3xl">
                  📅
                </div>

                <span className="absolute -top-2 right-1/2 translate-x-10 bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  2
                </span>

                <h3 className="mt-6 font-semibold text-lg">Book a Session</h3>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Choose a convenient time slot that works for you. Instant
                  booking, no waiting.
                </p>
              </div>

              <div className="relative">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-purple-500 flex items-center justify-center text-3xl">
                  🎥
                </div>

                <span className="absolute -top-2 right-1/2 translate-x-10 bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  3
                </span>

                <h3 className="mt-6 font-semibold text-lg">Start Learning</h3>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Connect via video call with your tutor. Interactive whiteboard
                  included.
                </p>
              </div>

              <div className="relative">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center text-3xl">
                  🏅
                </div>

                <span className="absolute -top-2 right-1/2 translate-x-10 bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  4
                </span>

                <h3 className="mt-6 font-semibold text-lg">Track Progress</h3>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Monitor your learning journey with detailed progress reports
                  and feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default How;
