import Image from "next/image";
import Link from "next/link";

export const Banner = () => {
  return (
    <div>
      <div className="py-[120px] container mx-auto flex items-center justify-between">
        <div className="">
          <h4 className="py-2 bg-[#2B9E9C] inline-block px-4 rounded-[50px] text-[14px] font-medium text-[#070707]">
            Trusted by 10,000+ learners worldwide
          </h4>

          <div className="py-6 w-[600px]">
            <h1 className="text-[60px] text-[#131720] font-extrabold text-foreground leading-tight ">
              Learn Anything from
              <span className="text-[#2B9E9C]">Expert Tutors</span> Worldwide
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx auto lg:mx-0 mb-8">
            Connect with verified tutors, book sessions instantly, and achieve
            your learning goals. Personalized education at your fingertips.
          </p>
          <button className="bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600 transition">
            <Link href="#">Find Tutors Now</Link>
          </button>
          <button className="ml-4 bg-white text-teal-500 border border-teal-500 px-6 py-3 rounded-xl hover:bg-teal-50 transition">
            <Link href="#">Watch Demo</Link>
          </button>
        </div>
        <div className="">
          <div className="">
            <Image
              className="rounded-full border-4"
              src="/banner.jpg"
              alt="banner"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
