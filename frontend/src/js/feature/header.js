import React from "react"
import Button from "component/button"

import Container from "@material-ui/core/Container"
import { block } from "style"

const bss = block("header")

const Header = () => (
  <div className={bss()}>
    <Container className={bss("inner")} maxWidth="sm">
      <Button className={bss("button")} label="Home" to="/" />
      <Button
        className={bss("button")}
        label="Clients"
        to="/clients"
        disabled
      />
      <Button className={bss("button")} label="Categories" to="/categories" />
      <Button className={bss("button")} label="Office" to="/office" disabled />
    </Container>
  </div>
)

export default Header
