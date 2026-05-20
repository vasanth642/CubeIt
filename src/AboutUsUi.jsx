import React from 'react'
import './AboutUsUi.css'

function AboutUsUI({ setActiveView }) {
  return (


    <div className='about-us-container'>
      <h1 className='heading'>About Us</h1>
      <div className='card'><h2><img src="https://unpkg.com/lucide-static@latest/icons/timer.svg" alt="timer" width="32" height="32" className="heading-icon" style={{ verticalAlign: 'middle', marginRight: '10px', filter: 'invert(1)' }} />Modernizing the speedcubing experience</h2>
        <p>
          Cubeit combines high-performance timing tools with real-time 3D scramble visualization to create an immersive cubing experience.
          Whether you're a beginner learning algorithms or a competitive cuber tracking progress, Cubeit delivers precision, engagement, and performance insights
        </p>
      </div>

      <div className='card'>
        <h2>Real-Time 3D Scramble Visualization <img src="https://unpkg.com/lucide-static@latest/icons/box.svg" alt="cube" width="32" height="32" className="heading-icon" style={{ verticalAlign: 'middle', marginRight: '10px', filter: 'invert(1)' }} />
        </h2>
        <p>Cubeit brings scrambles to life through a fully interactive 3D cube visualization system. Instead of static 2D grids, users can explore realistic cube states in real time with smooth rendering and intuitive interactions.

          Designed for modern speedcubers, this feature creates a more engaging and visually immersive practice experience.</p>


      </div>
      <div className='card'><h3>difference between 2d timers and Cubeit</h3>

      </div>
      <table>
        <tr>
          <td className='traditional_td th'>
            Traditional 2D Timers
          </td>
          <td className='cubeit_td th'>
            Cubeit
          </td>
        </tr>
        <tr>
          <td className='traditional_td'>
            Scramble visualization: Flat 2D grids with static images representing each face
          </td>
          <td className='cubeit_td'>
            Scramble visualization: Fully interactive 3D cube with real-time rendering and manipulation
          </td>
        </tr>
        <tr>
          <td className='traditional_td'>
            User experience: Linear, text-based presentation of moves without visual context
          </td>
          <td className='cubeit_td'>
            User experience: Immersive 3D environment where users can see and interact with the cube as it scrambles
          </td>
        </tr>
        <tr>
          <td className='traditional_td'>
            Engagement: Passive visualization that requires mental translation to understand cube state
          </td>
          <td className='cubeit_td'>
            Engagement: Active visualization that enhances learning and retention through visual feedback
          </td>
        </tr>
        <tr>
          <td className='traditional_td'>
            Technology: Basic web technologies with limited visual capabilities
          </td>
          <td className='cubeit_td'>
            Technology: Modern 3D graphics with WebGL and advanced rendering techniques
          </td>
        </tr>
        <tr>
          <td className='traditional_td'>
            Target Audience: Traditional cubers who prefer simple, text-based interfaces
          </td>
          <td className='cubeit_td'>
            Target Audience: Modern cubers seeking engaging, visually immersive, and interactive tools
          </td>
        </tr>
      </table>
      <div className='card'>
        <h2><img src="https://unpkg.com/lucide-static@latest/icons/medal.svg" alt="medal" width="32" height="32" className="heading-icon" style={{ verticalAlign: 'middle', marginRight: '10px', filter: 'invert(1)' }} />Our Mission</h2>
        <p>Cubeit is built to modernize the speedcubing experience through immersive and interactive tools. Unlike traditional timers that rely on flat 2D scramble grids, Cubeit features real-time 3D scramble visualization that allows users to view an actual 3D representation of their scrambled cube state.

          By combining high-performance timing tools with realistic 3D interactions, Cubeit creates a more engaging and intuitive solving experience for speedcubers of all skill levels.</p>
      </div>


      <div className='card'>
        <h2>CubeIt Community</h2>

        <img src="/cube-icon.png" alt="cubeit icon" />
        <p>Join CubeIt  on GitHub</p>
        <p><a href="https://github.com/vasanth642/CubeIt" target="_blank" ><img className="github-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="github" width="28" height="28" /></a>CubeIt</p>





      </div>

      <button className='about-us-button' onClick={() => setActiveView('home')}>Start Solving</button>


    </div>

  )
}

export default AboutUsUI






