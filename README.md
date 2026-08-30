# GMT Learning Management System (LMS)

A full-stack Learning Management System developed for GMT Software Academy.

The platform provides dedicated experiences for **Administrators, Instructors, and Students**, with role-based authentication and access control.

---

## Overview

GMT LMS is designed to manage academic activities from a centralized platform.

The system allows administrators to manage the institution, instructors to manage their assigned courses and students, and students to enroll in courses, track their learning progress, complete assignments, view announcements, and manage their academic records.

The project is built with a modern JavaScript stack using React, Node.js, Express, and MongoDB.

---

## User Roles

### Administrator

Administrators have full access to the LMS and can manage:

- Dashboard
- Students
- Users
- Courses
- Enrollments
- Assignments
- Announcements
- Certificates
- System settings
- Instructor accounts

---

### Instructor

Instructors have restricted access to the administrative system.

They can:

- View their dashboard
- View courses assigned to them
- Manage their course information
- View students enrolled in their courses
- Monitor course enrollments
- Manage assignments
- Create course-specific announcements
- View course-related academic information

Instructors cannot access administrative-only areas such as:

- User management
- Global student management
- All enrollments
- Certificate administration
- System settings

---

### Student

Students have access to their own learning environment.

They can:

- View their dashboard
- Browse available courses
- Enroll in courses
- View enrolled courses
- Track course progress
- Continue learning
- View assignments
- View course announcements
- View certification information
- Manage their profile
- Manage student settings

---

## Core Features

### Authentication & Authorization

- JWT-based authentication
- Secure login
- User registration
- Password reset functionality
- Role-based access control
- Protected frontend routes
- Protected backend routes
- Admin, Instructor, and Student permissions

---

### Course Management

Administrators can create and manage courses.

Courses contain information such as:

- Course title
- Course code
- Category
- Level
- Duration
- Instructor
- Price
- Status
- Enrolled students

Instructors can access and manage courses assigned to them.

---

### Course Enrollment

Students can enroll in available courses.

The enrollment system records:

- Student
- Course
- Start date
- End date
- Progress
- Enrollment status
- Completion date
- Certificate approval status

Enrollment progress can move through:

```text
Enrolled
    ↓
In Progress
    ↓
Completed
