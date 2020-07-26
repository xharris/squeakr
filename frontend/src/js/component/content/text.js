import React from "react"
import TextInput from "component/textinput"

const View = ({ value }) => <div>{value}</div>

const Edit = ({ value, onChange }) => (
  <TextInput onChange={onChange} defaultValue={value} />
)

export default Text = { View, Edit }
