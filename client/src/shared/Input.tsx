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
    "w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 " +
    "transition-colors outline-none " +
    "focus-visible:border-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900/10 " +
    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"

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