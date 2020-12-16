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
import Icon from "component/icon"
import Button from "component/button"
import Text from "component/text"
import { useThemeContext } from "feature/theme"

import { block, cx, css, pickFontColor } from "style"
const bss = block("form")

const FormContext = createContext({
  onChange: () => {}
})

const useWrapper = (Child, opts = {}) => ({
  className,
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
        ? onChangeOverride(e.target ? e.target.value : e)
        : onChange({
            label: name || label,
            value: e.target ? e.target.value : e
          }),
    name,
    label
  })

  return opts.noctrl ? (
    <FormContext.Consumer>
      {context => <Child {...inputProps(context)} />}
    </FormContext.Consumer>
  ) : (
    <FormControl required={required} className={className}>
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

export const Checkbox = useWrapper(
  ({ defaultValue, onChange, label, color: _color, bg: _bg, ...props }) => {
    const { theme } = useThemeContext()
    const [value, setValue] = useState(!!defaultValue)
    useEffect(() => {
      onChange({ target: { value } })
    }, [value])

    const bg = _bg || theme.primary
    const color = theme[_color] || _color || theme.primary

    return (
      <label
        tabIndex={0}
        className={cx(
          bss("checkbox"),
          css({
            color: pickFontColor(bg, color, 40),
            "&:hover": {
              backgroundColor: pickFontColor(bg, color, 20)
            },
            "&:hover > *": {
              color: pickFontColor(color, color, 120)
            },
            "& > *": {
              color: pickFontColor(bg, color, 40)
            }
          })
        )}
      >
        <Icon
          className={css({
            color: pickFontColor(color || theme.secondary, bg, 30)
          })}
          icon={value ? "CheckBox" : "CheckBoxOutlineBlank"}
        />
        <Text>{label}</Text>
        <input
          className={css({
            color: pickFontColor(color || theme.secondary, bg)
          })}
          type="checkbox"
          defaultChecked={!!defaultValue}
          onChange={e => setValue(e.target.checked)}
          {...props}
        />
      </label>
    )
  },
  { noctrl: true }
)

const FormCheckbox = useWrapper(Checkbox)

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
  const [data, setData] = useState(_data || {})
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
        {children &&
          children({
            data,
            setField,
            SubmitButton,
            Input: WrappedInput,
            Select: FormSelect,
            Checkbox: FormCheckbox
          })}
      </form>
    </FormContext.Provider>
  )
}

export default Form
