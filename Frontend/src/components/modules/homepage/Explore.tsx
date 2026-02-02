"use client";

import { useCategories } from "@/hooks/useApi";
import Image from "next/image";

const Explore = () => {
  const { categories, loading, error } = useCategories();
  return (
    <section className="bg-[#F9FAFB] py-[90px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-[36px] font-bold leading-[40px] text-[#131720]">
            Explore <span className="text-[#2B9E9E]">Subjects</span>
          </h2>
          <p className="mt-3 text-[#677e6f] text-[18px] font-normal leading-7 ">
            Choose from a wide variety of subjects taught by expert tutors
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
            <div
              key={category.id}
              className="bg-[#fff] p-6 rounded-xl hover:shadow-card transition-all duration-300 cursor-pointer hover:-translate-y-1"
              style={{ boxShadow: "0 4px 20px -4px #13172014" }}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-4">
                <Image
                  src="/calculator.png"
                  width={24}
                  height={24}
                  alt="Mathematics Icon"
                />
              </div>
              <h3 className="font-semibold text-lg text-[#131720]">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {category.description}
              </p>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Explore;
