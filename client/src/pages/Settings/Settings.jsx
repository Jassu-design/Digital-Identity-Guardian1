import {useEffect, useState} from 'react'
import {toast} from 'react-hot-toast'

import './Settings.css'

const defaultSettings = {
  emailNotifications: true,
  securityAlerts: true,
  incidentUpdates: true,
  weeklyReports: false,
  compactView: false,
}

const Settings = () => {
  const [settings, setSettings] = useState(
    defaultSettings,
  )

  useEffect(() => {
    const savedSettings =
      localStorage.getItem('userSettings')

    if (!savedSettings) {
      return
    }

    try {
      const parsedSettings = JSON.parse(savedSettings)

      setSettings({
        ...defaultSettings,
        ...parsedSettings,
      })
    } catch (error) {
      console.error(
        'Unable to load saved settings:',
        error,
      )
    }
  }, [])

  const handleSettingChange = event => {
    const {name, checked} = event.target

    setSettings(currentSettings => ({
      ...currentSettings,
      [name]: checked,
    }))
  }

  const handleSaveSettings = event => {
    event.preventDefault()

    localStorage.setItem(
      'userSettings',
      JSON.stringify(settings),
    )

    toast.success('Settings saved successfully')
  }

  const handleResetSettings = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all settings?',
    )

    if (!confirmed) {
      return
    }

    setSettings(defaultSettings)

    localStorage.setItem(
      'userSettings',
      JSON.stringify(defaultSettings),
    )

    toast.success('Settings reset successfully')
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>

        <p>
          Manage your notifications and application
          preferences.
        </p>
      </div>

      <form
        className="settings-form"
        onSubmit={handleSaveSettings}
      >
        <section className="settings-section">
          <div className="settings-section-heading">
            <h2>Notifications</h2>

            <p>
              Select the notifications you want to receive.
            </p>
          </div>

          <label className="settings-option">
            <div>
              <h3>Email Notifications</h3>

              <p>
                Receive general account notifications by
                email.
              </p>
            </div>

            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleSettingChange}
            />
          </label>

          <label className="settings-option">
            <div>
              <h3>Security Alerts</h3>

              <p>
                Receive alerts about high-risk security
                activity.
              </p>
            </div>

            <input
              type="checkbox"
              name="securityAlerts"
              checked={settings.securityAlerts}
              onChange={handleSettingChange}
            />
          </label>

          <label className="settings-option">
            <div>
              <h3>Incident Updates</h3>

              <p>
                Receive notifications when an incident
                status changes.
              </p>
            </div>

            <input
              type="checkbox"
              name="incidentUpdates"
              checked={settings.incidentUpdates}
              onChange={handleSettingChange}
            />
          </label>

          <label className="settings-option">
            <div>
              <h3>Weekly Reports</h3>

              <p>
                Receive a weekly summary of security
                activity.
              </p>
            </div>

            <input
              type="checkbox"
              name="weeklyReports"
              checked={settings.weeklyReports}
              onChange={handleSettingChange}
            />
          </label>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <h2>Display Preferences</h2>

            <p>
              Customize how information appears on your
              dashboard.
            </p>
          </div>

          <label className="settings-option">
            <div>
              <h3>Compact View</h3>

              <p>
                Display incident cards with less spacing.
              </p>
            </div>

            <input
              type="checkbox"
              name="compactView"
              checked={settings.compactView}
              onChange={handleSettingChange}
            />
          </label>
        </section>

        <div className="settings-actions">
          <button
            type="submit"
            className="save-settings-button"
          >
            Save Settings
          </button>

          <button
            type="button"
            className="reset-settings-button"
            onClick={handleResetSettings}
          >
            Reset Settings
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings