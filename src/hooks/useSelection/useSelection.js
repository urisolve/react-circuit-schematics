import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef
} from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'

import { areasIntersect } from '../../util'

/**
 * A React Hook that aids with the selection of HTML elements.
 *
 * @param {Function} getRef A function that allows you to retrieve the refs of
 * components based on their id. See `use-dynamic-refs` hook for more info.
 * @param {Array} selectableItems A list of all the possible selectable items.
 * @param {Ref} parentRef A reference to the event element.
 * @param {Number} fps How many frames per second the dragging should have.
 */
export const useSelection = (
  getRef,
  selectableItems = [],
  parentRef = window,
  fps = 30
) => {
  const selectionArea = useRef({ left: 0, top: 0, width: 0, height: 0 })
  const selectableAreas = useRef([])
  const parentRect = useRef()

  const [isDragging, setIsDragging] = useState(false)
  const [selectingItems, setSelectingItems] = useState(new Set())
  const [selectedItems, setSelectedItems] = useState(new Set())

  /**
   * Calculate the areas of the elements
   */
  useEffect(() => {
    // Calculate the bounding area of the parent element
    const { left, top, width, height } =
      parentRef.current.getBoundingClientRect()
    parentRect.current = { left, top, width, height }

    // Calculate the bounding areas of the items
    for (const elem of selectableItems) {
      const rect = getRef(elem.id).current.getBoundingClientRect()
      selectableAreas.current.push({
        id: elem.id,
        left: rect.left - parentRect.current.left,
        top: rect.top - parentRect.current.top,
        width: rect.width,
        height: rect.height
      })
    }
  }, [getRef])

  /**
   * Apply the appropriate class to the items.
   */
  useEffect(() => {
    // Items being selected
    for (const id of selectingItems) {
      const elem = getRef(id).current
      elem.classList.add('selecting')
      elem.classList.remove('selected')
    }

    // Items already selected
    for (const id of selectedItems) {
      const elem = getRef(id).current
      elem.classList.add('selected')
      elem.classList.remove('selecting')
    }
  }, [selectingItems, selectedItems, getRef])

  /**
   * Handler for pressing left mouse button.
   */
  const onMouseDown = useCallback(
    (e) => {
      // Only allow left clicks
      if (e.which !== 1) return

      // Start selection
      setIsDragging(true)
      setSelectedItems(new Set())
      selectionArea.current = {
        left: e.clientX - parentRect.current.left,
        top: e.clientY - parentRect.current.top,
        width: 0,
        height: 0
      }

      // Enable event listeners for drag
      parentRef.current.addEventListener('mousemove', onMouseMove)
      parentRef.current.addEventListener('mouseup', onMouseUp)

      e.preventDefault()
    },
    [setIsDragging, setSelectedItems]
  )

  /**
   * Handler for moving the mouse.
   */
  const onMouseMove = useCallback(
    throttle((e) => {
      // Calculate the selected area
      selectionArea.current.width =
        e.clientX - parentRect.current.left - selectionArea.current.left
      selectionArea.current.height =
        e.clientY - parentRect.current.top - selectionArea.current.top

      // Calculate which elements are being selected
      const items = new Set()
      for (const area of selectableAreas.current)
        if (areasIntersect(selectionArea.current, area)) items.add(area.id)
      setSelectingItems(items)

      e.preventDefault()
    }, 1000 / fps),
    [isDragging, setSelectingItems]
  )

  /**
   * Handler for letting go of mouse1.
   */
  const onMouseUp = useCallback(
    (e) => {
      // End selection flags
      setIsDragging(false)

      // Apply the selection
      setSelectingItems((items) => {
        setSelectedItems(new Set([...items]))
        return new Set()
      })

      // Remove event listeners while not being used
      parentRef.current.removeEventListener('mousemove', onMouseMove)
      parentRef.current.removeEventListener('mouseup', onMouseUp)

      e.preventDefault()
    },
    [setIsDragging, setSelectedItems, setSelectingItems]
  )

  /**
   * Apply the event listener for clicking the mouse.
   */
  useEffect(() => {
    if (!parentRef.current) return
    parentRef.current.addEventListener('mousedown', onMouseDown)

    return () => {
      parentRef.current.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  /**
   * Component for displaying the Selection Area.
   * @component
   */
  const SelectionArea = forwardRef(({ style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          ...selectionArea.current,
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 255, 0.25)',
          border: '1px solid rgba(0, 0, 255, 0.75)',
          ...style
        }}
        {...rest}
      />
    )
  })

  SelectionArea.propTypes = {
    /**
     * Custom style for the selection area. Unexpected behaviour might happen
     * if you change 'position', 'left', 'top', 'width', or 'height'.
     */
    style: PropTypes.object
  }

  return SelectionArea
}
