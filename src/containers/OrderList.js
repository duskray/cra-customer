import React, { Component } from 'react';
import { Tabs, Modal } from 'antd-mobile'
import DRListView from 'components/DRListView'
import { orderStatus } from 'utils'
import api from '../api'

const orderType = [
  { title: <div>全部</div>, value: '-1' },
  { title: <div>待支付</div>, value: '0' },
  { title: <div>已支付</div>, value: '1' },
  { title: <div>待服务</div>, value: '2' },
  { title: <div>服务中</div>, value: '3' },
  { title: <div>已完成</div>, value: '4,5' },
]

class OrderList extends Component {
  state = {
    type: this.props.location.state ? this.props.location.state.type : 0,
  }

  componentDidMount = async () => {

  }

  typeSet = (v) => {
    this.setState({
      type: v,
    }, e => {
      this.drListView.get()
    })
  }

  getter = async (pageSize, pageIndex) => {
    return await api.getOrderList({
      pageSize,
      pageIndex,
      status: orderType[this.state.type].value,
    })
  }

  orderDelete = (id) => {
    Modal.alert('删除订单', '确定要删除订单么？', [
      { text: '取消', onPress: () => { } },
      {
        text: '确认', onPress: async () => {
          await api.deleteOrder({orderId: id})
          this.drListView.get()
        }
      },
    ])

  }

  renderRow = (rowData, sectionID, rowID) => {
    return (
      <div style={{ padding: '20px 20px 0 20px' }} onClick={e => this.props.history.push('/order/' + rowData.id)}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 18 }}>{rowData.storeName}</span>
          <span style={{ fontSize: 16, float: 'right', color: 'var(--text-color)' }}>{orderStatus[rowData.status]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }} >
          <img src={rowData.thumb} alt="" style={{ display: 'block', width: 80, height: 80 }} />
          <div style={{ flexGrow: 1, lineHeight: '1.5em', paddingLeft: 10 }}>
            <div>
              <span style={{ fontSize: 18, marginRight: 5 }}>{rowData.serviceName}</span>
              <span style={{ fontSize: 12, fontWeight: 300 }}>{rowData.duration}分钟</span>
              <span style={{ fontSize: 24, fontWeight: 600, float: 'right', color: 'var(--red-color)' }}><i style={{ fontSize: 12, fontStyle: 'normal' }}>￥</i>{rowData.price}</span>
            </div>
            {
              rowData.type === 0 ?
                // 普通
                <div style={{ color: 'var(--text-color)' }}>
                  <div>服务人数: {rowData.quantity}人</div>
                  <div>下单时间: {rowData.createTime}</div>
                </div>
                :
                // 预约
                <div style={{ color: 'var(--text-color)' }}>
                  <div>服务人数: {rowData.quantity}人</div>
                  <div>预约时间: {rowData.startTime}</div>
                  <div>预约技师: {rowData.employeeNum}</div>
                </div>
            }
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: 20 }}>
          {
            // rowData.status === 0 ?
            //   <div style={{
            //     flexBasis: '25%', boxSizing: 'border-box', fontSize: 16, padding: '4px 5px', margin: '0 5px',
            //     borderRadius: '15% / 50%', textAlign: 'center',
            //     color: 'var(--main-color)', border: '1px solid var(--main-color)',
            //   }}>
            //     立即支付
            // </div> : ''
          }
          {
            // rowData.status === 0 || rowData.status === 1 ?
            //   <div style={{
            //     flexBasis: '25%', boxSizing: 'border-box', fontSize: 16, padding: '4px 5px', margin: '0 5px',
            //     borderRadius: '15% / 50%', textAlign: 'center',
            //     color: 'var(--text-color)', border: '1px solid var(--text-color)',
            //   }}
            //     onClick={e => {
            //       e.stopPropagation()
            //       this.props.history.push('/cancel', { id: rowData.id })
            //     }}
            //   >
            //     取消订单
            //   </div> : ''
          }
          {
            [4, 5, 6, 7].includes(rowData.status) ?
              <div style={{
                flexBasis: '25%', boxSizing: 'border-box', fontSize: 16, padding: '4px 5px', margin: '0 5px',
                borderRadius: '15% / 50%', textAlign: 'center',
                color: 'var(--text-color)', border: '1px solid var(--text-color)',
              }}
                onClick={e => {
                  e.stopPropagation()
                  this.orderDelete(rowData.id)
                }}
              >
                删除订单
            </div> : ''
          }
          {
            rowData.status === 4 && rowData.autoClose !== 1 ?
              <div style={{
                flexBasis: '25%', boxSizing: 'border-box', fontSize: 16, padding: '4px 5px', margin: '0 5px',
                borderRadius: '15% / 50%', textAlign: 'center',
                color: 'var(--text-color)', border: '1px solid var(--text-color)',
              }}
                onClick={e => {
                  e.stopPropagation()
                  this.props.history.push('/comment/' + rowData.id)
                }}
              >
                评价
          </div> : ''
          }
        </div>
        <hr className="hr-light" />
      </div>
    )
  }


  render() {
    const state = this.state

    return (
      <div>
        <Tabs tabs={orderType}
          initialPage={state.type}
          page={state.type}
          onTabClick={(tab, index) => this.typeSet(index)}
          tabBarInactiveTextColor="var(--text-color)"
          tabBarActiveTextColor="var(--main-color)"
          tabBarUnderlineStyle={{ borderColor: 'var(--main-color)' }}
        >
        </Tabs>
        <DRListView ref={el => this.drListView = el} getter={this.getter} renderRow={this.renderRow} listName="orders" height="calc(100vh - 65px)" />
      </div>
    );
  }
}

export default (OrderList)
