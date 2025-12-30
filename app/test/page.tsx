"use client";

export default function TestPage() {
    const timestamp = new Date().toISOString();

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-500">
            <div className="text-center p-12 bg-white rounded-lg shadow-2xl">
                <h1 className="text-6xl font-black text-red-600 mb-4">
                    🔴 TEST PAGE 🔴
                </h1>
                <p className="text-2xl font-bold text-black mb-2">
                    Server Build Time: {timestamp}
                </p>
                <p className="text-xl text-gray-600">
                    If you see this page, the server IS delivering new code!
                </p>
                <div className="mt-8 p-4 bg-green-100 border-4 border-green-500 rounded">
                    <p className="text-lg font-bold text-green-800">
                        ✅ NEW CODE IS WORKING
                    </p>
                </div>
            </div>
        </div>
    );
}
