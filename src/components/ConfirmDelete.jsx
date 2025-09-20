export default function ConfirmDelete({ candidateName, onConfirm, onCancel }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
        <div className="rounded-2xl bg-[#333] px-8 py-6 flex flex-col gap-4 w-[300px]">
          <p>Are you sure you want to delete the resume of <strong className="text-red-600 font-bold">"{candidateName}"</strong>?</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl w-full"
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  