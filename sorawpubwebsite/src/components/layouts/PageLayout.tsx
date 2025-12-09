import { ReactNode } from "react"
import HomeNavbar from "@/components/HomeNavbar"
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