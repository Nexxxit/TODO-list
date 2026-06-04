import type { InputHTMLAttributes } from "react"

type InputSize = 'sm' | 'md' | 'lg'
type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
    inputSize?: InputSize
}

const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-5 py-2.5 text-lg rounded-lg',
} as const

const baseClasses =
    "w-full rounded-lg border border-white/20 bg-white/5 text-gray-100 placeholder:text-gray-500 " +
    "backdrop-blur-md transition-colors outline-none " +
    "focus-visible:border-purple-400/50 focus-visible:ring-2 focus-visible:ring-purple-500/20 " +
    "disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-gray-500"

const Input = ({ type = 'text', inputSize = 'md', className = '', disabled, ...rest }: InputProps) => {
    const classes = [
        baseClasses,
        sizeClasses[inputSize],
        className,
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <input type={type} className={classes} disabled={disabled} {...rest} />
    )
}

export { Input }
