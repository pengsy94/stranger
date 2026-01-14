export default function Loading() {
    return (
        <div className="fixed inset-0 bg-background backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
                {/* 加载动画 */}
                <div className="inline-block relative w-20 h-20">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-(--button-background) rounded-full animate-spin border-t-transparent"></div>
                </div>

                {/* 加载文字 */}
                <p className="mt-4 text-gray-600 font-medium">加载中...</p>
            </div>
        </div>
    )
}