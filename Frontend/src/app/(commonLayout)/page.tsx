import Explore from "@/components/modules/homepage/Explore";
import { Banner } from "../../components/modules/homepage/Banner";
import Featured_Tutor from "@/components/modules/homepage/Featured_Tutor";
import How from "@/components/modules/homepage/How";
import Footer from "@/components/modules/homepage/Footer";
import Reviews from "@/components/modules/homepage/Reviews";
import StartLearning from "@/components/modules/homepage/StartLearning";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default async function Home() {
  const cookieStore = await cookies();

  let session: unknown = null;
  try {
    const res = await fetch(`${API_BASE}/auth/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });
    session = await res.json();
  } catch {
    // Backend unreachable (e.g. on Vercel without API); render page without session
  }

  return (
    <div>
      <Banner />
      <Explore />
      <Featured_Tutor />
      <How />
      <Reviews />
      <StartLearning />
      <Footer />
    </div>
  );
}
