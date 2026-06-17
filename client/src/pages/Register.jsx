import { useState }                    from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import axiosInstance                   from '../services/axiosInstance';
import useAuth                         from '../hooks/useAuth';
import InputField                      from '../components/InputField';
import LoadingSpinner                  from '../components/LoadingSpinner';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const Register = () => {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const { user, loading, login } = useAuth();
  const navigate                 = useNavigate();

  if (loading) return <LoadingSpinner />;
  if (user)    return <Navigate to="/" replace />;

  const validate = () => {
    const errs = {};
    if (!form.username) {
      errs.username = 'Username is required';
    }
    if (!form.email) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Invalid email format';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'At least 6 characters';
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.confirmPassword !== form.password) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setErrors({});
    setSubmitting(true);

    try {
      const { data } = await axiosInstance.post('/auth/register', {
        username: form.username,
        email:    form.email,
        password: form.password,
      });
      login(data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="auth-subtitle">Start listing properties today</p>

        {serverError && <div className="alert alert--error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <InputField
            label="Username"
            name="username"
            icon={<UserIcon />}
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="e.g. john_doe"
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            icon={<EmailIcon />}
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Min. 6 characters"
          />
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Repeat your password"
          />
          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
