const StartLearning = () => {
  return (
    <div>
      <div className="w-full bg-[#F9FAFB] pb-24 px-6">
        <div className="container mx-auto px-4 rounded-3xl bg-gradient-to-r from-teal-500 to-cyan-500 py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
            <span>✦</span>
            <span>Start learning today</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Ready to Transform Your Learning <br className="hidden md:block" />
            Journey
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90">
            Join thousands of students who are already achieving their goals
            with SkillBridge. Your first session is on us
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600">
              Get Started Free →
            </button>

            <button className="rounded-xl border border-white/40 px-8 py-4 font-semibold text-white transition hover:bg-white/10">
              Become a Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartLearning;
