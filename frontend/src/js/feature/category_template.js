import React, { useState, useEffect } from "react"

import Form from "component/form"
import Card from "component/card"
import Button from "component/button"
import ConfirmDialog from "component/modal/confirm"
import * as apiCategoryT from "api/category_template"
import { block } from "style"

const bss = block("category_template")

const CategoryTemplate = ({ data }) => {
  const [api_data, update] = apiCategoryT.useUpdate(data)
  const [delFieldConfirm, setDelFieldConfirm] = useState()

  useEffect(() => {
    console.log(api_data)
  }, [api_data])

  return (
    <Card className={bss()}>
      <Form
        className={bss("form")}
        data={api_data}
        onSave={v =>
          update(v)
            .then(r => console.log(r, v))
            .catch(console.error)
        }
      >
        {({
          data: { name, fields },
          setField,
          SubmitButton,
          Input,
          Select
        }) => [
          <div className={bss("form_inputs")} key="inputs">
            <Input
              placeholder="Name"
              name="name"
              type="text"
              defaultValue={name}
            />
            <div className={bss("separator")} />

            <div className={bss("separator")} />
            <div className={bss("fields")}>
              {fields &&
                fields.map((field, f) => (
                  <div className={bss("field")} key={f}>
                    <Input
                      required
                      placeholder="Field name"
                      type="text"
                      defaultValue={field.name}
                      onChange={v => (field.name = v)}
                    />
                    <Select
                      required
                      items={[
                        { value: "bool", label: "Checkbox" },
                        { value: "str", label: "Text" },
                        { value: "num", label: "Number" },
                        { value: "event", label: "Event" }
                      ]}
                      onChange={v => (field.type = v)}
                    />
                    <Button
                      icon="Close"
                      onClick={() => setDelFieldConfirm(f)}
                    />
                    {f === delFieldConfirm && (
                      <ConfirmDialog
                        open={true}
                        prompt={`Delete field '${field.name}'?`}
                        onYes={() => {
                          setField(
                            "fields",
                            fields.filter((fld, i) => setDelFieldConfirm === i)
                          )
                          setDelFieldConfirm()
                        }}
                        onNo={setDelFieldConfirm}
                        onClose={setDelFieldConfirm}
                      />
                    )}
                  </div>
                ))}
              <Button
                icon="Add"
                label="Field"
                iconPlacement="left"
                onClick={() => setField("fields", [...fields, {}])}
              />
            </div>
          </div>,
          <div className={bss("form_buttons")} key="buttons">
            <SubmitButton />
            <Button
              icon="Delete"
              onClick={() => {
                /* are you sure? */
              }}
            />
          </div>
        ]}
      </Form>
    </Card>
  )
}

export default CategoryTemplate
