type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  };
  
  const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;
  
    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };
  
    return (
      <div
        className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-white p-1 border rounded-lg w-[90%] max-w-[600px] h-auto max-h-[80vh] overflow-hidden flex flex-col">
          {/* 내용 영역 */}
          <div className="flex-1 overflow-hidden">{children}</div>
  
          {/* 닫기 버튼 */}
          <div className="mt-4 flex justify-center sm:justify-end relative z-50 ">
            <button
              onClick={() => { 
                console.log('닫기 버튼 클릭됨');
                onClose();
              }}
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
  