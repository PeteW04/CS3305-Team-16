import "../CSS-files/ProgressGauge.css"

const ProgressGauge = () => {

  //add yere database data here x
  var completedTasks = 40;
  var inProgressTasks = 40;
  var incompleteTasks = 40;
  var totalTasks = (completedTasks + inProgressTasks + incompleteTasks);

  var completedDegree = (completedTasks / totalTasks) * 180;
  var inProgressDegree = (inProgressTasks / totalTasks) * 180;
  //var incompleteDegrees = (incompleteTasks / totalTasks) * 180;

  var completedPercent= Math.round((completedTasks / totalTasks)*100);


  const createArc = (startAngle, endAngle, radius) => {
    const start = polarToCartesian(200, 200, radius, endAngle)
    const end = polarToCartesian(200, 200, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  }

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  return (
    <div className="stupidretarded">
    <div className="gauge-container">
      <div className="gauge-header">
        <h2>Overall Progress</h2>
        <div className="stat-item total">
          <div className="stat-value"><strong>{totalTasks}</strong></div>
          <div className="stat-label">Total Tasks</div>
        </div>
        
      </div>

      <div className="gauge-wrapper">
        <svg className="gauge" viewBox="0 0 400 50">
          <g transform="translate(0, 240) scale(1, -1)">
            {/* Tick marks */}
            <g className="tick-marks">
              {Array.from({ length: 50 }).map((_, i) => {
                const angle = (i * 180) / 49
                const start = polarToCartesian(200, 200, 200, angle)
                const end = polarToCartesian(200, 200, 210, angle)
                return (
                  <line
                    key={i}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="2"
                  />
                )
              })}
              
            </g>

            {/* Gauge segments */}
            <g>
              {/* Green segment (completed) */}
              <path d={createArc(0, 180, 180)} className="gauge-segment incomplete" />
              {/* Pink segment (incomplete) */}
              <path d={createArc(0, (inProgressDegree+completedDegree), 180)} className="gauge-segment in-progress" />
              {/* Orange segment (in progress) */}
              <path d={createArc(0, completedDegree, 180)} className="gauge-segment completed" />
            </g>
          </g>
        </svg>

        <div className="gauge-center">
        <div className="percentage">{completedPercent}%</div>
        <div className="label">Completed</div>
          
        </div>
      </div>

      <div className="stats-container">
        
        <div className="stat-item completed2">
          <div className="stat-value">{completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-item in-progress2">
          <div className="stat-value">{inProgressTasks}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-item incomplete2">
          <div className="stat-value">{incompleteTasks}</div>
          <div className="stat-label">Incomplete</div>
        </div>

      </div>
    </div>
    </div>
  )
}

export default ProgressGauge

