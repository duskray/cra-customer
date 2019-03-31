import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Rate = ({
  value = 0,
  onClick = () => { },
}) => {
  const iconStyleChecked = { width: 24, height: 24, paddingRight: 5, color:'#D0AD7A' }
  const iconStyle = { width: 24, height: 24, paddingRight: 5, color:'#d8d8d8' }

  const starts = []
  for (let i = 1;i <= 5; i++) {
    if (i <= value) {
      starts.push(<FontAwesomeIcon key={'faStar' + i} icon="star" style={iconStyleChecked} onClick={e => onClick(i)} />)
    } else {
      starts.push(<FontAwesomeIcon key={'farStar' + i} icon="star" style={iconStyle} onClick={e => onClick(i)} />)
    }
    
  }

  return (
    <div>
        {
          starts
        }
    </div>
  )
}

export default Rate