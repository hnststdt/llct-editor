import '@/styles/elements/select.scss'
import React from 'react'

interface SelectComponentProps{
  prefix?: string
  postfix?: string
  items: string[]
  value: string
  onChange: (item: string) => void
}

const SelectComponent = ({
  prefix,
  postfix,
  items,
  value,
  onChange
}: SelectComponentProps) => {
  const onChangeWrapper = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      const target = ev.target as HTMLSelectElement
      onChange(target.options[target.selectedIndex].value)
    }
  }

  return (
    <div
      className={"select"}
    >
      {prefix}
      <select
        onChange={onChangeWrapper}
        defaultValue={value}
      >
        {items.map(item => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          )
        })}
      </select>
      {postfix}
    </div>
  )
}

export default SelectComponent