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
        <div className="bg-white p-6 border rounded-lg max-w-full w-full ">
          {children}
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
  