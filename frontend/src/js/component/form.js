import React, {
  useState,
  useEffect,
  createContext,
  useCallback,
  useContext
} from "react"
import Input from "component/input"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import Chip from "@material-ui/core/Chip"

import Button from "component/button"
import Icon from "component/icon"

import { block, cx } from "style"
const bss = block("form")

const FormContext = createContext({
  onChange: () => {}
})

const useWrapper = Child => ({
  label,
  name,
  required,
  onChange: onChangeOverride,
  ...props
}) => {
  const inputProps = ({ onChange }) => ({
    ...props,
    onChange: e =>
      onChangeOverride
        ? onChangeOverride(e.target.value)
        : onChange({
            label: name || label,
            value: e.target ? e.target.value : e
          }),
    name,
    label
  })

  return (
    <FormControl required={required}>
      <FormContext.Consumer>
        {context => <Child {...inputProps(context)} />}
      </FormContext.Consumer>
    </FormControl>
  )
}

const WrappedInput = useWrapper(({ type, label, ...props }) => (
  <Input
    className={bss("input", { type })}
    type={type}
    placeholder={label}
    {...props}
  />
))

const Checkbox = useWrapper(({ defaultValue, onChange, ...props }) => {
  const [value, setValue] = useState(!!defaultValue)
  useEffect(() => {
    onChange({ target: { value } })
  }, [value])

  return (
    <Chip
      className={bss("checkbox")}
      icon={
        <Icon icon={value ? "CheckCircleOutline" : "RadioButtonUnchecked"} />
      }
      onClick={() => setValue(!value)}
      variant={value ? "default" : "outlined"}
      {...props}
    />
  )
})

const FormSelect = useWrapper(
  ({ label, name, items, defaultValue, onChange, ...props }) => {
    const [value, setValue] = useState(
      defaultValue || (items && items[0].value)
    )

    useEffect(() => {
      onChange({ target: { value } })
    }, [value])

    return [
      label && (
        <InputLabel key="label" id={`form-select-${name}-label`}>
          {label}
        </InputLabel>
      ),
      <Select
        key="select"
        labelId={label && `form-select-${name}-label`}
        size="small"
        margin="dense"
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
    ]
  }
)

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

  const SubmitButton = props =>
    onSave ? <Button type="submit" {...props} /> : <></>

  return (
    <FormContext.Provider
      value={{
        onChange: ({ label, value }) => setField(label, value)
      }}
    >
      <form className={cx(bss(), className)} onSubmit={handleSubmit}>
        {children({
          data,
          setField,
          SubmitButton,
          Input: WrappedInput,
          Select: FormSelect,
          Checkbox
        })}
      </form>
    </FormContext.Provider>
  )
}

export default Form
