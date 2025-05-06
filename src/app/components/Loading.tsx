export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-600 mx-auto mb-4"></div>
                <span className="text-xl font-semibold text-gray-700">로딩중...</span>
            </div>
        </div>
    );
}
