import { ReactNode } from "react"
import { Footer } from "@/components/Footer"
import HomeNavbar from "@/components/HomeNavbar"
import Navbar2 from "@/components/Navbar2"

type PageLayoutProps = {
    children : ReactNode;
}

export function PageLayout({children} : PageLayoutProps) {
    return (
        <div>
            <main>
                <HomeNavbar />
                {/* <Navbar2 /> */}
                {children}
                {/* <Footer /> */}
            </main>
        </div>
    );
}