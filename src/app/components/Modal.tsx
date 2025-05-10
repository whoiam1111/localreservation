type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    content: { verses: string; book_name: string; chapter_number: number; date_used: string } | null;
};

const Modal = ({ isOpen, onClose, content }: ModalProps) => {
    // 모달이 열려있고 내용이 있을 때만 렌더링
    if (!isOpen || !content) return null;

    // 모달 외부 클릭 시 모달 닫기
    const handleBackdropClick = (e: React.MouseEvent) => {
        // 배경 부분만 클릭되었을 때 모달을 닫도록 처리
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 flex justify-center items-center bg-grey bg-opacity-50 backdrop-blur-sm z-50"
            onClick={handleBackdropClick} // 배경 클릭 시 모달 닫기
        >
            <div className="bg-white p-6 border rounded-lg max-w-sm w-full sm:max-w-md sm:w-96">
                <h2 className="text-xl font-bold text-center sm:text-left">
                    {content.book_name} {content.chapter_number}장
                </h2>
                <p className="mt-4 text-base sm:text-lg">{content.verses}</p>
                <p className="mt-4 text-sm text-gray-500">성구 날짜: {content.date_used}</p>
                <div className="mt-6 flex justify-center sm:justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
