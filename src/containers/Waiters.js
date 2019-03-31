import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Waiters.module.scss'
import classnames from 'classnames'
import api from '../api'
import DRListView from 'components/DRListView'

class Waiters extends Component {
  state = {
    orderId: this.props.match.params.id,
    serviceId: this.props.location.state.serviceId,
    orderBy: 0,
    onlyFree: false,
    checkedEmployee: '',
  }

  componentDidMount() {

  }

  getter = async (pageSize, pageIndex) => {
    return await api.getEmployeeByService({
      per: pageSize,
      page: pageIndex,
      serviceId: this.state.serviceId,
      onlyFree: false,
      orderBy: 'performance', // evaluation
    })
  }

  renderRow = (v) => (
    <div key={v.id} className={styles.item}>
      <img src={v.avatar} alt="" width="80" height="80" style={{ borderRadius: '50%' }} onClick={e => this.detailOpen(v.id)} />
      <div className={styles.itemInfo} onClick={e => this.employeeCheck(v.id)}>
        <div className={styles.itemName}>{v.employeeNum}</div>
        <div className={styles.rate}>
          <span>
            {
              new Array(v.star).fill('').map((v, i) => <FontAwesomeIcon key={'faStar' + i} icon="star" />)
            }
            {
              new Array(5 - v.star).fill('').map((v, i) => <FontAwesomeIcon key={'farStar' + i} icon={['far', 'star']} />)
            }
          </span>
          {v.rate}
        </div>
        <div className={styles.rate}>服务{v.times}次</div>
        <div className={styles.waitingQueue}>等待60分钟</div>
        <div className={classnames(styles.itemCheck, { [styles.checked]: this.state.checkedEmployee === v.id })}></div>
      </div>
    </div>
  )

  setOrderBy = (orderBy) => {
    this.setState({
      orderBy
    })
  }

  detailOpen = () => {

  }

  employeeCheck = (id) => {
    this.setState({
      checkedEmployee: id
    })
  }

  submit = () => {
    api.patchOrderEmployee({
      waiters: this.state.checkedEmployee,
      orderId: this.state.orderId,
    }).then(e => {
      this.props.history.push('/')
    })
  }

  render() {
    const state = this.state
    return (
      <div style={{ padding: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className={classnames(styles.filter, { [styles.active]: state.orderBy === 0 })}
            onClick={e => this.setOrderBy(0)}
          >服务数排序</div>
          <div className={classnames(styles.filter, { [styles.active]: state.orderBy === 1 })}
            onClick={e => this.setOrderBy(1)}
          >好评优先</div>
          <div className={classnames(styles.filter, { [styles.active]: state.onlyFree === true })}
            onClick={e => this.setState({ onlyFree: !state.onlyFree })}
          >
            <div className={classnames(styles.radio, { [styles.checked]: state.onlyFree === true })}></div>
            只看空闲</div>
        </div>
        <DRListView ref={el => this.list = el} getter={this.getter}
          renderRow={this.renderRow} listName="stores" height="calc(100vh - 54px)"
        />
        <Button type="primary" onClick={this.submit} disabled={!state.checkedEmployee}>确定</Button>
      </div>
    )
  }
}

export default Waiters