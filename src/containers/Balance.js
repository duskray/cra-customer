import React, { Component } from 'react'
import { List, Tabs } from 'antd-mobile'
import withUser from 'components/withUser'
import DRListView from 'components/DRListView'
import styles from './Balance.module.scss'
import api from '../api';

const Item = List.Item
const Brief = Item.Brief
const tabs = [
  { title: <div style={{fontSize:17,fontWeight:'bold'}}>消费明细</div> },
  { title: <div style={{fontSize:17,fontWeight:'bold'}}>充值明细</div> },
]

class Balance extends Component {
  state = {
    charge: [],
    consume: [],
  }

  componentDidMount() {


  }

  chargeGetter = async (pageSize, pageIndex) => {
    return await api.getChargeList({
      pageSize,
      pageIndex,
      type: 0,
    })
  }

  consumeGetter = async (pageSize, pageIndex) => {
    return await api.getChargeList({
      pageSize,
      pageIndex,
      type: 1,
    })
  }

  renderRow = (rowData, sectionID, rowID) => {
    return (
      <Item multipleLine style={{fontSize:17}} extra={<span style={{color:'var(--red-color)',fontSize:24}}>{rowData.sum}</span>}>
        {rowData.name} <Brief style={{fontSize:12,color:'var(--text-color)'}}>消费时间: {rowData.createTime}</Brief>
      </Item>
    )
  }

  renderRowCharge = (rowData, sectionID, rowID) => {
    return (
      <Item multipleLine style={{fontSize:17}} extra={<span style={{color:'var(--red-color)',fontSize:24}}>{rowData.sum}</span>}>
        {rowData.name} <Brief style={{fontSize:12,color:'var(--text-color)'}}>充值时间: {rowData.createTime}</Brief>
      </Item>
    )
  }

  render() {

    return (
      <div>
        <div style={{ backgroundColor: 'var(--main-color)', height: 120, display: 'flex', alignItems: 'center', color: '#ffffff' }}>
          <div style={{ flexGrow: 1, paddingLeft: 20 }}>
            <div style={{ fontSize: 17 }}>
              余额（元）
          </div>
            <div style={{ fontSize: 32, fontWeight: 'bold', paddingTop: 5 }}>
              {this.props.user.balance}
            </div>
          </div>
          <div style={{ padding: '0 20px' }}>
            <span style={{
              display: 'block',
              border: '1px solid #ffffff',
              borderRadius: '25% / 50%',
              padding: '5px 10px',
              fontSize: 16
            }}
              onClick={ e => this.props.history.push('/charge')}
            >充值</span>
          </div>
        </div>

        <Tabs tabs={tabs}
          initialPage={0}
          tabBarInactiveTextColor="var(--text-color)"
          tabBarActiveTextColor="var(--main-color)"
          tabBarUnderlineStyle={{ width: '25%', transform: 'translateX(50%)', borderColor: 'var(--main-background-color)' }}
        >
          <div>
            <DRListView className={styles.list} getter={this.consumeGetter} renderRow={this.renderRow} listName="charges" height="calc(100vh - 165px)" />
          </div>
          <div>
            <DRListView className={styles.list} getter={this.chargeGetter} renderRow={this.renderRowCharge} listName="charges" height="calc(100vh - 165px)" />
          </div>

        </Tabs>
      </div>
    )
  }
}

export default withUser(Balance)