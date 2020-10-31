import React, { useState, useEffect } from "react"

import MenuButton from "component/menubutton"
import Button from "component/button"
import Border from "component/border"
import User from "feature/user"

import { block } from "style"

const bss = block("patient_editor")

const PatientEditor = () => (
  <div className={bss()}>
    <div className={bss("header")}>
      <User data={{ name: "Bob Mann", color: "#607D8B" }} size="large" />
      <div className={bss("header_right")}>
        <div className={bss("header_top")}>
          <MenuButton
            closeOnSelect
            label="Action"
            items={[
              { label: "this", onClick: () => console.log("this") },
              { label: "that", onClick: () => console.log("that") }
            ]}
          />
        </div>
        <Border className={bss("header_bottom")} label="Add">
          <Button icon="Search" />
          <Button label="Allergy" outlined />
        </Border>
      </div>
    </div>
  </div>
)

export default PatientEditor
