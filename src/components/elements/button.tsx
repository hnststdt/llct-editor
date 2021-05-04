import '@/styles/elements/button.scss'
import React from 'react'

interface ButtonComponentProps extends React.AllHTMLAttributes<HTMLDivElement> {
  text?: string
  theme?: string
  onClick: () => void
  onRightClick?: () => void
  children?: React.ReactNode
}

const ButtonComponent = ({
  text,
  theme,
  onClick,
  onRightClick,
  children,
  ...props
}: ButtonComponentProps) => {
  const rightClickHandler = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (onRightClick) {
      ev.preventDefault()
      onRightClick()
    }
  }

  return (
    <div
      className={['button', theme].join(' ')}
      onClick={onClick}
      onContextMenu={rightClickHandler}
      {...props}
    >
      {text && <span className='text'>{text}</span>}
      {children}
    </div>
  )
}

export default ButtonComponent
