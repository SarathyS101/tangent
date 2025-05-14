// import Login from "@/components/Login";
// import { LoginForm } from "@/components/ui/login-form"
// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <LoginForm />
//       </main>
//     </div>
//   );
// }
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/ui/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="/view-tangents"
            className="flex items-center gap-2 font-medium"
          >
            {<i>tan (θ) by Sarathy Selvam</i>}
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block p-2">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover border-8 border-white rounded-lg shadow-lg"
        >
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
