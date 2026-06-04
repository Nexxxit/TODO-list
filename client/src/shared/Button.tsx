import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
    size?: ButtonSize
    variant?: ButtonVariant
}

const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
} as const

const variantClasses = {
    primary:
        'border border-white/20 bg-purple-500/40 text-white backdrop-blur-md shadow-sm ' +
        'hover:bg-purple-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
        'focus-visible:outline-purple-400/50 disabled:opacity-50 disabled:pointer-events-none',
    secondary:
        'border border-white/20 bg-white/10 text-gray-200 backdrop-blur-md ' +
        'hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
        'focus-visible:outline-white/30 disabled:opacity-50 disabled:pointer-events-none',
} as const

const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors cursor-pointer'

const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled, type = 'button', ...rest }: ButtonProps) => {
    const classes = [
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className,
    ]
        .filter(Boolean)
        .join(" ")
    return (
        <button type={type} disabled={disabled} className={classes} {...rest}>
            {children}
        </button>
    )
}

export { Button }
