import {useState} from 'react'
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {toast} from 'react-hot-toast'

import useAuth from '../../hooks/useAuth.js'
import './Login.css'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  const {login} = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async formData => {
    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      })

      toast.success('Login successful')

      const redirectPath =
        location.state?.from?.pathname || '/dashboard'

      navigate(redirectPath, {replace: true})
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to login. Please check your details.'

      toast.error(message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Digital Identity Guardian</h1>

          <p>
            Sign in to protect and manage your digital
            identity
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
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
              <p className="error-message">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
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
                className="password-toggle"
                onClick={() =>
                  setShowPassword(previous => !previous)
                }
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {errors.password && (
              <p className="error-message">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="login-footer">
          Do not have an account?{' '}
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login