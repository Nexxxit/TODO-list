import { Button } from "./Button";

type ModalProps = {
    onClose: () => void
    children: React.ReactNode
    modalTitle: string
    className?: string
}

const Modal = ({ onClose, children, modalTitle, className = '' }: ModalProps) => {
    return (
        <div className={className}>
            <div>{modalTitle}</div>
            {children}
            <Button size="sm" variant="primary" onClick={onClose}>
                Закрыть
            </Button>
        </div>
    )
}

export { Modal }