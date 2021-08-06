import React, { useRef } from 'react'
import styles from './Label.module.css'

const setContentEditable = (ref, val) => {
  ref.current.contentEditable = val
}

export const DefaultLabel = (props) => {
  const nameRef = useRef()
  const valueRef = useRef()

  return (
    <b>
      <div
        ref={nameRef}
        className={styles.editable}
        onInput={(e) => props.onNameChange(e.currentTarget.textContent)}
        // Content-Editable
        onDoubleClick={() => setContentEditable(nameRef, !props.disabled)}
        onBlur={() => setContentEditable(nameRef, false)}
        suppressContentEditableWarning
      >
        {props.name}
      </div>

      {props.value && props.unit && (
        <>
          {' = '}
          <div
            ref={valueRef}
            className={styles.editable}
            onBlur={() => setContentEditable(valueRef, false)}
            // Content-Editable
            onDoubleClick={() => setContentEditable(valueRef, true)}
            onInput={(e) => props.onValueChange(e.currentTarget.textContent)}
            suppressContentEditableWarning
          >
            {props.value}
          </div>
          {' ' + props.unit}
        </>
      )}
    </b>
  )
}
