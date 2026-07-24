const welcomeEmail = (user, studentId, loginUrl) => {
  return `
  <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:40px;">

    <div style="
      max-width:650px;
      margin:auto;
      background:#fff;
      border-radius:12px;
      overflow:hidden;
      box-shadow:0 8px 20px rgba(0,0,0,.08);
    ">

      <div style="
        background:#0f172a;
        color:#fff;
        padding:30px;
        text-align:center;
      ">

        <h1>Welcome to GMT LMS 🎉</h1>

        <p>Your learning journey starts here.</p>

      </div>

      <div style="padding:35px;">

        <h2>Hello ${user.name},</h2>

        <p>
          Thank you for registering on
          <strong>GMT Learning Management System.</strong>
        </p>

        <p>Your account has been created successfully.</p>

        <table style="width:100%;margin:30px 0;">

          <tr>
            <td><strong>Student ID</strong></td>
            <td>${studentId}</td>
          </tr>

          <tr>
            <td><strong>Email</strong></td>
            <td>${user.email}</td>
          </tr>

          <tr>
            <td><strong>Role</strong></td>
            <td>Student</td>
          </tr>

        </table>

        <div style="text-align:center;margin:35px 0;">

          <a
            href="${loginUrl}"
            style="
              background:#2563eb;
              color:white;
              padding:15px 35px;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Login Now
          </a>

        </div>

        <h3>You can now:</h3>

        <ul>
          <li>Browse Courses</li>
          <li>Enroll in Programs</li>
          <li>Submit Assignments</li>
          <li>Track Progress</li>
          <li>Earn Certificates</li>
        </ul>

      </div>

      <div style="
        background:#f8fafc;
        padding:20px;
        text-align:center;
        color:#666;
      ">

        © ${new Date().getFullYear()} GMT Software Solutions

      </div>

    </div>

  </div>
  `;
};

module.exports = welcomeEmail;