import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full bg-blue-600 p-4">
            <ul className="flex justify-center space-x-6">
                <li>
                    <Link href="/">
                        <a className="text-white font-bold">Home</a>
                    </Link>
                </li>
                <li>
                    <Link href="/login">
                        <a className="text-white font-bold">Login</a>
                    </Link>
                </li>
                <li>
                    <Link href="/generate">
                        <a className="text-white font-bold">Generate</a>
                    </Link>
                </li>
                <li>
                    <Link href="/mystories">
                        <a className="text-white font-bold">My Stories</a>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
