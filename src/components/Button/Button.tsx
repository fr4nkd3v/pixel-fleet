import { type IButtonProps } from './Button.types';

export const Button = ({ text, onClick }: IButtonProps) => {
  return (
    <button
      type='button'
      className={`nes-btn`}
      onClick={onClick}
    >{text}</button>
  )
}