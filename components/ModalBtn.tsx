import clsx from "clsx";
import React, { ReactNode, useEffect } from "react";

import { useState } from "react";
import Modal from "react-responsive-modal";
import LoadingSpinner from "./LoadingSpinner";

type ModalBtnPropType = {
  btnText: string;
  children: ReactNode;
  bgColor: string;
  isLoading?: boolean;
  isSuccess?: boolean;
};

function ModalBtn({
  btnText,
  children,
  bgColor,
  isLoading,
  isSuccess,
}: ModalBtnPropType) {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    if (isSuccess) {
      onCloseModal();
    }
  }, [isSuccess]);

  return (
    <>
      <button
        className={clsx(
          " text-lg rounded-xl px-6 py-3 font-dm_sans font-bold text-white w-full",
          bgColor
        )}
        onClick={onOpenModal}
      >
        {btnText}
      </button>
      <Modal
        classNames={{
          modal: "modalBox",
        }}
        open={open}
        onClose={onCloseModal}
        center
      >
        {children}
      </Modal>
    </>
  );
}

export default ModalBtn;
