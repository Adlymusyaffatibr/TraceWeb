export default function AuthLayout({ children }: { children: React.ReactNode }) {
    // Polosan aja bro, nggak ada Navbar atau Sidebar
    return <div className="auth-layout-container">{children}</div>;
}
