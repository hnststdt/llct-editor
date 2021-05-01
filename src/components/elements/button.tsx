import '@/styles/elements/button.scss'

interface ButtonComponentProps {
  text?: string
  theme?: string
  onClick: () => void
  children?: unknown
}

const ButtonComponent = ({
  text,
  theme,
  onClick,
  children
}: ButtonComponentProps) => {
  return (
    <div className={['button', theme].join(' ')} onClick={onClick}>
      {text && <span className='text'>{text}</span>}
      {children}
    </div>
  )
}

export default ButtonComponent
