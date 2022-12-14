import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// @mui
import { Alert, AlertTitle, Collapse, OutlinedInput, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import parse from 'html-react-parser';
import purify from 'dompurify';
import Service from '../../../service/core_parameter.service';

// ----------------------------------------------------------------------
VerifyCodeForm.propTypes = { dataRegister: PropTypes.object };

export default function VerifyCodeForm({ dataRegister }) {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required('Code is required'),
    code2: Yup.string().required('Code is required'),
    code3: Yup.string().required('Code is required'),
    code4: Yup.string().required('Code is required'),
    code5: Yup.string().required('Code is required'),
    code6: Yup.string().required('Code is required')
  });

  const formik = useFormik({
    initialValues: {
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      code5: '',
      code6: ''
    },
    validationSchema: VerifyCodeSchema,
    onSubmit: (data) => {
      if (Number(Object.values(data).join('')) !== dataRegister?.verify_code) {
        setError(true);
        setMessage('Verify code invalid');
      } else {
        setLoading(true);
        Service.register(dataRegister)
          .then((response) => {
            if (response.data.code === 200) {
              navigate('/login', {
                state: { success: true, msg: 'Successfully register' },
                replace: true
              });
            } else if (response.data.code === 400) {
              setError(true);
              setMessage(response.data.message);
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }
            setLoading(false);
          })
          .catch((e) => {
            setError(true);
            if (typeof e?.response !== 'undefined') {
              setMessage(e.response?.data?.message);
            } else {
              setMessage(e.toString());
            }
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            setLoading(false);
          });
      }
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  // useEffect(() => {
  //   // document.addEventListener('paste', handlePasteClipboard);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const handlePasteClipboard = (event) => {
  //   let data = event?.clipboardData?.getData('Text') || '';

  //   data = data.split('');

  //   [].forEach.call(document.querySelectorAll('#field-code'), (node, index) => {
  //     node.value = data[index];
  //     const fieldIndex = `code${index + 1}`;
  //     setValue(fieldIndex, data[index]);
  //   });
  // };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Collapse in={error}>
          <Alert
            severity="error"
            sx={{ mb: 5 }}
            onClose={() => {
              setError(false);
            }}
          >
            <AlertTitle>Error</AlertTitle>
            {parse(purify.sanitize(message))}
          </Alert>
        </Collapse>
        <Stack direction="row" spacing={2} justifyContent="center">
          <OutlinedInput
            placeholder="-"
            {...getFieldProps('code1')}
            error={Boolean(touched.code1 && errors.code1)}
            inputProps={{
              maxLength: 1,
              sx: {
                p: 0,
                textAlign: 'center',
                width: { xs: 36, sm: 56 },
                height: { xs: 36, sm: 56 }
              }
            }}
          />
          <OutlinedInput
            placeholder="-"
            {...getFieldProps('code2')}
            error={Boolean(touched.code2 && errors.code2)}
            inputProps={{
              maxLength: 1,
              sx: {
                p: 0,
                textAlign: 'center',
                width: { xs: 36, sm: 56 },
                height: { xs: 36, sm: 56 }
              }
            }}
          />
          <OutlinedInput
            placeholder="-"
            {...getFieldProps('code3')}
            error={Boolean(touched.code3 && errors.code3)}
            inputProps={{
              maxLength: 1,
              sx: {
                p: 0,
                textAlign: 'center',
                width: { xs: 36, sm: 56 },
                height: { xs: 36, sm: 56 }
              }
            }}
          />
          <OutlinedInput
            placeholder="-"
            {...getFieldProps('code4')}
            error={Boolean(touched.code4 && errors.code4)}
            inputProps={{
              maxLength: 1,
              sx: {
                p: 0,
                textAlign: 'center',
                width: { xs: 36, sm: 56 },
                height: { xs: 36, sm: 56 }
              }
            }}
          />
          <OutlinedInput
            placeholder="-"
            {...getFieldProps('code5')}
            error={Boolean(touched.code5 && errors.code5)}
            inputProps={{
              maxLength: 1,
              sx: {
                p: 0,
                textAlign: 'center',
                width: { xs: 36, sm: 56 },
                height: { xs: 36, sm: 56 }
              }
            }}
          />
          <OutlinedInput
            placeholder="-"
            {...getFieldProps('code6')}
            error={Boolean(touched.code6 && errors.code6)}
            inputProps={{
              maxLength: 1,
              sx: {
                p: 0,
                textAlign: 'center',
                width: { xs: 36, sm: 56 },
                height: { xs: 36, sm: 56 }
              }
            }}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
          disabled={Boolean(!dataRegister)}
          sx={{ mt: 3 }}
        >
          Verify
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
