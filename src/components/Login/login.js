import { useState } from 'react';
import { Button, Form, Input, Layout, theme, Radio } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GoogleButton from 'react-google-button';
import useSimpleReactValidator from '../../helpers/useReactSimpleValidator';
import { googleLogin, login } from '../../redux/actions/authActions';
import './login.css';
import notification from '../../constants/notification';
import { handleSidebarChange } from '../../redux/actions/sidebarAction';

const { Content } = Layout;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    email: null,
    password: null,
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
        const res = await dispatch(googleLogin(fields));
        if (res) {
          fields.type.toString() === '1'
            ? await dispatch(handleSidebarChange('/restaurantListing'))
            : await dispatch(handleSidebarChange('/reservationListing'));
          fields.type.toString() === '1'
            ? navigate('/restaurantListing')
            : navigate('/reservationListing');
        } else {
          throw new Error('login failed');
        }
      } else {
        validator.showMessageFor('Type');
        setValidator(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (validator.allValid()) {
      try {
        const res = await dispatch(login(fields));
        if (res) {
          await dispatch(handleSidebarChange('/restaurantListing'));
          setLoading(false);
          fields.type.toString() === '1'
            ? navigate('/restaurantListing')
            : navigate('/reservationListing');
        } else {
          throw new Error('Login Failed');
        }
      } catch (err) {
        setLoading(false);
      }
    } else {
      setLoading(false);
      validator.getErrorMessages();
      setValidator(true);
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
              <p className="form-title">Login</p>
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
                    Don't have an account yet? <a href="/register">Sign Up</a>
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
                  Log In{' '}
                </Button>
              </Form.Item>
              <Form.Item>
                <span style={{ display: 'flex', justifyContent: 'center' }}>Or</span>
              </Form.Item>
              <Form.Item>
                <GoogleButton
                  className="google"
                  label="Sign In with Google"
                  style={{ width: '100%' }}
                  onClick={async () => handleGoogleLogin()}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
};
export default Login;
