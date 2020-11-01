import React, {
  useState,
  useEffect,
  createContext,
  useCallback,
  useContext
} from "react"
import Chip from "@material-ui/core/Chip"
import TextField from "@material-ui/core/TextField"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"

import Button from "component/button"

import { block, cx } from "style"
const bss = block("form")

const FormContext = createContext({
  onChange: () => {}
})

const Input = ({
  label,
  type,
  name,
  onChange: onChangeOverride,
  required,
  ...props
}) => (
  <FormContext.Consumer>
    {({ onChange }) => (
      <TextField
        required={required}
        className={bss("input", { type })}
        label={label}
        size="small"
        margin="dense"
        name={name}
        onChange={e =>
          onChangeOverride
            ? onChangeOverride(e.target.value)
            : onChange({ label: name || label, value: e.target.value })
        }
        {...props}
      />
    )}
  </FormContext.Consumer>
)

const FormSelect = ({
  label,
  name,
  items,
  defaultValue,
  onChange: onChangeOverride,
  required,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue || (items && items[0].value))
  const { onChange } = useContext(FormContext)
  useEffect(() => {
    onChangeOverride
      ? onChangeOverride(value)
      : onChange({ label: name || label, value })
  }, [value])
  return (
    <FormControl required={required}>
      {label && (
        <InputLabel id={`form-select-${name}-label`}>{label}</InputLabel>
      )}
      <Select
        labelId={label && `form-select-${name}-label`}
        size="small"
        margin="dense"
        name={name}
        value={value}
        onChange={e => setValue(e.target.value)}
        {...props}
      >
        {items &&
          items.map(item => (
            <MenuItem value={item.value} key={item.value}>
              {item.label || item.value}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  )
}

const Form = ({ data: _data, children, onSave, onChange, className }) => {
  const [data, setData] = useState(_data)
  useEffect(() => {
    if (onChange) onChange(data)
  }, [data])

  const handleSubmit = e => {
    onSave && onSave(data)
    e.preventDefault()
  }

  const setField = useCallback((label, value) =>
    setData({ ...data, [label]: value })
  )

  const SubmitButton = () => onSave && <Button type="submit" icon="Save" />

  return (
    <FormContext.Provider
      value={{
        onChange: ({ label, value }) => setField(label, value)
      }}
    >
      <form className={cx(bss(), className)} onSubmit={handleSubmit}>
        {children({ data, setField, SubmitButton, Input, Select: FormSelect })}
      </form>
    </FormContext.Provider>
  )
}

export default Form
