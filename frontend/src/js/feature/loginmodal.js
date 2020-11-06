import React, { useState, useEffect } from "react"
import Expandable from "component/expandable"
import Dialog from "component/modal"
import Button from "component/button"
import Form from "component/form"
import { useAuthContext } from "component/auth"

import { block } from "style"
const bss = block("loginmodal")

const error_messages = {
  USER_NOT_FOUND: "Email not found",
  BAD_LOGIN: "Username or password incorrect",
  PASS_NO_MATCH: "Passwords do not match",
  DUPLICATE: "Username already exists"
}

const LoginModal = ({ signUp: _signUp, open, onClose }) => {
  const { signIn, signUp } = useAuthContext()
  const [error, setError] = useState()
  const [signingUp, setSigningUp] = useState(_signUp)
  const [pass2, setPass2] = useState()

  useEffect(() => {
    setSigningUp(_signUp)
  }, [_signUp])

  return (
    <Dialog className={bss()} onClose={onClose} open={open}>
      <Form
        className={bss("form")}
        onSave={v => {
          if (signingUp) {
            if (v.pwd !== pass2) setError("PASS_NO_MATCH")
            else signUp(v).catch(e => setError(e.response.data.message))
          } else {
            setError()
            signIn(v.id, v.pwd).catch(e => setError(e.response.data.message))
          }
        }}
      >
        {({ Input, SubmitButton }) => [
          <div className={bss("inputs")} key="inputs">
            <Input label="email" name="id" type="email" required />
            <Input label="password" name="pwd" type="password" required />
            <Expandable expanded={signingUp}>
              <Input
                label="confirm password"
                type="password"
                onChange={setPass2}
              />
              <Input label="username" name="username" />
            </Expandable>
          </div>,
          error && (
            <div className={bss("error")} key="error">
              {error_messages[error]}
            </div>
          ),
          <SubmitButton
            key="submit"
            label={signingUp ? "Sign up" : "Login"}
            outlined
          />,
          <Button
            key="switch_form"
            className={bss("switchform")}
            label={`${signingUp ? "Log in" : "Sign up"} instead`}
            onClick={() => setSigningUp(!signingUp)}
            link
          />
        ]}
      </Form>
    </Dialog>
  )
}

export default LoginModal
