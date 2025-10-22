import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-orange-100 bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-sm px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 shadow-sm">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-colors" />
                <div className="h-6 w-px bg-orange-200"></div>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <div className="hidden md:flex items-center text-sm text-gray-500">
                    <i className="bi bi-clock mr-1 text-orange-500"></i>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </div>
            {/* Bootstrap Icons for header */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            />
        </header>
    );
}
