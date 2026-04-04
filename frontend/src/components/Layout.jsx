import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, backgroundColor: '#f3f3f3', paddingBottom: '2rem' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
