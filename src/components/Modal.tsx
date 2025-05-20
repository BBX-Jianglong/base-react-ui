import {
  ReactElement,
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type ModalProps = {
  width?: string;
  children: ReactElement;
};
export type ModalProp = {
  openModal: () => void;
  closeModal: () => void;
};
type ModalContextType = {
  closeModal: () => void;
};
const ModalContext = createContext<ModalContextType>({
  /**
   * モーダル閉じる
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  closeModal() {},
});
/**
 *
 */
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('');
  }
  return context;
};
/**
 * モーダルコンポーネント
 */
const Modal = forwardRef(({ width = '1000px', children }: ModalProps, ref) => {
  const [openModalFlg, setOpenModalFlg] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  /**
   * モーダルオープン
   */
  const openModal = () => {
    setOpenModalFlg(true);
  };
  /**
   * モーダル閉じる
   */
  const closeModal = () => {
    setOpenModalFlg(false);
  };
  useImperativeHandle(ref, () => ({
    /**
     * モーダルオープン
     */
    openModal: () => openModal(),
    /**
     * モーダルオープン
     */
    closeModal: () => closeModal(),
  }));
  useLayoutEffect(() => {
    if (openModalFlg) {
      modalRef.current?.showModal();
    }
  }, [openModalFlg]);
  const modalContext = useMemo(
    () => ({
      /**
       * モーダル閉じる
       */
      closeModal: () => {
        setOpenModalFlg(false);
      },
    }),
    []
  );
  if (openModalFlg) {
    return (
      <dialog className="modal" ref={modalRef}>
        <ModalContext.Provider value={modalContext}>
          <div className="modal__inner" style={{ width }}>
            {children}
          </div>
        </ModalContext.Provider>
      </dialog>
    );
  }
  return null;
});
export default Modal;
