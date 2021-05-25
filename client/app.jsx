import axios from 'axios';
import Rating from './components/Rating.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
//import Gift from 'styled-components';
import Subjects from './components/Subjects.jsx';
import Wishlist from './components/Wishlist.jsx';
import Share from './components/Share.jsx';
import ShareModal from './components/ShareModal.jsx'
import moment from 'moment';
import { BodyWrapper, Title, Tagline, BestBox, Bestseller, RatingWrapper,AuthorWrapper, AuthorName, TrailingInfo, SmallIcon, InfoText, UpdatedIcon, GlobeIcon, CCIcon } from './components/Styles.jsx';



class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overview: {},
      review: {
        average: 0,
        total: 0
      },
      updatedAt: '1-1-2021',
      showModal: false
    };
    this.shareClick = this.shareClick.bind(this);
  }

  componentDidMount() {
    const regex = /\d+/;
    let course = window.location.search.match(regex) === null ? 5 : window.location.search.match(regex)[0];
    console.log(course);
    console.log('Updated at', moment(this.state.updatedAt).format('M/YYYY'));
    this.getOverview(course);
  }

  getOverview(id = 5) {
    axios.get(`http://localhost:3000/overview/?courseId=${id}`)
      .then((res) => {
        let overview = res.data;
        let review = this.state.review;
        this.setState({
          overview: overview
        });
      })
      .then(() => {
        axios.get(`http://localhost:2712/reviews/item?courseId=${id}`)
        .then((res) => {
          console.log(res.data);
          let overallRating = res.data.ratings.overallRating;
          let totalRatings = res.data.ratings.totalRatings;
          this.setState({
            review: {
              average: overallRating,
              total: totalRatings
            }
          });
        })
        .then(() => {
          axios.get(`http://ec2-18-130-234-175.eu-west-2.compute.amazonaws.com:9800/course/item?courseId=${id}`)
          .then((res) => {
            let updatedAt = res.data.updatedAt;
            this.setState({
              updatedAt: updatedAt
            });
          })
          .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  shareClick (e) {
    if (e.target.id.indexOf('share') !== -1) {
      console.log('Clicked');
      this.setState({
        showModal: true
      })
    }
  }

  render () {
    return (
      <BodyWrapper>
        <ShareModal showModal={this.state.showModal} handleClick={this.shareClick} />
        <div><Subjects subjects={this.state.overview.subjects} /></div>
        <Title>{this.state.overview.title}</Title>
        <Tagline>{this.state.overview.tagline}</Tagline>
        <BestBox><Bestseller>Bestseller</Bestseller></BestBox>
        <RatingWrapper><Rating average={this.state.review.average} total={this.state.review.total} students={this.state.overview.students} /></RatingWrapper>
        <AuthorWrapper>Created by <AuthorName>Constanza Nomina</AuthorName></AuthorWrapper>
        <TrailingInfo>
          <SmallIcon viewBox="0 0 24 24">
            {UpdatedIcon}
          </SmallIcon>
          <InfoText>Last updated {moment(this.state.updatedAt).format('M/YYYY')}</InfoText>
        </TrailingInfo>
        <TrailingInfo>
          <SmallIcon viewBox="0 0 24 24">
            {GlobeIcon}
          </SmallIcon>
          <InfoText>{this.state.overview.language}</InfoText>
        </TrailingInfo>
        <TrailingInfo>
          <SmallIcon viewBox="0 0 24 24">
            {CCIcon}
          </SmallIcon>
          <InfoText>{this.state.overview.captions ? this.state.overview.captions.join(', ') : null}</InfoText>
        </TrailingInfo>
        <Wishlist />
        <Share handleClick={this.shareClick} />
        {/*<Gift /*/}
      </BodyWrapper>
    );
  }
}

ReactDOM.render(<Overview />, document.getElementById('overview'));

export default Overview;