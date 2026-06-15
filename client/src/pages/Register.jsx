import { useState }           from 'react';
import { useNavigate, Link }  from 'react-router-dom';
import axiosInstance          from '../services/axiosInstance';
import useAuth                from '../hooks/useAuth';
import InputField             from '../components/InputField';

const Register = () => {
  const [form, setForm]               = useState({ username: '', email: '', password: '' });
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]         = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = 'Username is required';
    if (!form.email)    errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password)              errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    return errs;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setErrors({});
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/auth/register', form);

      login(data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="auth-subtitle">Start listing properties today</p>

        {serverError && <div className="alert alert--error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <InputField label="Username" name="username" value={form.username} onChange={handleChange} error={errors.username} />
          <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
          <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} />
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;