import React, { Component } from 'react'
import { TextareaItem, Button, List, Tag } from 'antd-mobile'
import Rate from 'components/Rate'
import api from '../api'

export default class Comment extends Component {
  state = {
    order: {},
    descList: {},
    greeter: {},
    waiters: [],

    waiterRate: {
      
    },
    greeterRate: {
      rate:0
    },
    environmentRate: {
      rate:0
    },
    text: '',
  }

  id = this.props.match.params.id

  componentDidMount() {
    api.getRateWords({orderId: this.id})
      .then(r => {
        const waiterRate = {}
        r.waiters.forEach(v => {
          waiterRate[v.id] = {
            rate: 0,
            tags: [],
          }
        })
        const greeterRate = {
          rate: 0,
          tags: [],
        }
        const environmentRate = {
          rate: 0,
          tags: [],
        }

        this.setState({
          ...r,
          waiterRate,
          greeterRate,
          environmentRate,
        })
      })
  }

  onWaiterRate = (id, star) => {
    const waiterRate = this.state.waiterRate
    waiterRate[id].rate = star
    waiterRate[id].tags = []
    this.setState({
      waiterRate
    })
  }

  onGreeterRate = (star) => {
    const greeterRate = this.state.greeterRate
    greeterRate.rate = star
    greeterRate.tags = []
    this.setState({
      greeterRate
    })
  }

  onEnvironmentRate = (star) => {
    const environmentRate = this.state.environmentRate
    environmentRate.rate = star
    environmentRate.tags = []
    this.setState({
      environmentRate
    })
  }
  
  onWaiterTagClick = (id, tagID) => {
    const waiterRate = this.state.waiterRate
    const tags = waiterRate[id].tags
    const index = tags.indexOf(tagID)
    if (index >= 0) {
      tags.splice(index, 1)
    } else {
      tags.push(tagID)
    }
    waiterRate[id].tags = tags

    this.setState({
      waiterRate
    })
  }

  onGreeterTagClick = (tagID) => {
    const greeterRate = this.state.greeterRate
    const tags = greeterRate.tags
    const index = tags.indexOf(tagID)
    if (index >= 0) {
      tags.splice(index, 1)
    } else {
      tags.push(tagID)
    }
    greeterRate.tags = tags

    this.setState({
      greeterRate
    })
  }

  onEnvironmentTagClick = (tagID) => {
    const environmentRate = this.state.environmentRate
    const tags = environmentRate.tags
    const index = tags.indexOf(tagID)
    if (index >= 0) {
      tags.splice(index, 1)
    } else {
      tags.push(tagID)
    }
    environmentRate.tags = tags

    this.setState({
      environmentRate
    })
  }

  onTextChange = (v) => {
    this.setState({
      text: v,
    })
  }

  submit = () => {
    const { waiterRate, greeterRate, environmentRate, text, descList } = this.state
    for (let w in waiterRate) {
      waiterRate[w].tags = waiterRate[w].tags.map((v, i) => descList.waiters[waiterRate[w].rate][v - 1].val).join(',')
    }
    greeterRate.tags = greeterRate.tags.map((v, i) => descList.greeter[greeterRate.rate][v - 1].val).join(',')
    environmentRate.tags = environmentRate.tags.map((v, i) => descList.environment[environmentRate.rate][v - 1].val).join(',')
    
    api.postRate({
      orderId: this.id,
      waiterRate,
      greeterRate,
      environmentRate,
      text,
    }).then(r => this.props.history.go(-1) )
  }




  render() {
    const { state } = this
    return (
      <div style={{ padding: '20px', color: '#505050' }}>
        <div style={{ fontSize: 32, fontWeight: '600', color: 'var(--text-black-color)', marginBottom: 10 }}>{state.order.service}</div>
        <div style={{ fontSize: 15, marginBottom: 5 }}>服务门店: {state.order.store}</div>
        <div style={{ fontSize: 15, marginBottom: 40 }}>服务时间: {state.order.date}</div>
        <div style={{ fontSize: 17, color: 'var(--text-black-color)', marginBottom: 20 }}>技师评价</div>
        <List className="dr-list-without-line dr-list-without-padding" style={{ marginBottom: 20 }} >
          {
            state.waiters.map(v => (
              <div key={v.id}>
                <List.Item key={v.id} style={{ marginBottom: 17 }}
                  thumb={
                    <img src={v.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  }
                  extra={
                    <Rate value={state.waiterRate[v.id].rate} onClick={star => this.onWaiterRate(v.id, star)} />
                  }>
                  {v.employeeNum}
                </List.Item>
                <div>
                  {
                    state.waiterRate[v.id].rate !== 0 ?
                      state.descList.waiters[state.waiterRate[v.id].rate].map(t => (
                        <Tag key={state.waiterRate[v.id].rate + '_' + t.type} selected={state.waiterRate[v.id].tags.includes(t.type)} 
                        onChange={e => this.onWaiterTagClick(v.id, t.type)} style={{ margin: '0 5px 5px 0' }}>{t.val}</Tag>
                      ))
                      : ''
                  }
                </div>
              </div>
            ))
          }
        </List>
        <hr className="hr-light" style={{ marginBottom: 20 }} />
        <div style={{ fontSize: 17, color: 'var(--text-black-color)', marginBottom: 20 }}>迎宾评价</div>
        <List className="dr-list-without-line dr-list-without-padding" style={{ marginBottom: 20 }} >
          {
            state.greeter.id ?
              <div>
                <List.Item key={state.greeter.id} style={{ marginBottom: 17 }}
                  thumb={
                    <img src={state.greeter.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  }
                  extra={
                    <Rate value={this.state.greeterRate.rate} onClick={star => this.onGreeterRate(star)} />
                  }>{state.greeter.name}</List.Item>
                <div>
                  {
                    state.greeterRate.rate !== 0 ?
                      state.descList.greeter[state.greeterRate.rate].map(t => (
                        <Tag key={state.greeterRate.rate + '_' + t.type} selected={state.greeterRate.tags.includes(t.type)} 
                        onChange={e => this.onGreeterTagClick(t.type)} style={{ margin: '0 5px 5px 0' }}>{t.val}</Tag>
                      ))
                      : ''
                  }
                </div>
              </div>
              : ''
          }
        </List>
        <hr className="hr-light" />
        <List className="dr-list-without-line dr-list-without-padding" style={{ marginBottom: 10 }} >
          <List.Item extra={
            <Rate value={this.state.environmentRate.rate} onClick={star => this.onEnvironmentRate(star)} />
          }>清洁卫生</List.Item>
          <div>
            {
              state.environmentRate.rate !== 0 ?
                state.descList.environment[state.environmentRate.rate].map(t => (
                  <Tag key={state.environmentRate.rate + '_' + t.type} selected={state.environmentRate.tags.includes(t.type)} 
                  onChange={e => this.onEnvironmentTagClick(t.type)} style={{ margin: '0 5px 5px 0' }}>{t.val}</Tag>
                ))
                : ''
            }
          </div>
          <TextareaItem
            rows={3} value={state.text} onChange={this.onTextChange}
            placeholder="您的评价是我们提升的动力"
            style={{ border: '1px solid #d8d8d8', borderRadius: '4px', padding: 10, boxSizing: 'border-box' }}
          />
        </List>

        <Button type="primary" onClick={this.submit}>提交评价</Button>
      </div>
    )
  }
}