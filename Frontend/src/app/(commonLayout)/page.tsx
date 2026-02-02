import Explore from "@/components/modules/homepage/Explore";
import { Banner } from "../../components/modules/homepage/Banner";
import Featured_Tutor from "@/components/modules/homepage/Featured_Tutor";
import How from "@/components/modules/homepage/How";
import Footer from "@/components/modules/homepage/Footer";
import Reviews from "@/components/modules/homepage/Reviews";
import StartLearning from "@/components/modules/homepage/StartLearning";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();

  console.log(cookieStore.toString());

  const res = await fetch("http://localhost:5000/api/auth/get-session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store"
  });

  const session = await res.json();

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
