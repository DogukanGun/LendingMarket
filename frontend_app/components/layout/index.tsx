import Footer from "./footer";
import Navbar from "./navbar";

const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) =>{
    return(
        <div className="px-10 min-h-screen">
            <Navbar/>
            {children}
            <Footer/>
        </div>
    )
}

export default Layout;