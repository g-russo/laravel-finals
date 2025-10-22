import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
                <i className="bi bi-building text-white text-lg font-bold"></i>
            </div>
            <div className="ml-3 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-orange-600">
                    Paradise Resort
                </span>
                <span className="text-xs text-gray-500 truncate">
                    Luxury Management
                </span>
            </div>
            {/* Bootstrap Icons CDN for sidebar */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            />
        </>
    );
}
