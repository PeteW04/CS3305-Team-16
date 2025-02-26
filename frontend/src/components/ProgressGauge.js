import { useEffect, useState } from 'react';
import { getTasksByUser } from '../api/task';
import "../CSS-files/ProgressGauge.css"

const ProgressGauge = () => {
  const [tasks, setTasks] = useState({
    completedTasks: 0,
    inProgressTasks: 0,
    incompleteTasks: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasksByUser();

        const completedTasks = data.filter(task => task.status === 'done').length;
        const inProgressTasks = data.filter(task => task.status === 'progress').length;
        const incompleteTasks = data.filter(task => task.status === 'todo').length;

        setTasks({
          completedTasks,
          inProgressTasks,
          incompleteTasks,
          total: data.length
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const completedDegree = (tasks.completedTasks / tasks.total) * 180;
  const inProgressDegree = (tasks.inProgressTasks / tasks.total) * 180;
  const incompleteDegree = (tasks.incompleteTasks / tasks.total) * 180; // Add 
  const completedPercent = tasks.total > 0
    ? Math.round((tasks.completedTasks / tasks.total) * 100)
    : 100;


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

  if (loading) return <div>Loading task data...</div>;
  if (error) return <div>Error fetching tasks: {error}</div>;

  return (
    <div className="na">
      <div className="gauge-container">
        <div className="gauge-header">
          <h2>Overall Progress</h2>
          <div className="stat-item total">
            <div className="stat-value"><strong>{tasks.total}</strong></div>
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
                {/* Incomplete (base layer) */}
                <path d={createArc(0, 180, 180)} className="gauge-segment incomplete" />

                {/* Completed (only show if > 0%) */}
                {tasks.completedTasks > 0 && (
                  <path d={createArc(180 - completedDegree, 180, 180)}
                    className="gauge-segment completed" />
                )}

                {/* In Progress (only show if > 0%) */}
                {tasks.inProgressTasks > 0 && (
                  <path d={createArc(
                    180 - completedDegree - inProgressDegree,
                    180 - completedDegree,
                    180
                  )} className="gauge-segment in-progress" />
                )}
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
            <div className="stat-value">{tasks.completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-item in-progress2">
            <div className="stat-value">{tasks.inProgressTasks}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-item incomplete2">
            <div className="stat-value">{tasks.incompleteTasks}</div>
            <div className="stat-label">Incomplete</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProgressGauge

