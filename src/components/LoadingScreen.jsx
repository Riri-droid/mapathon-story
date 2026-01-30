import './LoadingScreen.css'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="earth-loader">
          <div className="earth-circle"></div>
          <div className="earth-orbit"></div>
        </div>
        <h2 className="loading-title">Earth to India</h2>
        <p className="loading-subtitle">Loading your journey...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
