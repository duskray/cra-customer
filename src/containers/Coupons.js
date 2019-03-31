import React, { Component } from 'react'
import DRListView from 'components/DRListView'
import styles from './Coupons.module.scss'
import api from '../api'

class Coupons extends Component {
  state = {

  }

  componentDidMount() {

  }

  getter = async (pageSize, pageIndex) => {
    return await api.getUserCoupon({
      pageSize,
      pageIndex,
    })
  }

  renderRow = (rowData, sectionID, rowID) => {
    return (
      <div key={rowData.id} className={styles.coupon}>
        <div style={{ width: '30%' }}>
          <div className={styles.couponWorth}><span>{rowData.value}</span>元</div>
          <div style={{ color: 'var(--text-black-color)' }}>优惠券</div>
        </div>
        <div style={{ width: '70%', padding: '18px 0', boxSizing: 'border-box' }}>
          <div className={styles.couponTitle}>{rowData.name}<span>{rowData.invalid === 1 ? '即将到期' : ''}</span></div>
          <ul className={styles.couponDetail}>
            {
              rowData.desc ? <li>{rowData.desc}</li> : ''
            }
            <li>有效期至 {rowData.endTime}</li>
          </ul>
        </div>
      </div>
    )
  }


  render() {
    return (
      <div style={{ padding: 15 }}>
        <DRListView ref={el => this.drListView = el} getter={this.getter} renderRow={this.renderRow} listName="coupons" />
      </div>
    )
  }
}

export default Coupons