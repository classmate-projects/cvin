import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { cookies } from "next/headers";
import LogoutButton from "@/components/LogoutButton";
import HeaderProfile from "@/components/HeaderProfile";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CViN | Advanced Talent Management",
  description: "A high-performance resume analysis and talent scouting platform.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const isAuthenticated = !!authToken;

  // Simulate currently active users (Dynamically read from session or DB in production)
  const activeSessions = isAuthenticated ? [{ id: 'admin', name: 'Administrator', role: 'System Admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=00845a&color=fff' }] : [];

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-[#00845a]/10 selection:text-[#00845a] dark:selection:bg-[#00845a]/30 bg-[#f8fafc] dark:bg-[#0a0a0a] text-slate-800 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>

          {isAuthenticated ? (
            <div className="flex h-screen overflow-hidden">
              {/* Main Navigation Sidebar */}
              <Sidebar />

              {/* Core Application Content Area */}
              <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-white dark:bg-[#111111] border-b border-slate-100/50 dark:border-white/5 sticky top-0 z-30 transition-colors duration-300">
                  <div className="flex items-center gap-2 pl-12 lg:pl-0">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest truncate">Dashboard Overview</span>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6">
                    <Link href={"/profile"}>
                      <HeaderProfile />
                    </Link>
                    <div className="w-px h-6 bg-slate-100 dark:bg-white/10 hidden md:block"></div>
                    <ThemeToggle />
                    {/* <button className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-2 text-xl" title="Notifications">🔔</button> */}
                    <LogoutButton />
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 md:px-8 md:py-8 bg-[#f8fafc] dark:bg-[#0a0a0a] transition-colors duration-300">
                  {children}
                </div>

                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar={true}
                  newestOnTop={true}
                  transition={Zoom}
                  pauseOnHover={true}
                  theme="colored"
                />
              </main>
            </div>
          ) : (
            // Full Screen Authenticated Space Wrapper
            <main className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#0a0a0a] transition-colors duration-300">
              {children}
              <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={true}
                transition={Zoom}
                pauseOnHover={true}
                theme="colored"
              />
            </main>
          )}

        </ThemeProvider>
      </body>
    </html>
  );
}
