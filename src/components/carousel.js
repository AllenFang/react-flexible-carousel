import React, { Component } from 'react'
import { getDOMWidth } from '../util/findDOMNode'
import { isFunction } from '../util/validateType'

import Wrapper from './wrapper'
import Thumbs from './Thumbs/thumbs'
import List from './list'
import { ArrowLeft, ArrowRight } from './Arrow/arrow'

class Carousel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      options: {
        listWidth: Math.ceil(props.options.listWidth) || 300,
        listHeight: props.options.listHeight || 400
      },
      wrapperIsHover: false,
      actionID: this.props.options.start_actionID || 0
    }
  }

  componentDidMount() {
    const auto_play_speed = this.props.options.auto_play_speed ? this.props.options.auto_play_speed : 1000
    if (this.props.auto_play && !this.timer) {
      this.timer = setInterval(this._handleAutoPlay.bind(this), auto_play_speed)
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.urls !== this.props.urls ||
      nextState.actionID !== this.state.actionID ||
      nextState.wrapperIsHover !== this.state.wrapperIsHover ||
      nextProps.options.listWidth !== this.props.options.listWidth
  }

  _handleAutoPlay() {
    if (this.state.wrapperIsHover) return
    if (this.state.actionID + 1 >= this.props.urls.length) {
      this.setState({
        actionID: 0
      })
    } else {
      this.setState({
        actionID: this.state.actionID + 1
      })
    }
  }

  _handleWrapperMouseOver() {
    const actionUrl = this.props.urls[this.state.actionID]
    if (this.props.beforeWrapperMouseOver) {
      if (isFunction(this.props.beforeWrapperMouseOver, 'beforeWrapperMouseOver')) {
        this.props.beforeWrapperMouseOver(this.state.actionID, actionUrl)
      }
    }
    this.setState({
      wrapperIsHover: true
    }, () => {
      if (this.props.afterWrapperMouseOver) {
        if (isFunction(this.props.afterWrapperMouseOver, 'afterWrapperMouseOver')) {
          this.props.afterWrapperMouseOver(this.state.actionID, actionUrl)
        }
      }
    })
  }

  _handleWrapperMouseLeave() {
    const actionUrl = this.props.urls[this.state.actionID]
    if (this.props.beforeWrapperMouseLeave) {
      if (isFunction(this.props.beforeWrapperMouseLeave, 'beforeWrapperMouseLeave')) {
        this.props.beforeWrapperMouseLeave(this.state.actionID, actionUrl)
      }
    }
    this.setState({
      wrapperIsHover: false
    }, () => {
      if (this.props.afterWrapperMouseLeave) {
        if (isFunction(this.props.afterWrapperMouseLeave, 'afterWrapperMouseLeave')) {
          this.props.afterWrapperMouseLeave(this.state.actionID, actionUrl)
        }
      }
    })
  }

  _handleArrowLeft() {
    if (this.state.actionID - 1 < 0) return
    this._handleChangeThumbsID(this.state.actionID - 1)
  }

  _handleArrowRight() {
    if (this.state.actionID + 1 >= this.props.urls.length) return
    this._handleChangeThumbsID(this.state.actionID + 1)
  }

  _handleChangeThumbsID(id) {
    if (this.props.beforeActionIDChange) {
      if (isFunction(this.props.beforeActionIDChange, 'beforeActionIDChange')) {
        this.props.beforeActionIDChange(this.state.actionID)
      }
    }
    this.setState({
      actionID: id
    }, () => {
      if (this.props.afterActionIDChange) {
        if (isFunction(this.props.afterActionIDChange, 'beforeActionIDChange')) {
          this.props.afterActionIDChange(this.state.actionID)
        }
      }
    })
  }

  _renderList() {
    const _use_lazy_load = this.props.lazy_load
    return this.props.urls.map((url, idx) => {
      return <List
        width={ Math.ceil(this.props.options.listWidth) }
        height={ this.state.options.listHeight }
        key={ `cm-carousel-list-${url}-${idx}` }
        idx={ idx }
        url={ _use_lazy_load ? (idx === (this.state.actionID - 1) || idx === (this.state.actionID + 1) || idx === (this.state.actionID) ? url : '') : url } />
    })
  }

  render() {
    const _wrapper_style = {
      width: Math.ceil(this.props.options.listWidth),
      position: 'relative'
    }
    const _render_arrow = () => {
      if (this.props.use_arrow) {
        return (
          [
            <ArrowLeft
              key={ `arrow-left` }
              wrapperIsHover={ this.state.wrapperIsHover }
              handleArrowLeft={ this._handleArrowLeft.bind(this) }
              useLeftArrow={ this.props.use_left_arrow }
              wrapperHeight={ this.props.options.listHeight } />,
            <ArrowRight
              key={ `arrow-right` }
              wrapperIsHover={ this.state.wrapperIsHover }
              handleArrowRight={ this._handleArrowRight.bind(this) }
              useRightArrow={ this.props.use_right_arrow }
              wrapperHeight={ this.props.options.listHeight } />
          ]
        )
      }
    }
    const _render_thumbs = () => {
      if (this.props.use_thumbs) {
        return (
          <Thumbs
            thumbsPerPage={ this.props.options.thumbsPerPage }
            actionID={ this.state.actionID }
            listWidth={ Math.ceil(this.props.options.listWidth) }
            urls={ this.props.urls }
            handleChangeThumbsID={ this._handleChangeThumbsID.bind(this) } />
        )
      }
    }
    return (
      <div
        style={ _wrapper_style }>
        <Wrapper
          ref={ node => this.wrapper = node }
          listWidth={ Math.ceil(this.props.options.listWidth) }
          listHeight={ this.state.options.listHeight }
          actionID={ this.state.actionID }
          styleEase={ this.props.styleEase }
          onWrapperMouseOver={ this._handleWrapperMouseOver.bind(this) }
          onWrapperMouseLeave={ this._handleWrapperMouseLeave.bind(this) }>
          { this._renderList.call(this) }
        </Wrapper>
        { _render_arrow() }
        { _render_thumbs() }
      </div>
    )
  }
}

export default Carousel
