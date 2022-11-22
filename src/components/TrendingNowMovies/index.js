import {Component} from 'react'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'

/* Add css to your project */
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class TrendingNowMovies extends Component {
  renderSlider = () => {
    const {trendingMovies} = this.props
    //  const {title, posterPath, id} = trendingNowMoviesList

    return (
      <Slider {...settings}>
        {trendingMovies.map(eachMovie => {
          const {title, posterPath, id} = eachMovie
          return (
            <Link to={`/movies/${id}`} className="slick-item" key={id}>
              <img className="logo-image" src={posterPath} alt={title} />
            </Link>
          )
        })}
      </Slider>
    )
  }

  render() {
    return (
      <div className="main-container">
        <div className="slick-container">{this.renderSlider()}</div>
      </div>
    )
  }
}

export default TrendingNowMovies
