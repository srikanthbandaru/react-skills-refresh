import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as redditActions from '../actions';
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import NoteToSelf from './NoteToSelf'
import download from 'downloadjs'

class App extends Component {

  componentDidMount() {
    const { selectedReddit } = this.props
    this.props.actions.fetchPostsIfNeeded(selectedReddit)

    // this.generateURL(); // To download chandamama books
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedReddit !== this.props.selectedReddit) {
      const { selectedReddit } = nextProps
      this.props.actions.fetchPostsIfNeeded(selectedReddit)
    }
  }

  handleChange = nextReddit => {
    this.props.actions.selectReddit(nextReddit)
  }

  handleRefreshClick = e => {
    e.preventDefault()

    const { selectedReddit } = this.props
    this.props.actions.invalidateReddit(selectedReddit)
    this.props.actions.fetchPostsIfNeeded(selectedReddit)
  }

  // Download a file form a url.
  saveFile(url, filename) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
      a.download = filename; // Set the file name.
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    };
    xhr.open('GET', url);
    xhr.send();
  }

  generateURL() {
    let startYear = 1947;
    let endYear = 2007;
    let baseURL = "http://chandamama.in/resources";
    let language = "telugu";
    let yearRangeStart = startYear; // For first time year range which is 1947-1949
    let yearRangeEnd = yearRangeStart%10 === 0 ? yearRangeStart + 3 : yearRangeStart + 2; // For first time year range which is 1947-1949

    for(let i=0; i < (endYear-startYear+1); i++) { // Loop through all the years from 1947 - 2007
      let currentYear = startYear + i;

      if(currentYear - 1 === yearRangeEnd) { // If currentYear JUST exceeded previous yearRangeEnd, construct a new yearRange
          yearRangeStart = currentYear;
          yearRangeEnd =
            yearRangeStart%10 === 0
              ? yearRangeStart + 3
              : yearRangeStart === 2007 // to include 'today' in the year range if it starts with 2007
              ? 'today'
              : yearRangeStart + 2;
      }

      let yearRange = `${yearRangeStart}-${yearRangeEnd}`;

      for (let j = 0; j < 12; j++) { // Loop through 12 months of a particular year coming from upper Loop
        let currentMonth = j + 1;
        let fileURL = `${baseURL}/${language}/${yearRange}/Chandamama-${currentYear}-${currentMonth}.pdf`;
        console.log(fileURL);
        this.saveFile(fileURL, `Chandamama-${currentYear}-${currentMonth}.pdf`);
      }
    }
  }

  render() {
    const { selectedReddit, posts, isFetching, lastUpdated } = this.props
    const isEmpty = posts.length === 0
    return (
      <div>
        <NoteToSelf />
        <Picker value={selectedReddit}
                onChange={this.handleChange}
                options={[ 'reactjs', 'frontend' ]} />
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching &&
            <button onClick={this.handleRefreshClick}>
              Refresh
            </button>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts posts={posts} />
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedReddit, postsByReddit } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsByReddit[selectedReddit] || {
    isFetching: true,
    items: []
  }

  return {
    selectedReddit,
    posts,
    isFetching,
    lastUpdated
  }
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(redditActions, dispatch)
	}
}

App.propTypes = {
    selectedReddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
