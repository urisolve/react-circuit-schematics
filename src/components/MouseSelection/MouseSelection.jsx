import React from 'react'
import { useSelectionContainer } from 'react-drag-to-select'

export const MouseSelection = ({ eventsElement, onSelectionChange, style }) => {
  const { DragSelection } = useSelectionContainer({
    eventsElement,
    onSelectionChange,
    selectionProps: { style }
  })

  return <DragSelection />
}
