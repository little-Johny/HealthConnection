import React from 'react'

export default function MainLayout({children, showFooter = true, containerClass = '', LayoutClass = ''} ) {
    return (
        <div className={`min-h-screen flex flex-col ${LayoutClass}`}>
            <main className={`flex-grow w-full mx-auto ${containerClass}`}>
                {children}
            </main>

            { showFooter && (
                <footer className="bg-gray-900 text-white py-6 ">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm">&copy; 2024 Health Connection. Todos los derechos reservados.</p>
                    </div>
                </footer>
            )}
        </div>
    );
};
