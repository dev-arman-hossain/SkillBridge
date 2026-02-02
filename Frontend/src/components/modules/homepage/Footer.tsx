const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white">
                🎓
              </div>
              <span className="text-xl font-semibold text-white">
                SkillBridge
              </span>
            </div>

            <p className="mt-4 max-w-sm text-gray-400 leading-relaxed">
              Connecting learners with expert tutors worldwide. Personalized
              education for everyone.
            </p>

            <div className="mt-6 flex items-center gap-3 text-gray-400">
              <span>✉️</span>
              <span>hello@skillbridge.com</span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Platform</h4>
            <ul className="space-y-3">
              <li>Find Tutors</li>
              <li>Become a Tutor</li>
              <li>How It Works</li>
              <li>Pricing</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Subjects</h4>
            <ul className="space-y-3">
              <li>Mathematics</li>
              <li>Languages</li>
              <li>Sciences</li>
              <li>Programming</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Company</h4>
            <ul className="space-y-3">
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8">
          <p className="text-sm text-gray-500">
            © 2026 SkillBridge. All rights reserved.
          </p>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              f
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              t
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              i
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              in
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
