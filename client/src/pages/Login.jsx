import { useState }                    from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import axiosInstance                   from '../services/axiosInstance';
import useAuth                         from '../hooks/useAuth';
import InputField                      from '../components/InputField';
import LoadingSpinner                  from '../components/LoadingSpinner';

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

const Login = () => {
  const [form, setForm]               = useState({ email: '', password: '' });
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const { user, loading, login } = useAuth();
  const navigate                 = useNavigate();

  if (loading) return <LoadingSpinner />;
  if (user)    return <Navigate to="/" replace />;

  const validate = () => {
    const errs = {};
    if (!form.email)    errs.email    = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
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
      const { data } = await axiosInstance.post('/auth/login', form);
      login(data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to manage your listings</p>

        {serverError && <div className="alert alert--error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
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
            placeholder="Your password"
          />
          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
