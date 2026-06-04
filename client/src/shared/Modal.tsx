import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
    onClose: () => void
    children: ReactNode
    modalTitle: string
    className?: string
}

const Modal = ({ onClose, children, modalTitle, className = '' }: ModalProps) => {
    return (
        <div
            className={`fixed inset-0 z-50 flex animate-overlay-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md animate-modal-in rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <h2
                        id="modal-title"
                        className="text-xl font-semibold tracking-tight text-gray-100"
                    >
                        {modalTitle}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Закрыть"
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-gray-300 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-white/30 hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400/50 active:scale-95"
                    >
                        <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </button>
                </div>
                <div className="text-gray-200">{children}</div>
            </div>
        </div>
    )
}

export { Modal }
