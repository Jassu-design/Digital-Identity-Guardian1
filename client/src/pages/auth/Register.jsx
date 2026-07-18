import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {toast} from 'react-hot-toast'

import useAuth from '../../hooks/useAuth.js'
import './Register.css'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const {register: registerUser} = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  const onSubmit = async formData => {
    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })

      toast.success('Account created successfully')
      navigate('/dashboard', {replace: true})
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to create your account.'

      toast.error(message)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1>Create your account</h1>

          <p>
            Start protecting your digital identity
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="register-form-group">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              className={errors.name ? 'input-error' : ''}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message:
                    'Name must contain at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message:
                    'Name cannot exceed 50 characters',
                },
              })}
            />

            {errors.name && (
              <p className="register-error-message">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="register-email">
              Email address
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className={errors.email ? 'input-error' : ''}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />

            {errors.email && (
              <p className="register-error-message">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <div className="register-password-field">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                autoComplete="new-password"
                className={
                  errors.password ? 'input-error' : ''
                }
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message:
                      'Password must contain at least 6 characters',
                  },
                })}
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowPassword(previous => !previous)
                }
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {errors.password && (
              <p className="register-error-message">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <div className="register-password-field">
              <input
                id="confirmPassword"
                type={
                  showConfirmPassword ? 'text' : 'password'
                }
                placeholder="Enter password again"
                autoComplete="new-password"
                className={
                  errors.confirmPassword
                    ? 'input-error'
                    : ''
                }
                {...register('confirmPassword', {
                  required:
                    'Please confirm your password',
                  validate: value =>
                    value === password ||
                    'Passwords do not match',
                })}
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    previous => !previous,
                  )
                }
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="register-error-message">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Creating account...'
              : 'Create account'}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register