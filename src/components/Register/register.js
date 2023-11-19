import { useState } from 'react';
import { Button, Form, Input, Layout, Radio, theme } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import { googleLogin, register } from '../../redux/actions/authActions';
import './register.css';
import notification from '../../constants/notification';

const { Content } = Layout;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    email: null,
    password: null,
    confirmPassword: null,
    type: null,
  });

  const [validator, setValidator] = useSimpleReactValidator(
    {},
    {
      matchPassword: {
        message: 'Password doesn`t match',
        rule: (val, params, validator) => {
          return val === fields?.password;
        },
      },
      passwwordLength: {
        message: 'Password should be atleast of 6 digits',
        rule: (val, params) => {
          return val && val.length >= 6;
        },
      },
    }
  );

  const handleChange = (e, field) => {
    setFields(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleGoogleLogin = async () => {
    try {
      if (validator.fieldValid('Type')) {
        await dispatch(googleLogin(fields));
      } else {
        validator.getErrorMessages();
        setValidator(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (validator.allValid()) {
        const res = await dispatch(register(fields));
        if (res) {
          console.log('register');
          setLoading(false);
          navigate('/login');
        } else throw new Error('failed');
      } else {
        setLoading(false);
        validator.getErrorMessages();
        setValidator(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <Content>
        <div className="login-page">
          <div className="login-box">
            <div className="illustration-wrapper" style={{ background: '#fff' }}>
              <img
                src="https://thumbs.dreamstime.com/b/black-reservation-isolated-vector-icon-simple-element-illustration-hotel-restaurant-concept-icons-editable-logo-symbol-143597356.jpg"
                alt="Login"
              />
            </div>
            <Form
              className="login-form"
              name="login-form"
              initialValues={{ remember: true }}
              layout="vertical"
            >
              <p className="form-title">Register</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                }}
              >
                <p></p>
              </div>
              <Form.Item
                className=""
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span> Email{' '}
                  </span>
                }
                name="email"
              >
                {' '}
                <Input
                  type="text"
                  placeholder="Enter your Email"
                  value={fields.email}
                  onChange={e => handleChange(e, 'email')}
                  autoComplete="new-password"
                  className="custom-input"
                />{' '}
                <div className={validator.errorMessages.email ? 'error-message' : ''}>
                  {' '}
                  {validator.message('Email', fields.email, 'required|email')}{' '}
                </div>
              </Form.Item>
              <Form.Item
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span> Password{' '}
                  </span>
                }
                name="password"
              >
                {' '}
                <Input.Password
                  placeholder="Enter your Password"
                  value={fields.password}
                  onChange={e => handleChange(e, 'password')}
                  autoComplete="new-password"
                  className="custom-input"
                />{' '}
                <div className={validator.errorMessages.password ? 'error-message' : ''}>
                  {' '}
                  {validator.message('Password', fields.password, 'required|passwwordLength')}{' '}
                </div>
              </Form.Item>
              <Form.Item
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span> Confirm Password{' '}
                  </span>
                }
                name="password"
              >
                {' '}
                <Input.Password
                  placeholder="Enter your Password"
                  value={fields.confirmPassword}
                  onChange={e => handleChange(e, 'confirmPassword')}
                  autoComplete="new-password"
                  className="custom-input"
                />{' '}
                <div className={validator.errorMessages.confirmPassword ? 'error-message' : ''}>
                  {' '}
                  {validator.message(
                    'Password',
                    fields.confirmPassword,
                    'required|matchPassword'
                  )}{' '}
                </div>
              </Form.Item>
              <Form.Item
                label={
                  <span className="label">
                    <span className="required-asterisk">*</span> Account Type{' '}
                  </span>
                }
              >
                <Radio.Group onChange={e => handleChange(e, 'type')} value={fields.type}>
                  <Radio value={1}>User</Radio>
                  <Radio value={2}>Restaurant Owner</Radio>
                </Radio.Group>
                <div className={validator.errorMessages.type ? 'error-message' : ''}>
                  {' '}
                  {validator.message('Type', fields.type, 'required')}{' '}
                </div>
              </Form.Item>
              <Form.Item>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                  }}
                >
                  <p>
                    Already have an account? <a href="/login">Sign In</a>
                  </p>
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  className="login-form-button"
                  type="primary"
                  htmlType="submit"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  {' '}
                  Sign Up{' '}
                </Button>
              </Form.Item>
              <Form.Item>
                <span style={{ display: 'flex', justifyContent: 'center' }}>Or</span>
              </Form.Item>
              <Form.Item>
                <GoogleButton
                  className="google"
                  label="Sign Up with Google"
                  style={{ width: '100%' }}
                  onClick={() => handleGoogleLogin()}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};
export default Register;
