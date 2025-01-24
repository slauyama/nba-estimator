import React, { useState } from "react";

export function useDialogControl() {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return { open, close, isOpen };
}

interface DialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}
export function Dialog({ children, isOpen, onClose }: DialogProps) {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`fixed inset-0 bg-gray-500/75 transition-opacity ${
          isOpen
            ? "ease-out duration-300 opacity-100"
            : "ease-in duration-200 opacity-0 invisible"
        }`}
        aria-hidden="true"
      ></div>
      <div
        className={`fixed inset-0 z-10 w-screen overflow-y-auto ${
          isOpen ? "" : "invisible"
        }`}
        onClick={onClose}
      >
        <div className="flex min-h-full justify-center text-center items-center p-0">
          <div
            className={`relative transform overflow-hidden rounded-lg bg-gray-700 text-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg ${
              isOpen
                ? "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100"
                : "ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
