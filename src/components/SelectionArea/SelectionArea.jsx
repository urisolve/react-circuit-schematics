import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback
} from 'react'
import { throttle } from 'lodash'

import { areasIntersect } from '../../util'

const defaultArea = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
}

export const SelectionArea = forwardRef(
  (
    {
      getRef,
      selectableItems = [],
      parentRef = window,
      fps = 30,
      style,
      ...rest
    },
    ref
  ) => {
    const selectableAreas = useRef([])
    const parentRect = useRef(null)
    const startPoint = useRef(null)
    const selectionArea = useRef(defaultArea)

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
      parentRect.current = {
        left: left + window.scrollX,
        top: top + window.scrollY,
        width,
        height
      }

      // Calculate the bounding areas of the items
      for (const elem of selectableItems) {
        const rect = getRef(elem.id).current.getBoundingClientRect()
        selectableAreas.current.push({
          id: elem.id,
          left: rect.left + window.scrollX - parentRect.current.left,
          top: rect.top + window.scrollY - parentRect.current.top,
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
      (event) => {
        // Only allow left clicks
        if (event.which !== 1) return

        // Start dragging
        setIsDragging(true)

        // Calculate click point
        startPoint.current = {
          left: event.pageX - parentRect.current.left,
          top: event.pageY - parentRect.current.top
        }

        // Reset the selection area
        selectionArea.current = {
          ...startPoint.current,
          width: 0,
          height: 0
        }

        // Reset set of selected items
        setSelectedItems(new Set())

        // Enable event listeners for drag
        parentRef.current.addEventListener('mousemove', onMouseMove)
        parentRef.current.addEventListener('mouseup', onMouseUp)

        event.preventDefault()
      },
      [setIsDragging, setSelectedItems]
    )

    /**
     * Handler for moving the mouse.
     */
    const onMouseMove = useCallback(
      throttle((event) => {
        // Calculate the current position of mouse
        const endPoint = {
          left: event.pageX - parentRect.current.left,
          top: event.pageY - parentRect.current.top
        }

        // Calculate the selection area
        selectionArea.current = {
          height: Math.abs(endPoint.top - startPoint.current.top),
          width: Math.abs(endPoint.left - startPoint.current.left),
          top:
            endPoint.top - startPoint.current.top > 0
              ? startPoint.current.top
              : endPoint.top,
          left:
            endPoint.left - startPoint.current.left > 0
              ? startPoint.current.left
              : endPoint.left
        }

        // Calculate which elements are being selected
        const items = new Set()
        for (const area of selectableAreas.current)
          if (areasIntersect(area, selectionArea.current)) items.add(area.id)
        setSelectingItems(items)

        event.preventDefault()
      }, 1000 / fps),
      [setSelectingItems, startPoint]
    )

    /**
     * Handler for letting go of mouse1.
     */
    const onMouseUp = useCallback(
      (event) => {
        setIsDragging(false)

        // Apply the selection
        setSelectingItems((items) => {
          setSelectedItems(new Set([...items]))
          return new Set()
        })

        // Remove event listeners while not being used
        parentRef.current.removeEventListener('mousemove', onMouseMove)
        parentRef.current.removeEventListener('mouseup', onMouseUp)

        event.preventDefault()
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
        if (!parentRef.current) return
        parentRef.current.removeEventListener('mousedown', onMouseDown)
      }
    }, [])

    return (
      <div
        ref={ref}
        style={{
          // Non-Editable
          width: selectionArea.current.width ?? 0,
          height: selectionArea.current.height ?? 0,
          position: 'absolute',
          transform: `translate(${selectionArea.current.left ?? 0}px, ${
            selectionArea.current.top ?? 0
          }px)`,
          display: isDragging ? 'inline-block' : 'none',

          // Editable
          backgroundColor: 'rgba(0, 0, 255, 0.25)',
          border: '1px solid rgba(0, 0, 255, 0.75)',
          zIndex: 99,
          ...style
        }}
        {...rest}
      />
    )
  }
)
