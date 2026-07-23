import "../../styles/StudentDeadlines.css";

function StudentDeadlines() {
  const deadlines = [
    {
      id: 1,
      title: "React Hooks Assignment",
      due: "Tomorrow",
      status: "High",
    },
    {
      id: 2,
      title: "Node.js API Project",
      due: "3 Days",
      status: "Medium",
    },
    {
      id: 3,
      title: "MongoDB Quiz",
      due: "Next Week",
      status: "Low",
    },
  ];

  return (
    <div className="student-deadlines">

      <div className="deadlines-header">
        <h2>Upcoming Deadlines</h2>
        <span>Stay on Track</span>
      </div>

      {deadlines.map((item) => (
        <div
          className="deadline-item"
          key={item.id}
        >
          <div>

            <h3>{item.title}</h3>

            <p>Due: {item.due}</p>

          </div>

          <span
            className={`deadline-status ${item.status.toLowerCase()}`}
          >
            {item.status}
          </span>

        </div>
      ))}

    </div>
  );
}

export default StudentDeadlines;