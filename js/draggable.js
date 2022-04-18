const defaultConfig = {
  open: true,
  debug: true,
  animatable: true,
}

export default function draggable($element, config = defaultConfig){
  if(!($element instanceof HTMLElement)){
    return console.warn(`esperababamos un HTML pero llego un ${$element}`)
  }
  let isOpen = config.open
  let isDragging = false
  const elementRect = $element.getBoundingClientRect()
  const ELEMENT_BLOCK_SIZE = elementRect.height
  const $marker = $element.querySelector('[data-marker]')
  const MARKER_BLOCK_SIZE = $marker.getBoundingClientRect().height

  const VISIBLE_Y_POSITION = 0
  const HIDDEN_Y_POSITION = ELEMENT_BLOCK_SIZE - MARKER_BLOCK_SIZE
  let widgetPosition = VISIBLE_Y_POSITION
  isOpen ? open() : close()

  let startY = 0

  $marker.addEventListener('click',handleClick )
  $marker.addEventListener('pointerdown',handlePointerDown )
  $marker.addEventListener('pointerup', handlePointerUp )
  $marker.addEventListener('pointerout', handlePointerOut )
  $marker.addEventListener('pointercancel', handlePointerCancel )
  $marker.addEventListener('pointermove', handlePointerMove )
  if(config.animatable){
    setAnimations()
  }

  function handlePointerCancel(){
    logger('pointercancel')
    dragEnd()
  }

  function handlePointerOut(){
    logger('pointerout')
    dragEnd()
  }

   function handlePointerUp(){
    logger('pointerUp')
    dragEnd()
  }

  function handleClick(event){
    logger('click')
    toggle()
  }

  function handlePointerMove(event){
    logger('pointermove')
    drag(event)
  }

  function handlePointerDown(event){
    logger('pointerdown')
    startDrag(event)
  }

  function pageY(event){
    return event.pageY || event.touches[0].pageY
  }

  function startDrag(event){
    isDragging = true
    startY = pageY(event)
  }

  function setAnimations(){
    $element.style.transition = 'margin-bottom .3s'
  }

  function bounce(){
    if(widgetPosition < ELEMENT_BLOCK_SIZE / 2){
      return open()
    } return close()
  }

  function dragEnd(){
    logger('drag end')
    isDragging = false
    bounce()
  }

  function toggle(){
    if(!isDragging){
      if(!isOpen){
        return open()
      }
      return close()
    }
  }

  function logger(message){
    if(config.debug){
      console.info(message)
    }
  }

  function open(){
    logger('abrir widget')
    isOpen = true
    widgetPosition = VISIBLE_Y_POSITION
    setWidgetPosition(widgetPosition)

  }

  function close(){
    logger('cerrar widget')
    isOpen = false
    widgetPosition = HIDDEN_Y_POSITION
    setWidgetPosition(widgetPosition)

  }

  function setWidgetPosition(value){
    $element.style.marginBottom = `-${value}px`
  }

  function drag(event){
    const cursorY  = pageY(event)
    const movementY = cursorY - startY
    widgetPosition = widgetPosition + movementY
    logger(movementY)
    startY = cursorY
    if(widgetPosition > HIDDEN_Y_POSITION){
      return false
    }
    setWidgetPosition(widgetPosition)
  }

}