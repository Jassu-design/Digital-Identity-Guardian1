import useAuth from '../../hooks/useAuth.js'

import './Profile.css'

const Profile = () => {
  const {user} = useAuth()

  const getInitials = name => {
    if (!name) {
      return 'U'
    }

    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  const formatDate = dateValue => {
    if (!dateValue) {
      return 'Not available'
    }

    return new Date(dateValue).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    'User'

  const userEmail = user?.email || 'Not available'

  const userRole =
    user?.role ||
    user?.userRole ||
    'User'

  const organizationName =
    user?.organization?.name ||
    user?.organizationName ||
    'Not assigned'

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <h1>My Profile</h1>

          <p>
            View your account and organization information.
          </p>
        </div>
      </div>

      <section className="profile-card">
        <div className="profile-avatar">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={userName}
            />
          ) : (
            <span>{getInitials(userName)}</span>
          )}
        </div>

        <div className="profile-primary-info">
          <h2>{userName}</h2>

          <p>{userEmail}</p>

          <span className="profile-role">
            {userRole}
          </span>
        </div>
      </section>

      <section className="profile-details-card">
        <h2>Account Information</h2>

        <div className="profile-details-grid">
          <div className="profile-detail-item">
            <p className="profile-detail-label">
              Full Name
            </p>

            <p className="profile-detail-value">
              {userName}
            </p>
          </div>

          <div className="profile-detail-item">
            <p className="profile-detail-label">
              Email Address
            </p>

            <p className="profile-detail-value">
              {userEmail}
            </p>
          </div>

          <div className="profile-detail-item">
            <p className="profile-detail-label">
              Role
            </p>

            <p className="profile-detail-value">
              {userRole}
            </p>
          </div>

          <div className="profile-detail-item">
            <p className="profile-detail-label">
              Organization
            </p>

            <p className="profile-detail-value">
              {organizationName}
            </p>
          </div>

          <div className="profile-detail-item">
            <p className="profile-detail-label">
              Account Status
            </p>

            <p className="profile-detail-value">
              {user?.isActive === false
                ? 'Inactive'
                : 'Active'}
            </p>
          </div>

          <div className="profile-detail-item">
            <p className="profile-detail-label">
              Member Since
            </p>

            <p className="profile-detail-value">
              {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile