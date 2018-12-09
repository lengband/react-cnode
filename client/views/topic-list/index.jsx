import React from 'react'
import PropTypes from 'prop-types'
import {
  observer,
  inject,
} from 'mobx-react'
import { AppState } from '../../store/app-state'

@inject('appState')
@observer
class TopicList extends React.Component {
  static propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
  }

  componentDidMount () {
  }

  render () {
    const { appState } = this.props
    return (
      <div>
        this is topic list:
        {appState.msg}
      </div>
    )
  }
}

// TopicList.PropTypes = {
//   appState: PropTypes.instanceOf(AppState).isRequired,
// }

export default TopicList
