import { Button } from "./Button";

type ModalProps = {
    onClose: () => void
    children: React.ReactNode
    modalTitle: string
    className?: string
}

const Modal = ({ onClose, children, modalTitle, className = '' }: ModalProps) => {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/5 ${className}`}>
            <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
                <div>{modalTitle}</div>
                {children}
                <Button size="sm" variant="primary" onClick={onClose}>
                    Закрыть
                </Button>
            </div>
        </div>
    )
}

export { Modal }