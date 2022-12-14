import merge from 'lodash/merge';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import parse from 'html-react-parser';
import purify from 'dompurify';
// @mui
import { Alert, AlertTitle, Collapse, Card, CardHeader, Box, TextField } from '@mui/material';
//
import { tokenEmpty } from '../../utils/orms_commonly_script';
import { BaseOptionChart } from '../../components/chart';
import Service from '../../service/custom_module.service';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    year: 2021,
    data: [
      { name: 'Selesai', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
      { name: 'Berjalan', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] }
    ]
  },
  {
    year: 2022,
    data: [
      { name: 'Selesai', data: [148, 91, 69, 62, 49, 51, 35, 41, 10, 0, 0] },
      { name: 'Berjalan', data: [45, 77, 99, 88, 77, 56, 13, 34, 10, 0, 0] }
    ]
  }
];

export default function YearlyOrder() {
  const [seriesData, setSeriesData] = useState(2022);
  // const [chartData, setChartData] = useState([]);

  const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        dashboardChartYearly();
      }
      setLoad(false);
    }
  }, [load]);

  const dashboardChartYearly = () => {
    // setLoading(true);
    Service.dashboardChartYearly()
      .then((response) => {
        if (response.status === 200) {
          // const dataProses = response.data.yearly_prosess;
          // const dataComplete = response.data.yearly_completed;
          const current = new Date();
          const year = current.getFullYear();
          const month = current.getMonth();
          const startDate = new Date(year - 3, month, 1);
          const endDate = new Date(year, month, 1);
          while (startDate <= endDate) {
            startDate.setDate(startDate.getMonth() + 1);
          }
          // setChartData(response.data);
        }
        // setLoading(false);
      })
      .catch((e) => {
        // setLoading(false);
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
      });
  };

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Des']
    }
  });

  return (
    <Card>
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
      <CardHeader
        title="Yearly Order"
        subheader="(+43%) than last year"
        action={
          <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 }
            }}
          >
            {CHART_DATA.map((option) => (
              <option key={option.year} value={option.year}>
                {option.year}
              </option>
            ))}
          </TextField>
        }
      />

      {CHART_DATA.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && <ReactApexChart type="area" series={item.data} options={chartOptions} height={364} />}
        </Box>
      ))}
    </Card>
  );
}
